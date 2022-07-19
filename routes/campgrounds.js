const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')



router.get('/', catchAsync(campgrounds.index))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

router.get('/:id', catchAsync(campgrounds.showCampgrounds))

router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync (campgrounds.editCampgrounds))

//update campground method

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync (campgrounds.updateCampgrounds))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampgrounds))

module.exports = router