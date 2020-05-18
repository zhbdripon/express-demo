const Joi = require('joi');
const mongoose = require('mongoose');

const Course = mongoose.model('Course', mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 50
        }
    })
);

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

exports.Course = Course;
exports.validateCourse = validateCourse;