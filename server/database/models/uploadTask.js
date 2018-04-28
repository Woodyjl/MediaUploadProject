var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    metadata: {
        type: Object
    },
    s3Credentials: {
        type: Object
    },
    expiration: {
        type: String
    }
});

mongoose.model("UploadTasks", schema);