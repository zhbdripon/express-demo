const express = require('express');
const router = express.Router();
const { User, validateUser} = require('../models/user');
const _ = require('lodash');

router.get('/', async (req,res)=>{
    const users = await User.find();
    return res.send(users);
})

router.post('/', async (req,res)=>{
    const {error} = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(user ) return res.status(400).send('Email already exist');

    user = new User(_.pick(req.body,['name','email','password']))
    await user.save();
    return res.send(_.pick(user,['_id','name','email']));
})

module.exports = router;