const express = require('express');
const router = express.Router();
const { validate, User , validateCards} = require('../models/user');
const { Card } = require('../models/card');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const auth = require('../middlewares/auth');

const getCards = async (cardsArray) => {
    const cards = await Card.find({ "bizNumber": { $in: cardsArray } });
    return cards;
  };

  router.get('/cards', auth, async (req, res) => {
 
    if (!req.query.numbers) {
       return  res.status(400).send('Missing numbers data');}
   
    let data = {};
    data.cards = req.query.numbers.split(",");
   
    const cards = await getCards(data.cards);
    res.send(cards);
   
  });

  router.get('/myCards', auth, async (req, res) => {
    let user
    try {
          user = await User.findById(req.user._id);
    } catch (error) {
        return res.status(400).send(error);
    }
    if (!user.cards) {
        return res.status(200).send("You don't have any cards");
    }
    const cards = await getCards(user.cards);
    res.send(cards);
   
  });
   
  router.patch('/cards', auth, async (req, res) => {
   
    const { error } = validateCards(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }
   
    const cards = await getCards(req.body.cards);
    if (cards.length != req.body.cards.length) {
        return res.status(400).send("Card numbers don't match");
    }
    try {
        let user = await User.findById(req.user._id);
        user.cards = req.body.cards;
        user = await user.save();
        res.send(user);
    } catch (error) {
        return res.status(400).send(error);
    }

   
  });

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