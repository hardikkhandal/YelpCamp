const express = require('express');
const router = express.Router();
const Expresserror = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const Campground = require("../models/campground");

//showig all the cities
router.get("/", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  });
  
  //creating a new city
  router.get("/new", (req, res) => {
    res.render("campgrounds/new");
  });
  router.post("/", catchAsync(async (req, res, next) => {
    // res.send(req.body) 
      
      const campground = new Campground(req.body.campground);
      await campground.save();
      req.flash('success','Added a new campground');
      res.redirect(`/campgrounds/${campground._id}`);
  
  }));
  
  //detailed view of city
  router.get("/:id", async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render("campgrounds/show", { campground });
  });
  
  router.get("/:id/edit", async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  });
  router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  });
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  });
  
  module.exports = router;