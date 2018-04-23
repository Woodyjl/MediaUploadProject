var mongoose = require('mongoose');
var path = require('path');
var DATABASE_URI = require(path.join(__dirname, '../environment')).DATABASE_URI;

mongoose.connect(DATABASE_URI);

var db = mongoose.connection;

require('./models');

db.on('error', console.error.bind(console, 'database connection error:'));
db.once('open', function() {
    // we're connected!
    console.log("Connection to database was successful!!!")
});

