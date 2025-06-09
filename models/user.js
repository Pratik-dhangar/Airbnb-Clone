const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({
     email: {
        type: String,
        required: true
     }
});


userSchema.plugin(passportLocalMongoose); //thi plugin automatically generate username, hash and salt (password) and saves in db


module.exports= mongoose.model('User', userSchema);