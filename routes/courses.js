const express = require('express');
const router = express.Router();
const {Course,validateCourse} = require('../models/course');

router.get('/', async (req, res) => {
    const courses = await Course.find();
    res.send(courses);
});

router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send('The course with the given id was not found');
    res.send(course);
});

router.post('/', async(req, res) => {
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let course =new Course({ name: req.body.name });
    course = await course.save();
    res.send(course);
})

router.put('/:id', async(req, res) => {
    const {error} = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const course = await Course.findByIdAndUpdate(req.params.id,{name:req.body.name},{new:true});
    if (!course) return res.status(404).send('course with the given id not found');
    res.send(course);
});

router.delete('/:id', async (req, res) => {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).send('course with the given id not found');
    return res.status(204).send();
    
});

module.exports = router;