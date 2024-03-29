const Campground = require('../models/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken: mapBoxToken})
const {cloudinary} = require('../cloudinary')



module.exports.index = async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}

module.exports.renderNewForm = (req,res) =>{
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req,res,next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const newCampground = new Campground (req.body.campground)
    newCampground.geometry = geoData.body.features[0].geometry
    newCampground.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    newCampground.author = req.user._id
    await newCampground.save()
    console.log(newCampground)
    req.flash('success', 'New campground succesfully created')
    res.redirect(`/campgrounds/${newCampground._id}`)
}

module.exports.showCampgrounds = async (req,res) => {
    const id = req.params.id
    const campground = await Campground.findById(id).populate({path:'reviews' , populate:{path:'author'}}).populate('author')
    if(!campground){
        req.flash('error', 'This campground is not available')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground})
}

module.exports.editCampgrounds = async (req,res) => {
    const {id} =  req.params
    const campground = await Campground.findById(id)

    if(!campground){
        req.flash('error', 'This campground is not available')
        return res.redirect('/campgrounds')
    }

    res.render('campgrounds/edit', {campground})
}

module.exports.updateCampgrounds = async (req,res) =>{
    const {id} =  req.params
    console.log(req.body)
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    const imgArr = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.images.push(...imgArr)
    await campground.save()
    if(req.body.deleteImages){
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
       await campground.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
       console.log(campground)
    }
    req.flash('success', 'Campground succesfully updated')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampgrounds = async (req,res) =>{
    const {id} =  req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Campground succesfully deleted')
    res.redirect('/campgrounds')
}