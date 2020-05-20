const express = require('express');
const router = express.Router();
const {Course,validateCourse} = require('../models/course');
const { Author } = require('../models/author');

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

    const authors = [];
    for(id of req.body.authors){
        const author = await Author.findById(id);
        if(!author){
            return res.status(404).send(`author not found with id ${id}`);
        }
        authors.push({ _id: author._id, name: author.name})
    }

    let course =new Course({ 
        title: req.body.title,
        authors: authors,   
        total_lecture: req.body.total_lecture,
        price: req.body.price

    });
    course = await course.save();
    res.send(course);
})

router.put('/:id', async(req, res) => {
    const {error} = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const authors = [];
    for (id of req.body.authors) {
        const author = await Author.findById(id);
        if (!author) {
            return res.status(404).send(`author not found with id ${id}`);
        }
        authors.push({ _id: author._id, name: author.name })
    }

    const course = await Course.findByIdAndUpdate(req.params.id,
        {
            title: req.body.title,
            authors: authors,
            total_lecture: req.body.total_lecture,
            price: req.body.price
        },
        {new:true});
    if (!course) return res.status(404).send('course with the given id not found');
    res.send(course);
});

router.delete('/:id', async (req, res) => {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).send('course with the given id not found');
    return res.status(204).send();
    
});


module.exports = router;