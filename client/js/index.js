var script = document.createElement('script');

script.src = 'https://code.jquery.com/jquery-3.3.1.min.js';
document.getElementsByTagName('head')[0].appendChild(script);

$(function(){
  $("#upload").click(function(){

    window.location.href = "dataInput.html";
  });
});

// Customize logic here to retrieve location Id from url
function getLocationId() {

}

var locationId = getLocationId();


// Ajax call to database for
$.ajax({
    url: "http://localhost:3000/api/mediaUpload/validateMetadata",
    type: "GET",
    dataType: "json",
    success: processResponse,
    error: function(error) {
        // todo: Error!!! handle it
        console.log("Error: " + error);
    }

});





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

    $("#myform").submit();
}

var requestCredentials = function(event) {
    event.preventDefault();

    var metadata;


    // todo: Correctly grab metadata
    metadata = {

        // title : $("#name").val(),
        // name :  {
        //     parameter : $("").val()
        // }
    };

    $.ajax({
        url: "http://localhost:3000/api/mediaUpload/validateMetadata",
        type: "POST",
        data: "testing",//JSON.stringify({data: 'test'}),//metadata,
        dataType: "json",
        success: processResponse,
        error: function(error) {
            // todo: Error!!! handle it
            console.log("Error: " + error);
        }

    });
};

$(document).ready(()=>{
    // Intercepts click event on form submit button
    $( "#btn_submit" ).bind( "click", requestCredentials );
});