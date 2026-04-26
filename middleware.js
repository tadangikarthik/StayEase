const Listing=require("./models/listing");
const Review=require("./models/review");
const Booking=require("./models/booking");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema,bookingSchema,paymentSchema}=require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params;
  let listing=await Listing.findById(id);
  if( !listing.owner.equals(res.locals.curUser._id)){
    req.flash("error","You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};


module.exports.validateListing=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg)
  }else{
    next();
  }
};

module.exports.validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg)
  }else{
    next();
  }
};

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id, reviewId } = req.params;
  let review=await Review.findById(reviewId);
  if( !review.author.equals(res.locals.curUser._id)){
    req.flash("error","You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateBooking=(req,res,next)=>{
  let {error}=bookingSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg)
  }else{
    next();
  }
};

module.exports.isBookingUser=async(req,res,next)=>{
    let { bookingId } = req.params;
  let booking=await Booking.findById(bookingId);
  if(!booking){
    req.flash("error","Booking not found!");
    return res.redirect("/listings");
  }
  if( !booking.user.equals(res.locals.curUser._id)){
    req.flash("error","You are not authorized to access this booking");
    return res.redirect("/listings");
  }
  next();
};