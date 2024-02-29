const express = require('express');
const router = express.Router();

const passport = require('passport');

const { storeReturnTo } = require('../middleware');

const users = require('../controllers/users');
const { render } = require('ejs');
const catchAsync = require('../utils/catchAsync');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.registerUser));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), storeReturnTo, users.loginUser);



router.get('/logout',users.logoutUser);



module.exports = router; //this is so that we can use the router in other files