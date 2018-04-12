var express = require('express');
var router = express.Router();
const Joi = require('joi');
const env = require('../environment');
const AWS_BUCKET_NAME = env.AWS.bucketName;
const AWS_ACCESS_ID = env.AWS.accessKeyId;
const AWS_SECRET_KEY = env.AWS.secretAccessKey;
var crypto = require( "crypto" );



const metadataSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    access_token: [Joi.string(), Joi.number()],
    birthyear: Joi.number().integer().min(1900).max(2013),
    email: Joi.string().email(),



    title : Joi.string().required(),
    creator : Joi.required(),
    subject : Joi.string(),
    description : Joi.string(),
    publisher : Joi.string(),
    contributor : Joi.string(),
    date : Joi.string(),
    type : Joi.string(),
    format : Joi.string(),
    identifier : Joi.string(),
    source : Joi.string(),
    language : Joi.string(),
    relation : Joi.string(),
    coverage : Joi.string(),
    rights : Joi.string()
});



router.get('', function (req, res, next) {

});

router.post('/validate', function (req, res, next) {

    var metadata = req.body.metadata;

    const result = Joi.validate(metadata, metadataSchema);

    if (result.error !== null) {
        next(result.error);
        return;
    }

    var s3PolicyBase64;
    const date = new Date();

    const s3Policy = {
        "expiration": ""
        + (date.getFullYear())
        + "-" + (date.getMonth() + 1)
        + "-" + (date.getDate()) + "T"
        + (date.getHours() + 1) + ":"
        + (date.getMinutes()) + ":"
        + (date.getSeconds()) + "Z",
        "conditions": [
            { "bucket": AWS_BUCKET_NAME },
            ["starts-with", "$Content-Disposition", ""],
            ["starts-with", "$key", "someFilePrefix_"],
            { "acl": "public-read" },
            { "success_action_redirect": "http://example.com/uploadsuccess" },
            ["content-length-range", 0, 2147483648],
            ["eq", "$Content-Type", mimetype]
        ]
    };

    const s3Credentials = {
        s3PolicyBase64: new Buffer( JSON.stringify( s3Policy ) ).toString( 'base64' ),
        s3Signature: crypto.createHmac( "sha1", AWS_SECRET_KEY ).update( s3Policy ).digest( "base64" ),
        s3Key: AWS_ACCESS_ID,
        s3Redirect: "http://example.com/uploadsuccess",
        s3Policy: s3Policy
    };


    res.send(s3Credentials);
});



var createS3Policy;
var s3Signature;


createS3Policy = function( mimetype, callback ) {


    callback( s3Credentials );
};


module.exports =  router;