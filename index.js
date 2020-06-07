const express = require('express');
const logger = require('./middleware/logger');
const error = require('./middleware/error');
require('express-async-errors');

const courses = require('./routes/courses');
const homepage = require('./routes/home');
const customers = require('./routes/customers');
const authors = require('./routes/authors');
const orders = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');

const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const debug = require('debug')('app:startup');

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const mongoose = require('mongoose');
const app = express();

//environemnt var
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`app: ${app.get('env')}`)

//Configuraion
console.log('Application name: '+config.get('name'));
console.log('Mail Server: '+config.get('mail.host'));

//check for required environment variables
if(!config.get('jwtPrivateKey')){
    console.log('FATAL ERROR: jwtPrivateKey not define.');
    process.exit(1);
}

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

// templete engine and default templete folder
app.set('view engine','pug');
app.set('views','./views')

//connect to database
mongoose.connect(
        'mongodb://localhost/' + config.get('database_name'),
        { useNewUrlParser: true, useUnifiedTopology: true }
    ).then(() => {
        console.log('Connected to database...');
    })
    .catch((err) => {
        console.log('Unable to connect to database : ', err.message);
    })

//routes
app.use('/api/courses',courses);
app.use('/api/customers', customers);
app.use('/api/authors', authors);
app.use('/api/rentals', orders);
app.use('/api/users', users);
app.use('/api/auth', auth)
app.use('/',homepage);

// error middleware, declared after all the other middleware
app.use(error)

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Listening to port ${port}...`)
});