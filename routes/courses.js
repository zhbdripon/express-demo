const express = require('express');
const router = express.Router();

const courses = [
    { id: 1, name: 'course 1' },
    { id: 2, name: 'course 2' },
    { id: 3, name: 'course 3' },
    { id: 4, name: 'course 4' },
]

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

router.get('/', (req, res) => {
    res.send(courses);
});

router.get('/:id', (req, res) => {
    const id = +req.params['id'];
    const course = courses.find((course) => course.id == id)
    if (!course) return res.status(404).send('The course with the given id was not found');
    res.send(course);
});

router.post('/', (req, res) => {
    const result = validateCourse(req.body);
    const { error } = result;
    if (error) return res.status(400).send(result.error.details[0].message);
    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
})

router.put('/:id', (req, res) => {

    const course = courses.find(course => course.id === +req.params.id);
    if (!course) return res.status(404).send('course with the given id not found')

    const result = validateCourse(req.body);
    const { error } = result;

    if (error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    course.name = req.body.name;
    res.send(course);
})

router.delete('/:id', (req, res) => {
    const course = courses.find(course => course.id === +req.params.id);
    if (!course) return res.status(404).send('course with the given id not found');
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.status(204);
    return;
})

module.exports = router;