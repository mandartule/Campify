const User = require('../models/user');
const users = require('../models/user'); //this is so that we can use the users controller



module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

let registeredUser = null;
module.exports.registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new users({ email, username });
        registeredUser = await users.register(user, password);

        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds'; // update this line to use res.locals.returnTo now
    delete res.locals.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    });
}