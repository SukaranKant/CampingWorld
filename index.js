const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError')

const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')

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


app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

// ROUTES
app.get('/', (req, res)=>{
    res.render('home.ejs');
})


app.all('*', (req, res, next)=>{
    next(new ExpressError('Page Not Found', 404));
})


app.use((err, req, res, next)=>{
    if(!err.message) {
        err.message = 'Something Went Wrong!';
    }
    if(!err.statusCode) {
        err.statusCode = 500;
    }
    res.status(err.statusCode).render('error.ejs', {err});
})


app.listen(3000, ()=>{
    console.log("Server listening on Port 3000");
})