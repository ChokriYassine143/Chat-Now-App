const User = require('../models/userModel');
const bcrypt = require('bcrypt');

module.exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    console.log("Request body:", req.body); // Log the request body for debugging
    try {
        // Check if username already exists
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck) {
            return res.status(400).json({ msg: "Username already exists", success: false });
        }

        // Check if email already exists
        const emailCheck = await User.findOne({ email }); // Fixed: Changed 'user' to 'User' and added 'await'
        if (emailCheck) {
            return res.status(400).json({ msg: "Email already exists", success: false });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        // Remove password from response
        const userResponse = user.toObject(); // Convert Mongoose document to plain object
        delete userResponse.password; // Remove password field

        return res.status(200).json({ user: userResponse, success: true });
    } catch (error) {
        console.error("Registration error:", error); // Log error for debugging
        return res.status(500).json({ error: error.message, success: false });
    }
};
module.exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: "User not found", success: false });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ msg: "Invalid password", success: false });
        }

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(200).json({ user: userResponse, success: true });
    } catch (error) {
        console.error("Login error:", error); // Log error for debugging
        return res.status(500).json({ error: error.message, success: false });
    }
}
module.exports.setAvatar = async (req, res) => {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    try {
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage,
        }, { new: true });
        return res.status(200).json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });
    } catch (error) {
        console.error("Error setting avatar:", error); // Log error for debugging
        return res.status(500).json({ error: error.message });
    }
};
module.exports.getAllUsers = async (req, res) => {
    const userId = req.params.id;
    try {
        const users = await User.find({ _id: { $ne: userId } }).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error); // Log error for debugging
        return res.status(500).json({ error: error.message });
    }
}