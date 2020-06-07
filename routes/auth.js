const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { User} = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

router.post('/', async (req,res)=>{
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(!user ) return res.status(400).send('Invalid email or password');

    const valid = await bcrypt.compare(req.body.password,user.password);

    if(!valid) return res.status(400).send('Invalid email or password');

    const token = jwt.sign({_id:user._id}, config.get('jwtPrivateKey'));

    return res.send(token);
})

function validate(req) {
    const schema = {
        email: Joi.string().email({ minDomainAtoms: 2 }).required().min(5).max(255),
        password: Joi.string().regex(/^[a-zA-Z0-9]/).min(5).max(30) 
    }
    return Joi.validate(req,schema);
}

module.exports = router;