/*
    These environment variables are not hardcoded so as not to put
    production information in a repo. They should be set in your
    heroku (or whatever VPS used) configuration to be set in the
    applications environment, along with NODE_ENV=production
*/

module.exports = {
    "DATABASE_URI": process.env.MONGOLAB_URI,
    "SESSION_SECRET": process.env.SESSION_SECRET,
    "HOST_URI": process.env.HOST_URI,
    "AWS": {
        "bucketName": process.env.S3_BUCKET_NAME,
        "accessKeyId": process.env.AWS_ACCESS_KEY_ID,
        "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY
    },
    "ROOTURL": "https://artistsunlimited.com"
};