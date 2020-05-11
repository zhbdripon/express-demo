const express = require('express');
const Joi = require('joi');
const app = express();

app.use(express.json()); // middleware

app.get('/',(req,res)=>{
    res.send('Hello world');
});

app.get('/api/courses', (req, res) => {
    res.send([1,2,3]);
});

const courses = [
    { id: 1, name: 'course 1' },
    { id: 2, name: 'course 2' },
    { id: 3, name: 'course 3' },
    { id: 4, name: 'course 4' },
]

// example of query params
app.get('/api/post', (req, res) => {
    res.send(req.query);
});

//example of request params
app.get('/api/post/:year/:month', (req, res) => {
    res.send(req.params);
});

app.get('/api/courses/:id', (req, res) => {
    const id = +req.params['id'];
    const course = courses.find((course)=> course.id == id)
    if(!course){
        res.status(404).send('The course with the given id was not found')
    }
    res.send(course);
});

app.post('/api/courses',(req,res)=>{
    if(!req.body.name){
        res.status(400).send('Bad request, name required');
        return;
    }
    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
})

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Listening to port ${port}...`)
});