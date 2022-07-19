const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')
const campground = require('../models/campground')



router.get('/', async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
})

router.get('/new', isLoggedIn, (req,res) =>{
    res.render('campgrounds/new')
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req,res,next) => {
        const newCampground = new Campground (req.body.campground)
        newCampground.author = req.user._id
        await newCampground.save()
        req.flash('success', 'New campground succesfully created')
        res.redirect(`/campgrounds/${newCampground._id}`)
}))


router.get('/:id', catchAsync(async (req,res) => {
    const id = req.params.id
    const campground = await Campground.findById(id).populate({path:'reviews' , populate:{path:'author'}}).populate('author')
    console.log(campground)
    if(!campground){
        req.flash('error', 'This campground is not available')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground})
}))

router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync (async (req,res) => {
    const {id} =  req.params
    const campground = await Campground.findById(id)

    if(!campground){
        req.flash('error', 'This campground is not available')
        return res.redirect('/campgrounds')
    }

    res.render('campgrounds/edit', {campground})
}))

//update campground method

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync (async (req,res) =>{
    const {id} =  req.params
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash('success', 'Campground succesfully updated')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req,res) =>{
    const {id} =  req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Campground succesfully deleted')
    res.redirect('/campgrounds')
}))

module.exports = router