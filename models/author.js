const mongoose = require('mongoose');
const Joi = require('joi');

const Author = mongoose.model('Author', mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 40
        }
    }
))

const validateAuthor = function(author){
    const schema = {
        name: Joi.string().min(3).max(40).required()
    }
    return Joi.validate(author,schema);
}

exports.Author = Author;
exports.validateAuthor = validateAuthor;