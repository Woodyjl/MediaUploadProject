var script = document.createElement('script');
var metadata = {};

script.src = 'https://code.jquery.com/jquery-3.3.1.min.js';
document.getElementsByTagName('head')[0].appendChild(script);

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

    $("#myform").submit();
}

// var requestCredentials = function(event) {
//     event.preventDefault();
//
//
// };

function requsestCredentials() {
    // disable button to keep user from double clicking
    $('#submit').disable(true);

    $.ajax({
        url: "http://localhost:3000/api/mediaUpload/validateMetadata",
        type: "POST",
        data: JSON.stringify(metadata),
        dataType: "json",
        success: processResponse,
        error: function(error) {
            // todo: Error!!! handle it
            console.log("Error: " + error);
        }

    });
}

// $(document).ready(()=>{
//     // Intercepts click event on form submit button
//     $( "#btn_submit" ).bind( "click", requestCredentials );
// });

$(function(){
    $("#upload").click(function(){

        requsestCredentials()
    });
});