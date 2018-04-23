var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    metadata: {
        type: Object
    },
    s3Credentials: {
        type: Object
    }
});

mongoose.model("UploadTasks", schema);