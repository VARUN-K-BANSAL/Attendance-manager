const mongoose = require('mongoose')

const studSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    roll_number: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const Student = new mongoose.model('Student', studSchema)

module.exports = Student