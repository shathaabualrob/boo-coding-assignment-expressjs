const mongoose = require('mongoose')


// I made some default values just for the ease of development and testing
const commentModel = mongoose.Schema({
    title:{
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
    },
    enneagram:{
        type: String,
        required: true,
    },
    zodiac:{
        type: String,
        required: true,
    },
    profile:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    },
    likes:[{
        type: String
    }],
    createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Comment', commentModel)