var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    metadata: {
        type: Object,
        required : true
    },
    s3Credentials: {
        type: Object,
        required: true
    },
    expiration: {
        type: String,
        required: true
    }
});

mongoose.model("UploadTasks", schema);