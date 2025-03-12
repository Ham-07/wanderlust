const express=require("express");
const app=  express();
const mongoose=require("mongoose");
const path=require("path");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const listing=require("./routes/listings.js");
const review=require("./routes/review.js");
const session=require("express-session");
const User=require("./models/users.js");
const passport = require("passport");
const flash = require('connect-flash');
const {redirectPath}=require("./middleware.js");

const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
};
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.setHideFooter=false;
    res.locals.currUser=req.user;
    next();
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





const Mongo_Url="mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{
    console.log("connect to db");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(Mongo_Url);

}


// Listings router
app.use("/listings",listing);
// Review router
app.use("/listings/:id/reviews",review);
// User Route
app.get("/signup",(req,res)=>{
    res.locals.setHideFooter=true;
    res.render("./users/signup");
    
})

app.post("/signup",wrapAsync(
    async(req,res)=>{
        try{
    let {username,email,password}=req.body;
   const newUser=new User({username,email});
   const registerdUser=await User.register(newUser,password);
   req.logIn(registerdUser,(err)=>{
    if(err){
        return next(err);
    }
    req.flash("success","Welcome to wanderlust");
     return res.redirect("/listings");
   })
} catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
}
   


}));

app.get("/login",(req,res)=>{
    res.locals.setHideFooter=true;
      res.render("./users/login");
     
})

app.post("/login",redirectPath,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true
}),
async(req,res)=>{
    req.flash("success","Welcome to wanderlust");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    
    res.redirect(redirectUrl);

});
app.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
          return  next(err);
        }
        req.flash("success","You are logged out");
          res.redirect("/listings");
    })

});

// Middlewares

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found!"));
})

app.use((err,req,res,next)=>{
  let {statusCode=500,message="Internal server error"}=err;
  res.render("error",{err}); 
})
app.listen(8080,()=>{
    console.log("server is listening to port")

})



