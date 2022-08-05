const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
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

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))



// ROUTES
app.get('/', async (req, res)=>{
    // res.render('home.ejs');
    const c = await Campground.find({});
    res.send(c);
})

app.listen(3000, ()=>{
    console.log("Server listening on Port 3000");
})