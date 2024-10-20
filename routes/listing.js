const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
// const ExpressError=require("../utils/ExpressError.js");
// const {listingSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");

const listingController=require("../controllers/listings.js")

const multer  = require('multer');
 const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });//file jaa ke storage pe upload ho


//router.route tab use hota hai jab same path pe bhaut sare kaam hote hai uske ek sath likh sakte hai
router.route("/")
//index route
.get(wrapAsync(listingController.index))//index jo hai woh controller folder se aya hai
//create post route
//phele login hai ki nahi dekhenge phir validate karenge listing phir multer process karega image ko url layega cloud se phir controller ke anadar craete listing hai woh excetute hoga
.post(isLoggedIn,
     
     upload.single("listing[image]"),
     validateListing,
     wrapAsync(listingController.createListing));


//New Route
router.get("/new", isLoggedIn,listingController.renderNewForm);


router.route("/:id")
//show route
.get(wrapAsync(listingController.showListing))

//update route
.put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing,wrapAsync(listingController.updateListing))


//delete route
.delete( isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));



//Edit Route
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


module.exports=router;























