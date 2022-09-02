if(process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const ExpressError = require('./utils/ExpressError')
const User = require('./models/user')

const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')

// Connectb with mongoDB 
mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(()=>{
    console.log("database open");
})
.catch(err=>{
    console.log(err);
})

const app = express()

const sessionConfig = {
    secret : 'thisissomesecret',
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 1000*60*60*24*7,
        maxAge : 1000*60*60*24*7
    }
}

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionConfig));
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next)=>{
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);


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