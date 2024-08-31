const router = require("express").Router();
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');

// Protected route to get the user's profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        // Find the user by the ID stored in the JWT
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json("User not found");
        }
        // Send back the user's profile information
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;