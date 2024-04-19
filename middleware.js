const { campgroundSchema, reviewSchema } = require('./schemas.js'); //this is so that we can use the campgroundSchema from the schemas.js file
const ExpressError = require('./utils/ExpressError'); //this is so that we can use the ExpressError class from the ExpressError.js file
const Campground = require('./models/campground'); //this is so that we can use the Campground model from the campground.js file
const Review = require('./models/review.js'); //this is so that we can use the Review model from the review.js file

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;

    }
    next();
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) { //if the user is not logged in
        req.session.returnTo = req.originalUrl; //this is so that we can redirect the user to the page they were trying to access after they login
        req.flash('error', 'You must be signed in first!'); //this is so that we can use the flash message in the index.ejs file
        return res.redirect('/login');
    }
    next();

    
}


module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body); //this is so that we can use the campgroundSchema from the schemas.js file
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params; //destructuring the id from the req.params object
    const campground = await Campground.findById(id); //finding the campground with the id that is passed in the url
    if (!campground.author.equals(req.user._id)) { //this is so that only the user that created the campground can edit it
        req.flash('error', "You don't have the permission to do that ") //this is so that we can use the flash message in the index.ejs file
        return res.redirect('/campgrounds');
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); //this is so that we can use the reviewSchema from the schemas.js file
    if (error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id,reviewId } = req.params; //destructuring the id from the req.params object
    const review = await Review.findById(reviewId); //finding the campground with the id that is passed in the url
    if (!review.author.equals(req.user._id)) { //this is so that only the user that created the campground can edit it
        req.flash('error', "You don't have the permission to do that ") //this is so that we can use the flash message in the index.ejs file
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
