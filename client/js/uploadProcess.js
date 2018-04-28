
// var AWS = window.AWS;
//
// console.log(AWS);
//
// var albumBucketName = 'BUCKET_NAME';
// var bucketRegion = 'REGION';
// var IdentityPoolId = 'IDENTITY_POOL_ID';
//
// AWS.config.update({
//     region: bucketRegion,
//     credentials: new AWS.CognitoIdentityCredentials({
//         IdentityPoolId: IdentityPoolId
//     })
// });
//
// var s3 = new AWS.S3({
//     apiVersion: '2006-03-01',
//     params: {Bucket: albumBucketName}
// });

function processResponse( res ) {
    var uploadTask = res.uploadTask;
    var s3Credentials = uploadTask.s3Credentials;
    var metadata = uploadTask.metadata;

    $("#fld_redirect").val(s3Credentials.s3Redirect);
    $("#fld_AWSAccessKeyId").val(s3Credentials.s3Key);
    $("#fld_Policy").val(s3Credentials.s3PolicyBase64);
    $("#fld_Signature").val(s3Credentials.s3Signature);
    $("#fld_contentType").val(metadata.format + "/" + metadata.type);

    $("#myform").submit();
}

var requestCredentials = function(event) {
    event.preventDefault();
    var file;
    var metadata;

    // todo: Correctly grab the file
    //file = $("#file").val().replace(/.+[\\\/]/, "");
    // todo: Correctly grab metadata
    metadata = {};

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


//
// function uploadMedia(file) {
//
//     s3.upload({
//         Key: photoKey,
//         Body: file,
//         ACL: 'public-read'
//     }, function(err, data) {
//         if (err) {
//             return alert('There was an error uploading your photo: ', err.message);
//         }
//         alert('Successfully uploaded photo.');
//         viewAlbum(albumName);
//     });
//
//
//     $("#fld_redirect").val(res.S3Redirect);
//     $("#fld_AWSAccessKeyId").val(res.s3Key);
//     $("#fld_Policy").val(res.s3PolicyBase64);
//     $("#fld_Signature").val(res.s3Signature);
//     [...]
//     $("#myform").submit();
// }