module.exports.isLoggedIn = (req,res,next)=>{
    console.log("User is",req.user);
    if(!req.isAuthenticated()){
        // req.flash("You must be signed in");
        req.session.returnTo = req.originalUrl;
        console.log("You must be signed in");
        return res.redirect("/login");

      }

      next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}