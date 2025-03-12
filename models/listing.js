const mongoose=require("mongoose");
const review = require("./review");
const Schema=mongoose.Schema;

const listingSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
      url:String,
      filename:String
    },
    price:Number,
    location:String,
    country:String,
    review:[
    {
        type:Schema.Types.ObjectId,
        ref:"Review"
    }
],
owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
}
});

const Listing= mongoose.model("listing" , listingSchema);
module.exports=Listing;


