const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose');
const router = express.Router();


const Customer = mongoose.model('Customer', mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 40
        },
        phone:{
            type:String,
            required: true
        },
        isGold:{
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


router.get('/', async (req, res) => {
    const customers = await Customer.find();
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('customer with the given id was not found');
    res.send(customer);
});

router.post('/', async(req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let customer =new Customer({ 
        name: req.body.name, 
        phone:req.body.phone,
        isGold:req.body.isGold
    });
    
    customer = await customer.save();
    res.send(customer);
})

router.put('/:id', async(req, res) => {
    const {error} = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const customer = await Customer.findByIdAndUpdate(
        req.params.id,
        {
            name:req.body.name,
            phone:req.body.phone,
            isGold:req.body.isGold
        },
        {new:true}
    );
    if (!customer) return res.status(404).send('customer with the given id not found');
    res.send(customer);
});

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).send('customer with the given id not found');
    return res.status(204).send();
});

module.exports = router;