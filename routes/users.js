const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');

router.get('/register',(req,res)=>{
    res.render('users/register');
})

router.post('/register',catchAsync(async(req,res)=>{
    // res.send(req.body);
    try{
    const {email,username,password} = req.body;
    const user = new User({email,username});
    const registeredUser = await User.register(user,password);
    req.login(registeredUser, err =>{
        if(err) return next(err);
        console.log(registeredUser);
    //req.flash ('success','Welcome to Yelpcamp!');
    res.redirect('/campgrounds');
    });
    
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
router.post('/login',storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    //res.flash('success','welcome back');
    // res.send('Ok');
    try{
        const redirectUrl = res.locals.returnTo || '/campgrounds';
    console.log("Hey Welcome back");
    res.redirect(redirectUrl) ;
    delete req.session.returnTo;
        }catch(e){
            console.log('Yout are not welcome');
            res.redirect('/login');
        }
})

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        //req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}); 
module.exports = router;