const users = require('./routes/users');
const express = require('express');
const app = express();
const http = require('http').Server(app);

const mongoose = require('mongoose');
 
mongoose.connect('mongodb://localhost/my_rest_api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));
 
app.use(express.json());
 
app.use('/api/users', users);


 
const port = 3000;
http.listen(port, () => console.log(`Listening on port ${port}...`));