const express = require('express');
const router = express.Router();
const { validate, User } = require('../models/user');

router.post('/', userRequest);
async function userRequest(req, res) {
    const user = req.body;
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

     const userToSave=new User(req.body)
     
     userToSave.save().then(()=>{
     res.status(200).send('Ok');
     }).catch((err)=>{
     res.status(400).send(err)
     })
}
 
module.exports = router;