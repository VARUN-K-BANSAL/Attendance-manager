const mongoose = require('mongoose')
const Teacher = require('./teacher')
const Student = require('./student')

const classSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    teachers: [
        {
            id: {
                type: String,
                required: true
            }
        }
    ],
    students: [
        {
            id: {
                type: String,
                required: true
            }
        }
    ]
})

const Class = new mongoose.model('Class', classSchema)

module.exports = Class