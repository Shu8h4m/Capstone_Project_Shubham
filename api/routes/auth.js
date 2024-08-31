const router = require("express").Router();
const { loginController } = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");
const User = require("../models/User");
const bcrypt = require("bcrypt");


// Register user
router.post("/register",async (req,res) =>{
    
   
    try {

        // generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // create new user
        const newUser = new User({
            username : req.body.username,
            email : req.body.email,
            password : hashedPassword,
        });

        // save user and return response
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});


//LOGIN

router.post("/login",loginController)

//Logout 

router.post("/logout", (req,res) =>{
    res.clearCookie("token");
    res.status(200).json("Logged out SuccessFully");
})

module.exports = router