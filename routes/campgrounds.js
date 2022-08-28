const express = require('express')
const router = express.Router()

const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground');
const {isLoggedIn} = require('../middleware')

router.get('/', catchAsync(async (req, res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', {campgrounds});
}))

router.post('/', catchAsync( async (req, res, next)=>{
    const campground = new Campground(req.body);
    await campground.save();
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.put('/:id', isLoggedIn, catchAsync(async (req, res)=>{
    const {id} = req.params;
    await Campground.findByIdAndUpdate(id, {...req.body});
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${id}`);
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
}))

router.get('/new', isLoggedIn, (req, res) =>{
    res.render('campgrounds/new.ejs')
})

router.get('/:id', catchAsync(async (req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    console.log(campground);
    res.render('campgrounds/show.ejs', {campground});
}))

router.get('/:id/edit', isLoggedIn, catchAsync (async (req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit.ejs', {campground});
}))


module.exports = router;