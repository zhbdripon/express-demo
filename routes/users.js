const express = require('express');
const router = express.Router();
const { User, validateUser} = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

router.get('/', async (req,res)=>{
    const users = await User.find();
    return res.send(users);
})

router.post('/', async (req,res)=>{
    const {error} = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(user ) return res.status(400).send('Email already exist');

    user = new User(_.pick(req.body,['name','email','password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
    await user.save();
    const token = jwt.sign({_id:user._id}, config.get('jwtPrivateKey'));
    return res.header('x-auth-token',token).send(_.pick(user,['_id','name','email']));
})

module.exports = router;