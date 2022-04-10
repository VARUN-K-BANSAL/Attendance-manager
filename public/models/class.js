const mongoose = require('mongoose')

const classSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    teachers: [
        {
            email: {
                type: String,
                required: true
            }
        }
    ],
    students: [
        {
            roll_number: {
                type: String,
            },
            qrcode_string: {
                type: String,
            }
        }
    ],
    attendance: [
        {
            date: {
                type: String,
            },
            values: [
                {
                    roll_no: {
                        type: String,
                    },
                    status: {
                        type: String,
                    }
                }
            ]
        }
    ]
})

const Class = new mongoose.model('Class', classSchema)

module.exports = Class