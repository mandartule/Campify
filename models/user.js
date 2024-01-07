const mongoose = require('mongoose');
const userSchema = new mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
UserSchema.plugin(passportLocalMongoose); //this is so that we can use the passport-local-mongoose package  
 
module.exports = mongoose.model('User', UserSchema);//this is so that we can use the User model in other files