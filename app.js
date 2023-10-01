const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const URI = "mongodb://0.0.0.0:27017/";
const Campground = require("./models/campground");
const meethodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require('./utils/catchAsync');
const Review = require('./models/reviews');
const session = require('express-session');
const flash = require('connect-flash');
//const Expresserror = require('./utils/ExpressError')

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');


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
app.use('/campgrounds',campgrounds);
app.use("/campgrounds/:id/reviews",reviews);
app.use(express.static(path.join(__dirname,'public')));
// app.use(flash());


const sessionConfig = {
  secret: 'demosecret',
  resave:false,
  saveUnitialized:true,
  cookie:{
    httpOnly:true,
    expires:Date.now() + 1000*60*60*24*7,
    maxAge:1000*60*60*24*7
  }

}
app.use(session(sessionConfig));
// app.use((req,res,next)=>{
//   res.locals.success = req.flash('success');
//   next();
// })

app.get("/", (req, res) => {
  res.render("home");
});


app.all('*',(req,res)=>{
  // next(new Expresserror('Page Not Found',404))
  res.send('404')
})

app.use((err, req, res, next) => {
// const {statusCode=500,message ='Something went wrong'} = err;

//   res.status(statusCode).send(message);
  res.send('MiddleWare');
})

app.listen(3000, () => {
  console.log("Serving on prot 3000");
});



