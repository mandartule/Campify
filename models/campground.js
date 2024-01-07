const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200'); //requesting 200 pixel image for deleting
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    image : [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts); 

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<h3><strong><a href="/campgrounds/${this._id}">${this.title}</a></strong></h3>
    <h4><p>${this.location}...</p></h4>`
});


//for deleteing the reviews when a campground is deleted
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.review
            }
        })
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);