const express = require('express')
const router = express.Router()
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const users = require('../controllers/users')

router.get('/register', users.renderRegisterForm)

router.post('/register', catchAsync(users.registerUser))

router.get('/login', users.renderLoginForm)

router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect:'/login', keepSessionInfo: true}), users.login)

router.get('/logout', users.logout)

module.exports = router