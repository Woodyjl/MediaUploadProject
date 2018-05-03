var mongoose = require('mongoose');

const characterMax = 100;

var schema = new mongoose.Schema({
    metadata: {
        type: Object
    },
    s3Credentials: {
        type: Object
    },
    expiration: {
        type: String
    },

    title : {
        type : String,
        required : true,
        maxlength : characterMax
    },
    creator : {
        type : String,
        required : true,
        maxlength : characterMax
    },
    subject : {
        type : String,
        required : false,
        maxlength : characterMax
    },
    description : {
        type : String,
        required : false, // Needs more logic
        maxlength : characterMax * 5
    },
    publisher : {
        type : String,
        required : false,
        maxlength : characterMax
    },
    contributor : {
        type : String,
        required : false,
        maxlength : characterMax
    },
    date : Date,//"2012-1-31T11:00:00Z",// Joi.date().default(Date.now, 'time of creation'),
    type : {
        type : String,
        required : true,
        maxlength : 10
    },
    format : {
        type : String,
        required : true,
        maxlength : 10
    },
    identifier : {
        type : String,
        required : true
    },
    source : {
        type : String,
        required : false,
        maxlength : characterMax
    },
    language : {
        type : String,
        required : true,
        maxlength : 20
    },
    relation : {
        type : String,
        required : false,
        maxlength : characterMax
    },
    coverage : {
        latitude :  {
            type : Number,
            required : true
        },
        longitude : {
            type : Number,
            required : true
        }
    },
    rights : {
        type : String,
        required : false,
        maxlength : characterMax
    },
    resolution : {
        type : String,
        required : false,
        maxlength : characterMax
    },
    fileSize : {
        type : String,
        required : false,
        maxlength : characterMax
    },
    duration : {
        type : Number,
        required : false
    },
    fileName : {
        type : String,
        required : false
    },
    fullFileName: {
        type : String,
        required : false
    }
});

mongoose.model("Metadata", schema);