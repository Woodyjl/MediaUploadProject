var express = require('express');
var router = express.Router();
const Joi = require('joi');
const env = require('../../environment/index');
const AWS_BUCKET_NAME = env.AWS.bucketName;
const AWS_ACCESS_ID = env.AWS.accessKeyId;
const AWS_SECRET_KEY = env.AWS.secretAccessKey;
const uuidv1 = require('uuid/v1');
var crypto = require( "crypto" );
var AWS = require('aws-sdk');
var CronJob = require('cron').CronJob;


const mongoose = require('mongoose');
const uploadTasks = mongoose.model('UploadTasks');
const metadatas = mongoose.model('Metadata');

const characterMax = 100;


const MEDIA_TYPES = {
    text : ['text'],
    video : ['mp4', 'mov', 'flv', 'wmv', 'avi'],
    image : ['jpeg', 'tiff', 'png'],
    audio : ['mp3', 'wav', 'aiff', 'ogg']
};

const metadataSchema = Joi.object().keys({
    title : Joi.string().required().max(characterMax),
    creator : Joi.string().required().max(characterMax),
    subject : Joi.string().optional().max(characterMax),
    description : Joi.string().when('format', { is: Joi.valid('text'), then: Joi.string().required().max(characterMax * 5), otherwise: Joi.string().max(characterMax * 5) }),
    publisher : Joi.string().optional().max(characterMax),
    contributor : Joi.string().optional().max(characterMax),
    date : Joi.string().required().regex(/^[0-9]{4}-[0-9]{1,2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$/),
    type : Joi.alternatives().when('format', { is: 'text', then: Joi.valid(MEDIA_TYPES.text), otherwise: Joi.alternatives().when('format', { is: 'video', then: Joi.valid(MEDIA_TYPES.video), otherwise: Joi.alternatives().when('format', { is: 'image', then: Joi.valid(MEDIA_TYPES.image), otherwise: Joi.alternatives().when('format', { is: 'audio', then: Joi.valid(MEDIA_TYPES.audio)})})})}),
    format : Joi.string().required().valid(['text','image','video','audio']),
    identifier : Joi.string().max(characterMax),
    source : Joi.string().optional().max(characterMax),
    language : Joi.string().required().max(characterMax),
    relation : Joi.string().optional().max(characterMax),
    coverage : Joi.object()
        .keys({
            latitude: Joi.number().required(),
            longitude: Joi.number().required()
        })
        .required(),
    rights : Joi.string().optional().max(characterMax),
    resolution : Joi.string().when('format', { is: Joi.valid('image', 'video'), then: Joi.string().required().regex(/^[1-9]+x[1-9]+$/), otherwise: Joi.any().strip() }),
    fileSize : Joi.string().when('format', { is: Joi.valid('image', 'video', 'audio'), then: Joi.string().required().regex(/^[1-9][a-zA-Z][a-zA-Z]$/), otherwise: Joi.any().strip() }),
    duration : Joi.number().integer().positive().when('type', { is: Joi.valid('video', 'audio'), then: Joi.required(), otherwise: Joi.any().strip() })
});



// metadataSchema.validate({
//     title : "The title",
//     creator : "Mr. Creator",
//     subject : undefined,
//     description : "u",
//     publisher : "The Publisher",
//     contributor : "Ms. Contributor",
//     date : "2012-1-31T11:00:00Z",// Joi.date().default(Date.now, 'time of creation'),
//     type : "t",
//     format : "audio",
//     identifier : "d2aLMGT_e2930fafHFI4383-94",
//     // source : "",
//     language : "English",
//     relation : undefined,
//     coverage : {
//         latitude : 1233445,
//         longitude : 987544
//     },
//     rights : undefined,
//     resolution : "1234x5678",
//     fileSize : "9tv",
//     duration : 1
//
// }, function (error, value) {
//     console.log(error);
// });


function createUploadTask(s3Credentials, metadata, callback) {
    uploadTasks.create({
        expiration : s3Credentials.s3Policy.expiration,
        s3Credentials : s3Credentials,
        metadata : metadata
    }, callback);
}

function removeUploadTask(uploadTask, callback) {
    uploadTasks.remove({ size: 'large' }, callback);
}

function saveMetadata(metadata, callback) {
    metadatas.update(metadata.identifier, metadata, callback);
}

function verifyUpload(uploadTask, callback) {
    const metadata = uploadTask.metadata;


    AWS.config = AWS.config || new AWS.Config();
    AWS.config.update({ accessKeyId: AWS_ACCESS_ID, secretAccessKey: AWS_SECRET_KEY, region: 'us-east-1' });

    var s3bucket = new AWS.S3({params: {Bucket: AWS_BUCKET_NAME}, apiVersion: '2006-03-01' });

    var params = {
        MaxKeys: 1, //(Integer) Sets the maximum number of keys returned in the response. The response might contain fewer keys but will never contain more.
        //Marker: '', //(String) Specifies the key to start with when listing objects in a bucket.
        Prefix: metadata.fullFileName  //(String) Limits the response to keys that begin with the specified prefix.
    };

    s3bucket.listObjects(params, function (err, data) {
        if (err) {
            callback(err, false);
            return;
        }

        // File has not been uploaded yet
        if (data.Contents.length === 0) {
            callback(undefined, false);
            return;
        }

        // File has uploaded successfully
        callback(undefined, true);
    });
}

router.post('/validateMetadata', function (req, res, next) {

    var metadata = req.body.metadata;

    console.log(metadata);
    if (metadata === undefined || metadata instanceof Object === false) {
        var error = new Error("metadata is undefined or not a javascript object");
        error.status = 400;
        next(error);
        return;
    }

    const result = Joi.validate(metadata, metadataSchema);

    if (result.error !== null) {
        next(result.error);
        return;
    }

    metadata = result.value;

    // We only want to continue if the format is anything other than text
    if (metadata.format === 'text') {
        saveMetadata(metadata,function (err, metadata) {
            res.send({ metadata: metadata });
            next();
        });
        return;
    }

    const redirectUrl = req.protocol + '://' + req.get('host') + req.originalUrl + "#Success"; //"http://example.com/uploadsuccess";

    const uniqueId = uuidv1(); // ⇨ 'f64f2940-fae4-11e7-8c5f-ef356f279131';
    const fileName = "media/" + uniqueId + "." + metadata.type;
    const fullFileName = "media/" + fileName;

    metadata.fileName = fileName;
    metadata.fullFileName = fullFileName;

    //var s3PolicyBase64;
    const date = new Date();

    // set time to an hour from now
    date.setTime(date.getTime() + 1 * 60 * 60 * 1000);

    const s3Policy = {
        "expiration": date.toISOString(),
        "conditions": [
            { "bucket": AWS_BUCKET_NAME },
            ["starts-with", "$Content-Disposition", ""],
            ["eq", "$key", fullFileName],
            { "acl": "public-read" },
            { "success_action_redirect": redirectUrl },
            ["content-length-range", 0, 10 * 1048576],
            ["eq", "$Content-Type", metadata.format + "/" + metadata.type] //metadata.type]
        ]
    };

    const s3Credentials = {
        s3PolicyBase64: new Buffer( JSON.stringify( s3Policy ) ).toString( 'base64' ),
        s3Signature: crypto.createHmac( "sha1", AWS_SECRET_KEY ).update( s3Policy ).digest( "base64" ),
        s3Key: AWS_ACCESS_ID,
        s3Redirect: redirectUrl,
        s3Policy: s3Policy
    };


    createUploadTask(s3Credentials, metadata, function (error, uploadTask) {
        if (error) {
            next(result.error);
            return;
        }

        // We want the same identifier for metadata object
        uploadTask.metadata.identifier = uploadTask._id;

        uploadTasks.findByIdAndUpdate(uploadTask._id, { $set: { metadata: uploadTask.metadata }}, function (err, updatedUploadTasks) {
            if (err) return handleError(err);

            res.send({ uploadTask : uploadTask });
            next();
        });

    });
});

router.delete('/removeUploadTask/:taskId', function (req, res, next) {
    const taskId = req.params.taskId;

    uploadTasks.findById(taskId, function (error, uploadTask) {
        if (error) {
            next(error);
            return;
        }

        verifyUpload(uploadTask, function (err, verified) {
            if (err) {
                next(err);
                return;
            }

            const expirationDate = new Date(uploadTask.expiration);
            // Task expired
            var isExpired = new Date > expirationDate;

            if (!verified) {
                var error = new Error(isExpired ? "upload task has expired" : "upload was not success or file could not be found");
                error.status = 400;
                next(error);
                return;
            }

            // upload was verified

            removeUploadTask(uploadTask, function (err) {
                if (err) {
                    next(err);
                    return;
                }

                saveMetadata(uploadTask.metadata, function (err, metadata) {
                    if (err) {
                        next(err);
                        return;
                    }

                    res.status(200).end();
                });
            });
        })
    })
});

function autoCheck() {
    uploadTasks.find({}).exec(function (err, multipleUploadTasks) {

        if (err) {
            console.log(err);
            return;
        }

        for (var i = 0; i < multipleUploadTasks.length; i++) {
            console.log(multipleUploadTasks[i]);
        }
        multipleUploadTasks.forEach(function (uploadTask) {
            // Note that next line is an async call
            verifyUpload(uploadTask, function (error, verified) {
                if (error) {
                    console.log(error);
                    return;
                }

                const expirationDate = new Date(uploadTask.expiration);
                // Task expired
                var isExpired = new Date > expirationDate;

                if (!verified && !isExpired) {
                    return;
                }

                // upload was verified or has expired

                removeUploadTask(uploadTask, function (err) {
                    if (err) {
                        next(err);
                        return;
                    }

                    if (verified) {
                        saveMetadata(uploadTask.metadata, function (err, metadata) {

                        });
                    }
                });
            })
        });
    });
}


var job = new CronJob({
    cronTime: '* * 1 * * *', // Runs every hour
    onTick: function() {
        autoCheck();
    },
    start: false,
    timeZone: 'America/Los_Angeles'
});

job.start();


module.exports =  router;