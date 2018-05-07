//var script = document.createElement('script');
var metadata = {};

var currentUploadTask;

var fileType;
var resolution;
var fileSize;
var duration;
var format;

// format = $('#example').val().split('.').pop().toLowerCase();
// if($.inArray(format, ['mp4', 'mov', 'flv', 'wmv', 'avi']) !== -1) {
//   fileType = "video";
//
//   var video = $('#example');
//   video[0].videoWidth;
//   video[0].videoHeight;
//   resolution = video[0].videoWidth + "x" + video[0].videoHeight;
//
//   //get fileSize
//   //get duration
// }
// else if($.inArray(format, ['jpg', 'jpeg', 'tiff', 'png']) !== -1) {
//   fileType = "image";
//
//   var image = $('#example');
//   image[0].videoWidth;
//   image[0].videoHeight;
//   resolution = image[0].videoWidth + "x" + image[0].videoHeight;
//
//   //get fileSize
// }
// else if($.inArray(format, ['mp3', 'wav', 'aiff', 'ogg']) !== -1) {
//   fileType = "audio";
//   //get fileSize
//   //get duration
//   var audioElement = document.createElement('audio');
//   audioElement.addEventListenever("loadmetadata", function(_event) {
//     duration = audioElement.duration;
//   });
// }


// script.src = 'https://code.jquery.com/jquery-3.3.1.min.js';
// document.getElementsByTagName('head')[0].appendChild(script);

// Customize logic here to retrieve location Id from url
function getLocationId() {
    return "test-Id-001z";
}

var locationId = getLocationId();

function getCoverageDataResponse(res) {


    metadata.coverage = res.data;
}


function getCoverageData(locationId) {
    // For testing purposes only! Remove everything from here to return statement before application is released.

    const coverageData = {
        latitude : 0,
        longitude : 0,
        elevation : 0
        // ...
        // ...
        // Would probably include a bit more data
    };
    getCoverageDataResponse(coverageData);
    return;

    // Ajax call to database for location data
    $.ajax({
        url: "http://localhost:3000/api/location/" + locationId,
        type: "GET",
        dataType: "json",
        success: getCoverageDataResponse,
        error: function(error) {
            // todo: Error!!! handle it
            console.log("Error: " + error);
        }

    });
}


getCoverageData(locationId);


// Beginning of functions relating to upload process

function processResponse( res ) {
    console.log(res);
    return;
    var uploadTask = res.uploadTask;
    var s3Credentials = uploadTask.s3Credentials;
    var metadata = uploadTask.metadata;
    const bucketName = s3Credentials.s3Policy.conditions.bucket;

    $("#myform").attr("action", "https://" + bucketName + ".s3.amazonaws.com/");

    $("#fld_redirect").val(s3Credentials.s3Redirect);
    $("#fld_AWSAccessKeyId").val(s3Credentials.s3Key);
    $("#fld_Policy").val(s3Credentials.s3PolicyBase64);
    $("#fld_Signature").val(s3Credentials.s3Signature);
    $("#fld_contentType").val(metadata.format + "/" + metadata.type);

    // set value of file to specific file
    //$()

    currentUploadTask = uploadTask;

    $("#myform").submit();
}

var requestTheCredentials = function(event) {
    event.preventDefault();

    requestCredentials()
};

function requestCredentials() {
    // disable button to keep user from double clicking
    //$('#submit').disable(true);

    metadata = {
        title : "The title",
        creator : "Mr. Creator",
        subject : undefined,
        description : "u",
        publisher : "The Publisher",
        contributor : "Ms. Contributor",
        date : "2012-1-31T11:00:00Z",// Joi.date().default(Date.now, 'time of creation'),
        type : "t",
        format : "audio",
        identifier : "d2aLMGT_e2930fafHFI4383-94",
        // source : "",
        language : "English",
        relation : undefined,
        coverage : {
            latitude : 1233445,
            longitude : 987544
        },
        rights : undefined,
        resolution : "1234x5678",
        fileSize : "9tv",
        duration : 1
    };

    $.ajax({
        url: "http://localhost:3000/api/mediaUpload/validateMetadata",
        type: "POST",
        data: JSON.stringify(metadata),
        dataType: "json",
        success: processResponse,
        error: function(error) {
            // todo: Error!!! handle it
            console.log("Error: " + JSON.stringify(error));
            alert(JSON.stringify(error));
        }

    });
}

$(document).ready(()=> {
    // Intercepts click event on form submit button
    $( "#btn_submit").bind("click", requestTheCredentials);
});

// $(function(){
//     $("#upload").click(function(){
//
//         requestCredentials()
//     });
// });

function onUploadTaskRemoval(res) {
    // deletion successful
}
function onUploadSuccess() {

    $.ajax({
        url: "http://localhost:3000/api/removeUploadTask/" + currentUploadTask._id,
        type: "DELETE",
        success: onUploadSuccess(),
        error: function(error) {
            // todo: Error!!! handle it
            console.log("Error: " + JSON.stringify(error));
            alert(JSON.stringify(error));
        }

    });
};
