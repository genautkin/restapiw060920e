const express = require('express');
const router = express.Router();
const { validate, User } = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('lodash');

router.post('/', userRequest);
async function userRequest(req, res) {
    const user = _.pick(req.body, ['name', 'email', 'password', 'biz', 'cards'])
    const {error} = validate(user);
    if (error){
        res.status(400).send(error.details[0].message)
        return;
    }
     const userIfExists = await User.findOne({ email: req.body.email});
     if (userIfExists){
        res.status(400).send('User already registered.');
        return;
     } 
     const salt = await bcrypt.genSalt(10);
     user.password = await bcrypt.hash(user.password, salt);
     const userToSave = new User(user);
     userToSave.save().then(()=>{
     res.status(200).send(_.pick(userToSave, ['_id', 'name', 'email']));
     }).catch((err)=>{
     res.status(400).send(err)
     })
}
 
module.exports = router;