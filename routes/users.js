const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

router.get('/register',(req,res)=>{
    res.render('users/register');
})

router.post('/register',catchAsync(async(req,res)=>{
    // res.send(req.body);
    try{
    const {email,username,password} = req.body;
    const user = new User({email,username});
    const registeredUser = await User.register(user,password);
    console.log(registeredUser);
    //req.flash ('success','Welcome to Yelpcamp!');
    res.redirect('/campgrounds');
    } catch(e){
        console.log(e.message);
        res.redirect('register');
    }
        // console.log(e);
        // //req.flash('error',e.message);
        // res.redirect('register');
    
}))

router.get('/login',(req,res)=>{
    res.render('users/login');

})
router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    //res.flash('success','welcome back');
    // res.send('Ok');
    res.redirect('/campgrounds') ;
})
module.exports = router;