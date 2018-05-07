var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('./database');

var app = express();

// var HTTPS_PORT = process.env.HTTPS_PORT || 1443;
//
// secureServer.listen(HTTPS_PORT, function() {
//     console.log(chalk.blue('Secure server started on port', chalk.magenta(HTTPS_PORT)));
// });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const mongoose = require('mongoose');
const uploadTasks = mongoose.model('UploadTasks');

app.use('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Headers","*");
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
});

// Routes that will be accessed via AJAX should be prepended with
// /api so they are isolated from our GET /* wildcard.
app.use('/api', require('./routes'));

app.use(express.static(path.join(__dirname, '../client/')));
// app.get('/*', function(req, res) {
//     res.sendFile(path.join(__dirname+'/../client/index.html'));
//     // var html = fs.readFileSync('./html/test.html', 'utf8')
//     // res.render('test', { html: html })
// });



// Error catching endware.
app.use(function(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    //res.json({error : err});
    res.status(err.status || 500)//.send({ error: err.message || 'Internal server error.' });
        .json({
            "message": err.message
        });
});




// const mongoose = require('mongoose');
// const uploadTasks = mongoose.model('UploadTasks');
//
// uploadTasks.create( {
//     metadata : {
//         title : "The title",
//         creator : "Mr. Creator",
//         subject : undefined,
//         description : "u",
//         publisher : "The Publisher",
//         contributor : "Ms. Contributor",
//         date : "2012-1-31T11:00:00Z",// Joi.date().default(Date.now, 'time of creation'),
//         type : "t",
//         format : "audio",
//         identifier : "d2aLMGT_e2930fafHFI4383-94",
//         source : "",
//         language : "English",
//         relation : undefined,
//         coverage : {
//             latitude : 1233445,
//             longitude : 987544
//         },
//         rights : undefined,
//         resolution : "1234x5678",
//         fileSize : "9tv",
//         duration : 1
//
//     }
// }, function (error, metadata) {
//
//     console.log(error);
//     console.log(metadata);
//
//
//     uploadTasks.find({}).exec(function (error, metadata) {
//         console.log(error);
//         console.log(metadata);
//     })
// });



module.exports = app;
