if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}




const express = require('express');
const path = require('path'); //this is so that we can use the path.join() function
const mongoose = require('mongoose');
const methodOverride = require('method-override'); //this is so that we can use the method-override package
const ejsMate = require('ejs-mate'); //this is so that we can use the ejs-mate package
const ExpressError = require('./utils/ExpressError.js'); //this is so that we can use the ExpressError class
const flash = require('connect-flash'); //this is so that we can use the connect-flash package

const passport = require('passport'); //this is so that we can use the passport package
const LocalStrategy = require('passport-local'); //this is so that we can use the passport-local package
const User = require('./models/user.js'); //this is so that we can use the User model

const { campgroundSchema, reviewSchema } = require('./schemas.js'); //this is so that we can use the campgroundSchema from the schemas.js file

const campgroundRoutes = require('./routes/campgrounds.js'); //this is so that we can use the campgrounds routes
const reviewRoutes = require('./routes/reviews.js'); //this is so that we can use the reviews routes
const userRoutes = require('./routes/users.js'); //this is so that we can use the users routes

const mongoSanitize = require('express-mongo-sanitize'); //this is so that we can use the express-mongo-sanitize package
const session = require('express-session'); //this is so that we can use the express-session package
const MongoStore = require('connect-mongo');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'; //this is so that we can use the .env file
//const dbUrl = 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl);

const db = mongoose.connection; //this is so that we can use the mongoose.connection.on() function

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});


const app = express();


app.set('view engine', 'ejs'); // this is so that we can use the ejs files as a many pages 
app.set('views', path.join(__dirname, 'views')); //this views is the name of the folder that contains all the ejs files

//this is so that we can use the req.body property
app.use(express.urlencoded({ extended: true }));

//this is so that we can use put and delete methods
app.use(methodOverride('_method'));


//changing default engine to ejs-mate
app.engine('ejs', ejsMate);
app.use(express.static('public')); //this is so that we can use the public folder

app.use(mongoSanitize({ //this is so that we can use the express-mongo-sanitize package
  replaceWith: '_'
}));


const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
      secret: 'process.env.SECRET',
  }
});

store.on("error on mongo session store", function (e) {
  console.log("SESSION STORE ERROR", e)
});


const sessionConfig = {
  store,
  secret: 'process.env.SECRET',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    //secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7

  }
}

app.use(session(sessionConfig));

app.use(flash());

app.use(passport.initialize()); //this is so that we can use the passport package
app.use(passport.session()); //this is so that we can use the passport package
passport.use(new LocalStrategy(User.authenticate())); //so here we are telling passport to use authentication from the User model

passport.serializeUser(User.serializeUser()); // this both for how to serelize and deserialize a user 
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.currentUser = req.user; //this is so that we can use the currentUser variable in all the ejs files
  res.locals.success = req.flash('success'); //this is so that we can use the flash message in the index.ejs file
  res.locals.error = req.flash('error'); //this is so that we can use the flash message in the index.ejs file
  next();
})

app.use('/', userRoutes); //this is so that we can use the users routes
app.use('/campgrounds', campgroundRoutes); //this is so that we can use the campgrounds routes
app.use('/campgrounds/:id/review', reviewRoutes); //this is so that we can use the reviews routes




app.get('/', (req, res) => {

  res.render('home');
});






app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

// app.use((err, req, res, next) => {
//   const { statusCode , message  } = err;
//   if (!err.message) err.message = 'Oh No, Something Went Wrong!' + err.message;
//   res.status(statusCode).render('error', { err });

// });
app.use((err, req, res, next) => {
  const { statusCode = 500, message} = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('campgrounds/error', { err })
})

app.listen(3000, () => {
  console.log('Server running on port 3000');
});