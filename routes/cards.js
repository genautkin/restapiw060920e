const express = require('express');
const _ = require('lodash');
const { Card, validateCard, generateBizNumber } = require('../models/card');
const auth = require('../middlewares/auth');
const router = express.Router();

router.get('/query', auth, async (req, res) => {
  console.log(req.query)
  if (req.query.arr){
    return res.send(req.query.arr.split(","));
  }
  res.send(req.query);
   
  });




  router.delete('/:id', auth, async (req, res) => {
    let filter = { _id: req.params.id, user_id: req.user._id }
    try {
      const card = await Card.findOneAndRemove(filter);
      res.send(card);

    } catch (error) {
      return res.status(404).send('The card with the given ID was not found.');
    }
  });

router.get('/:id', auth, async (req, res) => {
  try {
    const card = await Card.findOne({ _id: req.params.id, user_id: req.user._id });
    card ? res.send(card) : res.status(404).send('The card with the given ID was not found.');
  }
  catch {
    return res.status(404).send('The card with the given ID was not found.');
  }
   
  });

  router.get('/:id/details', auth, async (req, res) => {
    console.log(req.params.id)
    res.send("Good");
     
    });

   

  router.put('/:id', auth, async (req, res) => {
    const { error } = validateCard(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let filter = { _id: req.params.id, user_id: req.user._id }
    try {
      let doc = await Card.findOneAndUpdate(filter, req.body, {
        new: true
      });
      res.send(doc);
    }
    catch (err) {
      res.status(404).send(err.message);
    }
  })
 
router.post('/', auth, async (req, res) => {
    const { error } = validateCard(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let card = new Card({
        bizName: req.body.bizName,
        bizDescription: req.body.bizDescription,
        bizAddress: req.body.bizAddress,
        bizPhone: req.body.bizPhone,
        bizImage: req.body.bizImage ? req.body.bizImage : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        bizNumber: await generateBizNumber(Card),
        user_id: req.user._id
      }
      );
      post = await card.save();
      res.send(post);
      
   
  });

module.exports = router;


