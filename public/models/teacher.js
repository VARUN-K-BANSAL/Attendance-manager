const mongoose = require('mongoose')

const teacherSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const Teacher = new mongoose.model('Teacher', teacherSchema)

module.exports = Teacher