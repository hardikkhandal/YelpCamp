module.exports.isLoggedIn = (req,res,next)=>{
    console.log("User is",req.user);
    if(!req.isAuthenticated()){
        // req.flash("You must be signed in");
        console.log("You must be signed in");
        return res.redirect("/login");

      }

      next();
}
