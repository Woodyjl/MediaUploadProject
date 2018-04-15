# MediaUploadProject

This project is a class assignment that allows users to select and upload either text, image, video, or audio for a location. 

## Understanding the Process

There are three general steps to the media upload process.
1. Media Selection
2. Metadata Validation
3. Media Upload

## Technologies in Use
Javascript, Amazon Web Services S3, ...

Current project uses credentials from an aws S3 bucket owned by Woody Jean-Louis and will be disabled at the end of this project, so remember to change testing credentials for proper use and to add production credentials as environment variables for release. 

## Metadata Key/Value data

Below are the properties that will be available in every metadata object saved in the database. Please keep in mind that every key is not required and will not be available for certain media types, so certain values may be undefined. 


### Title: string (Required)

### Creator: string (Required)

### Subject (Caption): string (Optional)

### Description: string (Rquired when mediatype is text, optional otherwise)

### Publisher: string (Optional)

### Contributor (Contributor(s)): string (Optional)

### Date: String (Required)
Date object using Coordinated Universal Time (UTC)

### Type: string (Required)
* Text: just text
* Video: mp4, mov, flv, wmv, avi
* Image: jpeg, tiff, png
* Audio: mp3, wav, aiff, ogg

### Format: string (Required)
* Text, video, image, or audio

### Identifier: string (Required)
Assigned by database team

### Source: string (Optional)

### Language: string (Required)

### Relation: string (Optional)

### Coverage: JSON object (Required)
This key is usually a string, but because of the requirements of other teams we decided to let this be a JSON object which will contain geospacial data. The information passed by the search team will be saved as the value of this key, So other teams can feel free to add useful information to that object. 
#### Note: Expected information like latitude and longitude should be keys in the object passed.

### Rights: string (Optional)

### Resolution: string (Required for image and video media types)
Pixels in “####x####” format

### File size: string (Required for image, video, and audio media types)
Maximum file size: 10 mb

### Duration: integer (Required for video and audio media types) 
In milliseconds
