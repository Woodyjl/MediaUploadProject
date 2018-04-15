# MediaUploadProject

This project is class assignment that allows users to select and upload either text, image, video, or audio for a location. 

## Understanding the Process

There are three general steps to this project.
1. Media Selection
2. Metadata Validation
3. Media Upload

## Technology in Use
Javascript, Amazon Web Services S3

Current project uses a credentials from an aws S3 bucket owned by Woody Jean-Louis and will be disabled at the end of this project, so remember to change testing credentials for proper use and to add production credentials as environment variables for release. 

## Metadata Key/Value data

Below are the properties that will available in the evety metadata object saved in the database. Please keep in mind that every key is not required and not available for certain media types, so certain values may be undefined. 


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
Handled by database

### Source: string (Optional)

### Language: string (Required)

### Relation: string (Optional)

### Coverage: JSON object (Required)

### Rights: string (Optional)

### Resolution: string (Required for image and video media types)
Pixels in “####x####” format

### File size: string (Required for image, video, and audio media types)

### Duration: integer (Required for video and audio media types) 
In milliseconds
