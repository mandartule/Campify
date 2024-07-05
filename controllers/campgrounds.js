const Campground = require('../models/campground.js');
const { cloudinary } = require('../cloudinary/index.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); //for geocoding
const mapBoxToken = process.env.MAPBOX_TOKEN; //for geocoding
const geocoder = mbxGeocoding({ accessToken: mapBoxToken }); //for geocoding

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({}); //finding all campgrounds in the database
    res.render('campgrounds/index', { campgrounds }); //rendering the index.ejs file and passing the campgrounds object to it
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new'); //rendering the new.ejs file
}

module.exports.createCampground = async (req, res, next) => {
    
    const geoData = await geocoder.forwardGeocode({ //for geocoding
        query: req.body.campground.location, //for geocoding
        limit: 1 //for geocoding
    }).send() //for geocoding
    
 

    const camp = new Campground(req.body.campground); //first creating a new campground with the data that is passed in the req.body.campground object
  

    camp.geometry = geoData.body.features[0].geometry; //for geocoding
    
    camp.image = req.files.map(f => ({ url: f.path, filename: f.filename })); //this is so that we can save the images to the database
  
    camp.author = req.user._id; //this is so that we can save the id of the user that created the campground
  
    await camp.save();//second saving the new campground to the database
    
    req.flash('success', 'Successfully made a new campground!') //this is so that we can use the flash message in the index.ejs file
    res.redirect(`/campgrounds/${camp._id}`); //third redirecting to the show page of the new campground
 }


module.exports.showCampground = async (req, res) => {

    const campground = await Campground.findById(req.params.id).populate(
        {
            path: 'review', //specifying the path to the review model
            populate: {
                path: 'author'//populating the author field of the REVIEW MODEL
            }
        }).populate('author')//populating the author field of the CAMPGROUND MODEL
    if (!campground) {
        req.flash('error', 'Cannot find that campground!') //this is so that we can use the flash message in the index.ejs file
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params; //destructuring the id from the req.params object
    const campground = await Campground.findById(id); //finding the campground with the id that is passed in the url
    if (!campground) {
        req.flash('error', 'Cannot find that campground!') //this is so that we can use the flash message in the index.ejs file
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });

}


module.exports.updateCampground = async (req, res) => {
    const { id } = req.params; //destructuring the id from the req.params object
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }); //finding the campground with the id that is passed in the url and updating it with the data that is passed in the req.body.campground object
    
    // Get the new coordinates for the updated location
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();

    // Update the geometry field with the new coordinates
    campground.geometry = geoData.body.features[0].geometry;
    
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename })); //this is so that we can save the images to the database
    campground.image.push(...imgs); //we are not pushing array we are puching individual imgaes
    
    await campground.save(); //saving the updated campground to the database
    
    if (req.body.deleteImages) { //if the user has checked the deleteImages checkbox
        for (let filename of req.body.deleteImages) { //looping through the filenames that are passed in the req.body.deleteImages array
            await cloudinary.uploader.destroy(filename); //deleting the images from cloudinary
        }
        await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } }) //deleting the images from the database
    }

    req.flash('success', 'Successfully updated campground!') //this is so that we can use the flash message in the index.ejs file
    res.redirect(`/campgrounds/${campground._id}`);

}

   module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params; //destructuring the id from the req.params object

    const campground = await Campground.findById(id); // Retrieve the campground to get the images
    // Check if there are images to delete
    if (campground.image) {
      
        for (let i of campground.image) { // Loop through the images
            await cloudinary.uploader.destroy(i.filename); // Delete each image from Cloudinary
        }
    }

    await Campground.findByIdAndDelete(id); //finding the campground with the id that is passed in the url and deleting it
    req.flash('success', 'Successfully deleted campground!') //this is so that we can use the flash message in the index.ejs file
    res.redirect('/campgrounds');

}


















