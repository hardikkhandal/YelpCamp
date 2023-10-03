// if(process.env.NODE_ENV!=="production"){
//   require('dotenv').config();
// }


const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const dbUrl = process.env.DB_URL

const session = require('express-session');
const MongoStore = require('connect-mongo');

const URI = "mongodb://0.0.0.0:27017/";
const Campground = require("./models/campground");
const meethodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require('./utils/catchAsync');
const Review = require('./models/reviews');

const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')


//const Expresserror = require('./utils/ExpressError')
const userRoutes = require('./routes/users');
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

app.use(express.static(path.join(__dirname,'public')));
// app.use(flash());

const secret = 'demodemo'

// const store = MongoStore.create({
//   mongoUrl: dbUrl,
//   touchAfter: 24 * 60 * 60,
//   crypto: {
//       secret: 'thisshouldbeabettersecret!'
//   }
// });

// store.on("error",function (e){
//   console.log("Session Store Error",e);
// })
const sessionConfig = {
  
  secret:secret,
  resave:false,
  saveUnitialized:true,
  cookie:{
    httpOnly:true,
    expires:Date.now() + 1000*60*60*24*7,
    maxAge:1000*60*60*24*7
  }

}
app.use(session(sessionConfig));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  
  res.locals.currentUser = req.user;
  //res.locals.success = req.flash('success');
  next();
})



app.use('/campgrounds',campgrounds);
app.use("/campgrounds/:id/reviews",reviews);
app.use("/",userRoutes);

app.get("/", (req, res) => {
  res.redirect('/campgrounds');
});


app.all('*',(req,res)=>{

  // next(new Expresserror('Page Not Found',404))
  res.send('404')
})

// app.use((err, req, res, next) => {
// // const {statusCode=500,message ='Something went wrong'} = err;

// //   res.status(statusCode).send(message);
//   res.send('MiddleWare');
// })

app.listen(3000, () => {
  console.log("Serving on prot 3000");
});



