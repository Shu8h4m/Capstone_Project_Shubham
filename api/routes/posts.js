const router = require("express").Router();

const verifyToken = require("../middleware/verifyToken");
const Post = require("../models/Post");
const User = require("../models/User");

//create a post
router.post("/", verifyToken, async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

//update a post
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your posts");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//delete a post
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("the post has been DELETED");
    } else {
      res.status(403).json("you can DELETE only your posts");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// like/dislike a post
router.put("/:id/like", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//get a post
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    return res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get timeline posts(all the posts user follows)
router.get("/timeline/:userId", verifyToken, async (req, res) => {
  try {
    console.log(`Fetching timeline posts for user: ${req.params.userId}`);
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (error) {
    console.error("Error fetching timeline posts:", error);
    res.status(500).json(error);
  }
});

// get all posts by user
router.get("/profile/:username", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching timeline posts:", error);
    res.status(500).json(error);
  }
});

module.exports = router;
