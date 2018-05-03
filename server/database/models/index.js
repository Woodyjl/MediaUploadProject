// Require our models -- these should register the model into mongoose
// so the rest of the application can simply call mongoose.model('UploadTasks')
// anywhere the User model needs to be used.
require('./uploadTask');
require('./mediaMetadata');