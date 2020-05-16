const express = require('express');
const Joi = require('joi');
const logger = require('./middleware/logger');
const courses = require('./routes/courses')
const homepage = require('./routes/home')
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

// templete engine and default templete folder
app.set('view engine','pug');
app.set('views','./views')

//routes
app.use('/api/courses',courses);
app.use('/',homepage);

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Listening to port ${port}...`)
});