const Listing=require("../models/listing");
const Review=require("../models/review");

module.exports.createReview=async(req,res)=>{
    
    //console.log(req.params.id);
    
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    //res.send("new review saved");
    req.flash("success","New Review Created Successfully");

    res.redirect(`/listings/${listing._id}`);
    
    }
module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});//jaise $in operator hota hai waise hi $pull hai jo ki listing me se reviews array se uske id wale review ko delete karega  
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");

    res.redirect(`/listings/${id}`);
    }






















