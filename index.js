const app = require('express')();
const mongoose = require('mongoose');
const requireDir = require('require-dir');

const dbConfig = require('./config/database');

mongoose.connect(dbConfig.url);
requireDir(dbConfig.modelsPath);

const User = mongoose.model('User');
User.create({
  name: 'Thiago',
  userName: 'tmaturano',
  email: 'thiagomatu@gmail.com',
  password: '1234',
}, () => {
  console.log('OK');
});

app.listen(3000);
