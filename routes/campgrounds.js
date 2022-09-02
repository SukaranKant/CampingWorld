const express = require('express')
const router = express.Router()

const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground');
const {isLoggedIn, isAuthor} = require('../middleware')

const multer = require('multer')
const {storage} = require('../cloudinary/index')
const upload = multer({storage})


router.get('/', catchAsync(async (req, res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', {campgrounds});
}))

router.post('/', isLoggedIn, upload.array('image') ,catchAsync( async (req, res, next)=>{
    const campground = new Campground(req.body);
    campground.author = req.user._id;
    campground.images = req.files.map(f => ({url : f.path, filename : f.filename}));
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.put('/:id', isLoggedIn, upload.array('image'), isAuthor, catchAsync(async (req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body});
    const imgs = req.files.map(f => ({url : f.path, filename : f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${id}`);
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res)=>{
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
    const campground = await Campground.findById(id).populate({
        path : 'reviews',
        populate : {
            path : 'author'
        }
    }).populate('author');
    console.log(campground);
    res.render('campgrounds/show.ejs', {campground});
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync (async (req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit.ejs', {campground});
}))


module.exports = router;