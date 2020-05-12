const express = require('express');
const Joi = require('joi');
const logger = require('./logger');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config')
const debug = require('debug')('app:startup');
const app = express();

//environemnt var
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`app: ${app.get('env')}`)

//Configuraion
console.log('Application name: '+config.get('name'));
console.log('Mail Server: '+config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));

// express built in middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// third party middleware
app.use(helmet());
if(app.get('env')==='development'){
    app.use(morgan('tiny'));
    debug('morgan enable...');
}

// custom middleware
app.use(logger);


const courses = [
    { id: 1, name: 'course 1' },
    { id: 2, name: 'course 2' },
    { id: 3, name: 'course 3' },
    { id: 4, name: 'course 4' },
]

function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

app.get('/',(req,res)=>{
    res.send('Hello world');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

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
    if(!course)return res.status(404).send('The course with the given id was not found');
    res.send(course);
});

app.post('/api/courses',(req,res)=>{
    const result = validateCourse(req.body);
    const { error } = result;
    if(error) return res.status(400).send(result.error.details[0].message);
    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
})

app.put('/api/courses/:id', (req, res) => {

    const course = courses.find(course=> course.id === +req.params.id);
    if(!course)return res.status(404).send('course with the given id not found')

    const result = validateCourse(req.body);
    const { error } = result;

    if (error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    course.name = req.body.name;
    res.send(course);
})

app.delete('/api/courses/:id',(req,res)=>{
    const course = courses.find(course => course.id === +req.params.id);
    if (!course) return res.status(404).send('course with the given id not found');
    const index = courses.indexOf(course);
    courses.splice(index,1);
    res.status(204);
    return;
})

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Listening to port ${port}...`)
});