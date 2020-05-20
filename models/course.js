const Joi = require('joi');
const mongoose = require('mongoose');
const { authorSchema } = require('./author')

const Course = mongoose.model('Course', mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim:true,
            minlength: 5,
            maxlength: 255
        },
        authors: {
            type: [authorSchema],
            required: true,
            minlength: 1,
            maxlength: 15
        },
        total_lecture:{
            type: Number,
            required: true,
            min: 0,
            max: 1000
        },
        price: {
            type: Number,
            required: true,
            min: 0,
            max: 10000

        }
    })
);

function validateCourse(course) {
    const schema = {
        title: Joi.string().trim().min(5).required(255),
        authors: Joi.array().items(Joi.string().required()).min(1).max(15),
        total_lecture: Joi.number().min(0).max(1000).required(),
        price: Joi.number().min(0).max(10000).required()
    };
    return Joi.validate(course, schema);
}

exports.Course = Course;
exports.validateCourse = validateCourse;