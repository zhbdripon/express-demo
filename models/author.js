const mongoose = require('mongoose');
const Joi = require('joi');

const authorSchema = mongoose.Schema({
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 40
        }
    })

const Author = mongoose.model('Author', authorSchema);

const validateAuthor = function(author){
    const schema = {
        name: Joi.string().min(3).max(40).required()
    }
    return Joi.validate(author,schema);
}

exports.authorSchema = authorSchema;
exports.Author = Author;
exports.validateAuthor = validateAuthor;