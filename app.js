const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const URI = "mongodb://0.0.0.0:27017/";
const Campground = require("./models/campground");
const meethodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require('./utils/catchAsync');
//const Expresserror = require('./utils/ExpressError')

mongoose.connect(URI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
  console.log("Database Cnected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(meethodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

//showig all the cities
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

//creating a new city
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});
app.post("/campgrounds", catchAsync(async (req, res, next) => {
  // res.send(req.body)
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);

}));

//detailed view of city
app.get("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});
app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground._id}`);
});
app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});
app.all('*',(req,res)=>{
  // next(new Expresserror('Page Not Found',404))
  res.send('404')
})

app.use((err, req, res, next) => {
// const {statusCode=500,message ='Something went wrong'} = err;

//   res.status(statusCode).send(message);
  res.send('GHJOKBJNM');
})

app.listen(3000, () => {
  console.log("Serving on prot 3000");
});