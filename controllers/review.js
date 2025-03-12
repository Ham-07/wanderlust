const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

module.exports.createReview=async(req,res)=>{
    const {id} =req.params;

    const listing=await Listing.findById(id);
    const newReview=new Review(req.body.review);
    newReview.author=req.user;
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);

}

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}