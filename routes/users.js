const express = require('express')
const passport = require('passport')
const review = require('../models/review')
const router = express.Router()
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')

router.get('/register', (req, res)=>{
    res.render('users/register')
})

router.post('/register', catchAsync( async (req, res, next) =>{
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    console.log(registeredUser);
    req.login(registeredUser, err=>{
        if(err) return next(err);
        req.flash('success', 'Welcome to Camping world')
        return res.redirect('/campgrounds');
    })
}))


router.get('/login', (req, res)=>{
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect : '/login'}), (req, res)=>{
    req.flash("success", 'Welcome back');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})


router.get('/logout', (req, res, next)=>{
    req.logout(function (err) {
        if (err) {
          return next(err);
        }
        req.flash('success', 'logged out!')
        res.redirect('/campgrounds');
      });
})


module.exports = router;