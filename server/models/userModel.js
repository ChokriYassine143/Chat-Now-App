const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        min: 3,
        max: 20,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        min: 6,
        max: 50, 
        required: true,
        unique: true,
    },
    password: {

        type: String,
        min: 6,
        max: 50,
        required: true,
    } ,
    isAvatarImageSet: {
        type: Boolean,
        default: false,
    },
    avatarImage: {
        type: String,
        default: "",
    },
}, { timestamps: true });
module.exports = mongoose.model("Users", userSchema);