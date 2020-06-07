const mongoose = require('mongoose');
const Joi = require('joi');

const User = mongoose.model('User',mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 40
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    }
}))

function validateUser(user) {
    const schema = {
        name: Joi.string().alphanum().required().min(3).max(40),
        email: Joi.string().email({ minDomainAtoms: 2 }).required().min(5).max(255),
        password: Joi.string().regex(/^[a-zA-Z0-9]/).min(5).max(30) 
    }
    return Joi.validate(user,schema);
}

exports.User = User;
exports.validateUser = validateUser;