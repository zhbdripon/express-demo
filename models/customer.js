const Joi = require('joi');
const mongoose = require('mongoose');
const Customer = mongoose.model('Customer', mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 40
        },
        phone: {
            type: String,
            required: true
        },
        isGold: {
            type: Boolean,
            default: false
        }
    })
);

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(3).max(40).required(),
        phone: Joi.string().required(),
        isGold: Joi.boolean()
    };
    return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;