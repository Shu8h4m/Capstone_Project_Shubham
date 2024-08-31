const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const User = require("../models/User");
const bcrypt = require("bcrypt");

//update user
router.put("/:id",verifyToken ,async (req,res) =>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt)
            } catch(err){
                return res.status(500).json(err);
            };
        };
        try {
            const updatedUser = await User.findByIdAndUpdate(
              req.params.id,
              {
                $set: req.body,
              },
              { new: true }
            );
            res.status(200).json(updatedUser);
          } catch (error) {
            return res.status(500).json(error);
          }
    }else{
        return res.status(403).json("You can update only your account")
    }
});

//delete user
router.delete("/:id", verifyToken,async (req,res) =>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
      
        try {
            const user = await User.findByIdAndDelete(req.params.id );
            res.status(200).json("Account has been deleted")
        } catch (error) {
            return res.status(500).json(error);
        }
    }else{
        return res.status(403).json("You can delete only your account")
    }
});

//get a user
router.get("/" ,verifyToken, async (req,res) =>{
    const username = req.query.username;
    const userId = req.query.userId;
    try {
        const user = userId ? await User.findById(userId) : await User.findOne({username : username});
        const { password, updatedAt, ...other} = user._doc;
        res.status(200).json(other);
    } catch (error) {
        res.status(500).json(error);
    }
});

// get friends
router.get("/friends/:userId", verifyToken,async (req,res) =>{
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json("User not found");
        }
        const friends = await Promise.all(
            user.followings.map((friendId) => {
                return User.findById(friendId) 
            })
        )
        let friendList = [];
        friends.map((friend) => {
            const {_id, username, profilePicture} = friend;
            friendList.push({_id, username, profilePicture});
        });
        res.status(200).json(friendList);
    } catch (error) {
        res.status(500).json(error)
    }
    
})

// follow a user
router.put("/:id/follow" ,verifyToken, async (req,res) =>{
    if(req.params.id !== req.body.userId){
        try {
            const user = await User.findById(req.params.id);
            const currentUser =await User.findById(req.body.userId);

            if(!user.followers.includes(req.body.userId)){

                await user.updateOne({$push:{followers : req.body.userId}});

                await currentUser.updateOne({$push:{followings : req.params.id}});

                res.status(200).json("user has been followed");

            }else{
                res.status(403).json("you already follow this user")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }else {
        res.status(403).json("You cannot follow yourself")
    }
});

// unfollow a user
router.put("/:id/unfollow" ,verifyToken, async (req,res) =>{
    if(req.params.id !== req.body.userId){
        try {
            const user = await User.findById(req.params.id);
            const currentUser =await User.findById(req.body.userId);

            if(user.followers.includes(req.body.userId)){

                await user.updateOne({$pull:{followers : req.body.userId}});

                await currentUser.updateOne({$pull:{followings : req.params.id}});

                res.status(200).json("user has been unfollowed");

            }else{
                res.status(403).json("you dont follow this user")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }else {
        res.status(403).json("You cannot unfollow yourself")
    }
});


// get users

router.get('/search', async (req, res) => {
    const searchQuery = req.query.q;
    try {
      const users = await User.find({
        username: { $regex: `^${searchQuery}`, $options: 'i' }
      });
      res.json(users);
    } catch (err) {
      res.status(500).send(err);
    }
  });



module.exports = router