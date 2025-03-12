const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage});





router.get("/", wrapAsync(listingController.index));
// New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);
//Show Route
router.get("/:id", wrapAsync(listingController.showListing)
);
// New Route
router.post("/",
    isLoggedIn, 
    upload.single('listing[image]'),
    wrapAsync(listingController.addListing)


);
// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editListing));
// Update Route
router.post("/:id/edit",isLoggedIn,isOwner,upload.single('edit[image]'), wrapAsync(listingController.updateListing));
// Delete Route
router.get("/:id/delete",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));



module.exports=router;