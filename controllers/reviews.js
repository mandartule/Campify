const Campground = require('../models/campground');
const Review = require('../models/review.js');

module.exports.createReview = async (req, res) => {

    const campground = await Campground.findById(req.params.id); //finding the campground with the id that is passed in the url
    const review = new Review(req.body.review); //creating a new review with the data that is passed in the req.body.review object
    review.author = req.user._id; //this is so that we can save the id of the user that created the review
    campground.review.push(review); //pushing the review to the campground
    await review.save(); //saving the review to the database
    await campground.save(); //saving the campground to the database
    req.flash('success', 'Created new review!'); //this is so that we can use the flash message in the index.ejs file
    res.redirect(`/campgrounds/${campground._id}`); //redirecting to the show page of the campground

}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params; //destructuring the id and reviewId from the req.params object
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } }); //finding the campground with the id that is passed in the url and deleting the review with the id that is passed in the req.params.reviewId object
    await Review.findByIdAndDelete(reviewId); //finding the review with the id that is passed in the req.params.reviewId object and deleting it
    req.flash('success', 'Successfully deleted review!'); //this is so that we can use the flash message in the index.ejs file
    res.redirect(`/campgrounds/${id}`); //redirecting to the show page of the campground
}

