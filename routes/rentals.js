const express = require('express');
const router = express.Router();
const { Rental, validateRental } = require('../models/rental');
const { Course } = require('../models/course');
const { Customer } = require('../models/customer');

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-date_out');
    res.send(rentals);
});

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).send('rental with the given id was not found');
    res.send(rental);
});

router.post('/', async (req, res) => {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customer_id);
    if (!customer) return res.status(400).send('customer not found with given Id');

    const course = await Course.findById(req.body.course_id);
    if (!course) return res.status(400).send('course not found with given Id');
    if (course.number_in_stock < 1) res.status(400).send('Movie not in stock at the moment');

    const rental = new Rental({
        customer:{
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },
        course:{
            _id: course._id,
            title: course.title,
            daily_rental_rate: course.daily_rental_rate
        }
    });
    await rental.save();
    course.number_in_stock--;
    await course.save();
    return res.send(rental);
})

router.delete('/:id', async (req, res) => {
    const rental = await Rental.findByIdAndDelete(req.params.id);
    if (!rental) return res.status(404).send('course with the given id not found');
    return res.status(204).send();

});

module.exports = router;