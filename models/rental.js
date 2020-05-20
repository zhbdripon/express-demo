const mongoose = require('mongoose');
const Joi = require('joi');


const Rental = mongoose.model('Rental', mongoose.Schema({
    customer:{
        type: mongoose.Schema({
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
        }),
        required: true
    },
    course:{
        type:  mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 255
            },
            daily_rental_rate: {
                type: Number,
                required: true,
                min: 0,
                max: 10000
            }
        }),
        required: true
    },
    date_out:{
        type: Date,
        required: true,
        default: Date.now
    },
    date_returned:{
        type: Date,
    },
    rental_fee:{
        type: Number,
        min: 0
    }
}))

const validateRental = (rental) =>{
    const schema = {
        customer_id: Joi.string().required(),
        course_id: Joi.string().required()
    }
    return Joi.validate(rental,schema);
}

exports.validateRental = validateRental;
exports.Rental = Rental;