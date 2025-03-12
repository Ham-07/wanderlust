const Listing=require("./models/listing");
const Review=require("./models/review");
module.exports.isLoggedIn=(req,res,next)=>{
    
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in!");
        res.redirect("/login");
    }
    
    next();
}

module.exports.redirectPath=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
        
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
 let {id}=req.params;
 let listing=await Listing.findById(id);
 if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of listing");
    return res.redirect(`/listings/${id}`);
 }
 next();
};

module.exports.isReviewAuthor=async(req,res,next)=>{
    let{id,reviewId}=req.params;
    let review= await Review.findById(reviewId);
    if(!res.locals.currUser || !review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review ");
        return res.redirect(`/listings/${id}`);
    }
   
    next();
}