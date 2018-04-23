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
Date object using Coordinated Universal Time (UTC)

Examples:

format is "yyyy-m-dThh:mm:ssZ"
date="2012-1-31T11:00:00Z"

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
