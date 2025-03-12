const Listing=require("../models/listing");

module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index",{allListings});
}

module.exports.renderNewForm=(req,res)=>{
        res.render("./listings/new");
        
}

module.exports.showListing= async(req,res)=>{
        const {id} =req.params;
        const list=await Listing.findById(id).populate({
            path:"review",
        populate:{
            path:"author"
        }})
            .populate("owner");
        if(!list){
            req.flash("error","Listing does not exist");
            res.redirect("/listings");
        }
        res.render("listings/show",{list});
}

module.exports.addListing=   async(req,res,next)=>{
    const url=req.file.path;
    const filename=req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New listing created");
    res.redirect("/listings");
};

module.exports.editListing=  async(req,res)=>{
    let {id}=req.params;
    let detail=await Listing.findById(id);
    res.render("./listings/edit",{detail});
};

module.exports.updateListing=   async(req,res)=>{
    const editedList=req.body.edit;
    const url=req.file.path;
    const filename=req.file.filename;
    let {id}=req.params;
    console.log(editedList);
    const listing=await Listing.findByIdAndUpdate(id,{...editedList});
    listing.image={url,filename};
    listing.save();

    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=  async(req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing  deleted");
    res.redirect("/listings");
}

