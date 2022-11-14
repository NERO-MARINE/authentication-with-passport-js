const { Router } = require('express'); // OR const express = require('express');
const authcontroller = require('../controller/authcontroller');
const express = require('express');
const authrouter = express.Router();


authrouter.get('/', authcontroller.homePage);
authrouter.get('/login', authcontroller.getLogin);
authrouter.get('/signup', authcontroller.getSignup);
authrouter.post('/signup', authcontroller.postSignup)
authrouter.post('/login', authcontroller.postLogin);
authrouter.get('/profile', authcontroller.checkAuth, authcontroller.getProfile);
authrouter.get('/logout', authcontroller.logout);

module.exports = authrouter;