# MediaUploadProject

This project is a class assignment that allows users to select and upload either text, image, video, or audio for a location. 

[![License](https://img.shields.io/cocoapods/l/Hero.svg?style=flat)](https://github.com/lkzhao/Hero/blob/master/LICENSE?raw=true)

## Requirements

Please make sure you have mongodb, npm, and node installed as it is a dependency. Make sure to run npm install to download all third party dependencies.

Also make sure to have an AWS account with S3 services enabled. To ensure security please create an IAM user with PUT and GET permissions for the bucket you intent to use. Additionally, make sure that the bucket has a policy that allows the IAM user to successfully PUT and GET objects it owns.

## Understanding the Process

The process implemented for uploading files to Amazon Web Services(AWS) is their HTML POST form process which allows files to be uploaded to an s3 bucket from a standard browser. This procedure allows us to securely grant permission to any request to upload a specific file to our aws s3 bucket. This process was chosen because it allows direct upload to the s3 bucket which was ideal because we assumed that storage on the server will be limited. Note that this implementation only supports uploading one file at a time to the s3 bucket due to the limitations of the HTML POST form process. We followed these articles in order to correctly implement this process: http://blog.tcs.de/post-file-to-s3-using-node/, https://aws.amazon.com/articles/browser-uploads-to-s3-using-html-post-forms/, https://docs.aws.amazon.com/AmazonS3/latest/dev/HTTPPOSTForms.html.


#### 1. Media Selection and Metadata Creation
This happens on the client side.
todo:

The metadata is then created and sent to the backend for validation.

#### 2. Metadata Validation and AWS S3 Policy Document Creation
The metadata is sent to the "/validateMetadata" endpoint where it is checked for correctness; if the metadata is not correct an error is sent back to the client. If the metadata is correct then we move to the next step! 

PLEASE NOTE: for the text media type this step ends here and skips to part 4.

Next the s3 [policy document](https://docs.aws.amazon.com/AmazonS3/latest/dev/HTTPPOSTForms.html#HTTPPOSTConstructPolicy) is constructed with an expiration date of one hour from the time of validation(S3 will deny requests with an expired policy). PLEASE NOTE: that the access control lists(acl) parameter is set to "public-read", which means that the file uploaded will be public for anyone to download/read. 
Valid Values: private | public-read | public-read-write | aws-exec-read | authenticated-read | bucket-owner-read | bucket-owner-full-control visit [Access Control Lists](https://docs.aws.amazon.com/AmazonS3/latest/dev/Introduction.html#S3_ACLs).

The policy is then used to contruct a [signature](https://docs.aws.amazon.com/AmazonS3/latest/dev/HTTPPOSTForms.html#HTTPPOSTConstructingPolicySignature).

Once this is all done an upload task, which contains s3 credentials and metadata, is created and saved into mongodb, then we send the same upload task to the client.

#### 3. Media Upload

Once the upload task is recieved by the client, we are now ready to submit our form or upload our file to aws s3!😇 

##### ON FAILURE
If the upload was a failure we would allow the client to retry; if the policy expires before a successful upload then the client will have to start over from part 2.😭
##### ON SUCCESS
If the upload was a success then we reach the endpoint "/removeUploadTask/:taskId" on our server with the appropriate taskId.

#### 4. Media Verification and Saving Metadata

For the final step we must verify that upload was actually sucessful. If the file cannot be found then we do nothing and allow the automated checker, which runs every hour, to check for the file and remove orphaned upload tasks(uploads that have expired). If the file was found then the upload task is removed and the metadata for the file is saved in the appropriate location in mongo.

## Technologies in Use
Javascript, Amazon Web Services S3, ...

Current project uses credentials from an aws S3 bucket owned by Woody Jean-Louis and will be disabled at the end of this project, so remember to change testing credentials for proper use and to add production credentials as environment variables for release. 

## Installation

Download files into project.

Edit the /server/environment/development.js to reflect your own local mongodb url.

to start server run `npm start` in terminal


## Metadata Key/Value data

Below are the properties that will be available in every metadata object saved in the database. Please keep in mind that every key is not required and will not be available for certain media types, so certain values may be undefined. 


### Title: string (Required)
Examples:

title="A Pilot's Guide to Aircraft Insurance"
title="The Sound of Music"
title="Green on Greens"
title="AOPA's Tips on Buying Used Aircraft"

### Creator: string (Required)
Examples:

creator="John, Elton"

### Subject (Caption): string (Optional)
Examples:

subject="Aircraft leasing and renting"
subject="Dogs"
subject="Olympic skiing"
subject="Street, Picabo"

### Description: string (Required when mediatype is text, optional otherwise)
Examples:

description="Illustrated guide to airport markings and lighting signals, with particular reference to SMGCS (Surface Movement Guidance and Control System) for airports with low visibility conditions."

description="Teachers Domain is a multimedia library for K-12 science educators, developed by WGBH through funding from the National Science Foundation as part of its National Science Digital Library initiative. The site offers a wealth of classroom-ready instructional resources, as well as online professional development materials and a set of tools which allows teachers to manage, annotate, and share the materials they use in classroom teaching."

### Publisher: string (Optional)
Examples:

publisher="University of South Where"
publisher="Funky Websites, Inc."
publisher="Carmen Miranda"

### Contributor (Contributor(s)): string (Optional)
Examples:

contributor="John, Elton"

### Date: String (Required)
Date object using ISO 8601 format

Examples:

format is "YYYY-MM-DDTHH:mm:ss.sssZ"
date="2012-01-31T11:00:00.000Z"

### Type: string (Required)
* Text: just text
* Video: mp4, mov, flv, wmv, avi
* Image: jpeg, tiff, png
* Audio: mp3, wav, aiff, ogg

Examples:

type="text"
type="mp4"
type="tiff"

### Format: string (Required)
* Text, video, image, or audio
Examples:

format="image"

### Identifier: string (Required)
Assigned by database team

Examples:

identifier="http://purl.oclc.org/metadata/dublin_core/& quot;
identifier="ISBN:0385424728"
identifier="H-A-X 5690B" [publisher number]
### Source: string (Optional)

Examples:

source="RC607.A26W574 1996" [where "RC607.A26W574 1996" is the call number of the print version of the resource, from which the present version was scanned]

source="Image from page 54 of the 1922 edition of Romeo and Juliet"
### Language: string (Required)
Examples:

language="english"
language="french"

### Relation: string (Optional)
Examples:

relation="Elton John's 1976 song Candle in the Wind"
relation="arnhem.gif"

### Coverage: JSON object (Required)
This key is usually a string, but because of the requirements of other teams we decided to let this be a JSON object which will contain geospacial data. The information passed by the search team will be saved as the value of this key, So other teams can feel free to add useful information to that object. 

#### Note: Expected information like latitude and longitude should be keys in the object passed.

### Rights: string (Optional)
Examples:

rights="Access limited to members"

### Resolution: string (Required for image and video media types)
Pixels in “####x####” format

### File size: string (Required for image, video, and audio media types)
Maximum file size: 10 mb

### Duration: integer (Required for video and audio media types) 
In milliseconds
