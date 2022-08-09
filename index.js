const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground');

// Connectb with mongoDB 
mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(()=>{
    console.log("database open");
})
.catch(err=>{
    console.log(err);
})

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'));


// ROUTES
app.get('/', async (req, res)=>{
    res.render('home.ejs');
})

app.get('/campgrounds', async (req, res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', {campgrounds});
})

app.post('/campgrounds', async (req, res)=>{
    const campground = new Campground(req.body);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})

app.put('/campgrounds/:id', async (req, res)=>{
    const {id} = req.params;
    await Campground.findByIdAndUpdate(id, {...req.body});
    res.redirect(`/campgrounds/${id}`);
})

app.delete('/campgrounds/:id', async (req, res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.get('/campgrounds/new', (req, res) =>{
    res.render('campgrounds/new.ejs')
})

app.get('/campgrounds/:id', async (req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show.ejs', {campground});
})

app.get('/campgrounds/:id/edit', async (req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit.ejs', {campground});
})


app.listen(3000, ()=>{
    console.log("Server listening on Port 3000");
})