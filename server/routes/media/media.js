var express = require('express');
var router = express.Router();
const Joi = require('joi');
const env = require('../../environment/index');
const AWS_BUCKET_NAME = env.AWS.bucketName;
const AWS_ACCESS_ID = env.AWS.accessKeyId;
const AWS_SECRET_KEY = env.AWS.secretAccessKey;
var crypto = require( "crypto" );

const mongoose = require('mongoose');
const uploadTasks = mongoose.model('UploadTasks');

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
    description : Joi.string().when('format', { is: Joi.valid('text'), then: Joi.string().required().max(characterMax * 5), otherwise: Joi.string().max(500) }),
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

function removeUploadTask(uploadTask) {

}

function saveMetadata(metadata) {

}

router.post('/validateMetadata', function (req, res, next) {

    var metadata = req.body.metadata;

    if (metadata === undefined || metadata instanceof Object === false) {
        var error = new Error("metadata is undefined or not a javascript object");
        error.status = 400;
        next(error);
        return;
    }

    const redirectUrl = "http://example.com/uploadsuccess";

    const result = Joi.validate(metadata, metadataSchema);

    if (result.error !== null) {
        next(result.error);
        return;
    }

    metadata = result.value;

    // We only want to continue if the format is anything other than text
    if (metadata.format === 'text') {
        res.send({});
        return;
    }

    //var s3PolicyBase64;
    const date = new Date();

    // set time to an hour from now
    date.setTime(date.getTime() + 1 * 60 * 60 * 1000);

    const s3Policy = {
        "expiration": date.toISOString(),
        "conditions": [
            { "bucket": AWS_BUCKET_NAME },
            ["starts-with", "$Content-Disposition", ""],
            ["starts-with", "$key", "someFilePrefix_"],
            { "acl": "public-read" },
            { "success_action_redirect": redirectUrl },
            ["content-length-range", 0, 10 * 1048576],
            ["eq", "$Content-Type", metadata.type]
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

        res.send({ uploadTask : uploadTask });
        next();
    });
});

//router.post();


module.exports =  router;