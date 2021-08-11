const Joi = require('joi');
const mongoose = require('mongoose');
const {isValidPhoneNumber} = require('libphonenumber-js')


 
const cardSchema = new mongoose.Schema({
  bizName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255
  },
  bizDescription: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024
  },
  bizAddress: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 400
  },
  bizPhone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 10
  },
  bizImage: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 1024
  },
  bizNumber: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 99999999999,
    unique: true
  },
  user_id: { type: mongoose.Schema.Types.ObjectId,
    ref: 'User' }
});

const Card = mongoose.model('Card', cardSchema);

function validateCard(card) {
 
    const schema = Joi.object({
      bizName: Joi.string().min(2).max(255).required(),
      bizDescription: Joi.string().min(2).max(1024).required(),
      bizAddress: Joi.string().min(2).max(400).required(),
      bizPhone: Joi.string().min(9).max(10).required().custom((number,helper)=>{
        var result =  isValidPhoneNumber(number,'IL')
        if (result) {
          return true
        }
        else {
          return helper.message('Invalid number');
        }
      }),
      bizImage: Joi.string().min(11).max(1024)
    });
   
    return schema.validate(card);
  }

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }
   
  async function generateBizNumber(Card) {
    while (true) {
      let randomNumber = String(getRndInteger(1000, 9999999));
      let card = await Card.findOne({ bizNumber: randomNumber });
      if (!card) return randomNumber;
    }
   
  }

exports.generateBizNumber = generateBizNumber;
exports.Card = Card;
exports.validateCard = validateCard;