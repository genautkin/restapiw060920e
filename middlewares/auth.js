const jwt = require('jsonwebtoken');
require('dotenv').config()
 
module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  console.log(token);
  
  if (!token) return res.status(401).send('Access denied. No token provided.');
 
  try {
    const decoded = jwt.verify(token, config.get('jwtKey'));
    req.user = decoded;
    next();
  }
  catch (ex) {
    res.status(400).send('Invalid token.');
  }
}

