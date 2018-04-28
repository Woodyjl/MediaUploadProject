var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    metadata: {
        type: Object
    },
    s3Credentials: {
        type: Object
    },
    expiration: {
        type: String
    },

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
    source : "",
    language : "English",
    relation : undefined,
    coverage : {
        latitude : 1233445,
        longitude : 987544
    },
    rights : String,
    resolution : String,
    fileSize : String,
    duration : Number,


    title : Joi.string().required().max(characterMax),
    creator : Joi.string().required().max(characterMax),
    subject : Joi.string().optional().max(characterMax),
    description : Joi.string().when('format', { is: Joi.valid('text'), then: Joi.string().required().max(characterMax * 5), otherwise: Joi.string().max(500) }),
    publisher : Joi.string().optional().max(characterMax),
    contributor : Joi.string().optional().max(characterMax),
    date : Joi.string().required().regex(/^[0-9]{4}-[0-9]{1,2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$/),
    type : Joi.alternatives().when('format', { is: 'text', then: Joi.valid(MEDIA_TYPES.text), otherwise: Joi.alternatives().when('format', { is: 'video', then: Joi.valid(MEDIA_TYPES.video), otherwise: Joi.alternatives().when('format', { is: 'image', then: Joi.valid(MEDIA_TYPES.image), otherwise: Joi.alternatives().when('format', { is: 'audio', then: Joi.valid(MEDIA_TYPES.audio)})})})}),
    format : Joi.string().required().valid(['text','image','video','audio']),
    identifier : Joi.string().max(characterMax),
    source : Joi.string().optional().max(characterMax),
    language : Joi.string().required().max(characterMax),
    relation : Joi.string().optional().max(characterMax),
    coverage : Joi.object()
        .keys({
            latitude: Joi.number().required(),
            longitude: Joi.number().required()
        })
        .required(),
    rights : Joi.string().optional().max(characterMax),
    resolution : Joi.string().when('format', { is: Joi.valid('image', 'video'), then: Joi.string().required().regex(/^[1-9]+x[1-9]+$/), otherwise: Joi.any().strip() }),
    fileSize : Joi.string().when('format', { is: Joi.valid('image', 'video', 'audio'), then: Joi.string().required().regex(/^[1-9][a-zA-Z][a-zA-Z]$/), otherwise: Joi.any().strip() }),
    duration : Joi.number().integer().positive().when('type', { is: Joi.valid('video', 'audio'), then: Joi.required(), otherwise: Joi.any().strip() })
});

mongoose.model("UploadTasks", schema);