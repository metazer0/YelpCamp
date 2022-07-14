const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const {campgroundSchema} = require('../schemas.js')
const {isLoggedIn} = require('../middleware')


const validateCampground = (req,res,next) =>{
    const {error} = campgroundSchema.validate(req.body)

    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
} 

router.get('/', async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
})

router.get('/new', isLoggedIn, (req,res) =>{
    res.render('campgrounds/new')
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req,res,next) => {
        const newCampground = new Campground (req.body.campground)
        await newCampground.save()
        req.flash('success', 'New campground succesfully created')
        res.redirect(`/campgrounds/${newCampground._id}`)
}))


router.get('/:id', catchAsync(async (req,res) => {
    const id = req.params.id
    const campground = await Campground.findById(id).populate('reviews')
    if(!campground){
        req.flash('error', 'This campground is not available')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground})
}))

router.get('/:id/edit', isLoggedIn, catchAsync (async (req,res) => {
    const id = req.params.id
    const campground = await Campground.findById(id)
        if(!campground){
        req.flash('error', 'This campground is not available')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground})
}))

//update campground method

router.put('/:id', validateCampground, catchAsync (async (req,res) =>{
    const {id} =  req.params
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash('success', 'Campground succesfully updated')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', catchAsync(async (req,res) =>{
    const {id} =  req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Campground succesfully deleted')
    res.redirect('/campgrounds')
}))

module.exports = router