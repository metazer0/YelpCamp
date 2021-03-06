const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))



router.get('/new', isLoggedIn, campgrounds.renderNewForm)


router.route('/:id')
    .get(catchAsync(campgrounds.showCampgrounds))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync (campgrounds.updateCampgrounds))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampgrounds))



router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync (campgrounds.editCampgrounds))

module.exports = router