const mongoose = require('mongoose')


// I made some default values just for the ease of development and testing
const profileModel = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    mbti:{
        type: String,
        required: true,
        default: 'ISFJ'
    },
    enneagram:{
        type: String,
        required: true,
        default: '9w3'
    },
    variant:{
        type: String,
        required: true,
        default: 'sp/so'
    },
    tritype:{
        type: Number,
        required: true,
        default: 725
    },
    socionics:{
        type: String,
        required: true,
        default: 'SEE'
    },
    sloan:{
        type: String,
        required: true,
        default: 'RCOEN'
    },
    psyche:{
        type: String,
        required: true,
        default: 'FEVL'
    },
    image:{
        type: String,
        required: true,
        default: 'https://soulverse.boo.world/images/1.png'
    },
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
})

module.exports = mongoose.model('Profile', profileModel)