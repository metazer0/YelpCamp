const express = require('express')
const router = express.Router({mergeParams:true})
const catchAsync = require('../utils/catchAsync')
const Review = require('../models/review')
const Campground = require('../models/campground')
const {reviewSchema} = require('../schemas.js')
const ExpressError = require('../utils/ExpressError')


const validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body)

    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}


router.post('/', validateReview, catchAsync(async (req,res) =>{
    const campground = await Campground.findById(req.params.id)
    const newReview = new Review(req.body.review)
    campground.reviews.push(newReview)
    await newReview.save()
    await campground.save()
    req.flash('success', 'New review succesfully created')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', catchAsync(async(req,res) => {
    const {id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Review succesfully deleted')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router