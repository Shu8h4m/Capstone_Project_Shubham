const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const usersRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const userRoute = require("./routes/user");
const User = require("./models/User");

const cookieParser = require("cookie-parser");


const app = express();
dotenv.config();

app.use(cors());

// database connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Database Connected'))
    .catch((err) => console.log('Database not connected', err));

app.use("/images", express.static(path.join(__dirname, "public/images")));
    
//middleware

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cookieParser());

const storage = multer.diskStorage({
    destination : (req,file,cb) =>{
        cb(null, "public/images" );
    },
    filename : (req,file,cb) =>{
        cb(null, req.body.name);
    },
})

const upload = multer({storage: storage});
app.post("/api/upload", upload.single("file"), (req,res) =>{
    try {
        return res.status(200).json("File Uploaded Succesfully.")
    } catch (error) {
        console.log(error)
    }
});

// Add the new routes for uploading profile and cover pictures

app.post("/api/user/upload-profile-picture", upload.single("profilePicture"), async (req, res) => {
    try {
        const userId = req.body.userId;
        const profilePictureUrl = `${req.file.filename}`;

        const user = await User.findByIdAndUpdate(userId, { profilePicture: profilePictureUrl }, { new: true });

        res.status(200).json({ message: "Profile picture updated successfully", user });
    } catch (err) {
        res.status(500).json(err);
    }
});

app.post("/api/user/upload-cover-picture", upload.single("coverPicture"), async (req, res) => {
    try {
        const userId = req.body.userId;
        const coverPictureUrl = `${req.file.filename}`;

        const user = await User.findByIdAndUpdate(userId, { coverPicture: coverPictureUrl }, { new: true });

        res.status(200).json({ message: "Cover picture updated successfully", user });
    } catch (err) {
        res.status(500).json(err);
    }
});


app.use("/api/user",userRoute)
app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);


app.listen(8800, ()=> console.log("Backend Server is Running"));