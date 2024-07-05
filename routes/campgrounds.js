const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, isAuthor, validateCampground} = require('../middleware');

const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

router.route('/')
    .get((req, res, next) => {
        console.log('GET /campgrounds');
        return catchAsync(campgrounds.index)(req, res, next);
    })
       
    .post(isLoggedIn, upload.array('image'), validateCampground, (req, res, next) => {
        console.log('POST /campgrounds');
        console.log('Request Body:', req.body);
        console.log('Uploaded Images:', req.files);
        return catchAsync(campgrounds.createCampground)(req, res, next);
    });

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor,upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor,catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor,catchAsync(campgrounds.renderEditForm));


module.exports = router;