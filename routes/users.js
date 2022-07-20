const express = require('express')
const router = express.Router()
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const users = require('../controllers/users')

router.route('/register')
    .get( users.renderRegisterForm)
    .post(catchAsync(users.registerUser))


router.route('/login')
    .get(users.renderLoginForm)
    .get(users.logout)


router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect:'/login', keepSessionInfo: true}), users.login)


module.exports = router