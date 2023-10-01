const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const URI = "mongodb://0.0.0.0:27017/";
const Campground = require("../models/campground");
const meethodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviews');
const router = express.Router({mergeParams:true});


router.post('/',async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
router.delete('/:reviewId',catchAsync(async (req,res)=>{
  
    const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(req.params.reviewId);
    res.redirect(`/campgrounds/${id}`);
  }))
  
  module.exports = router;