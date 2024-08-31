const jwt = require('jsonwebtoken');
// JWT Verify middleware

const verifyToken = async (req,res,next) =>{
    const token = req.cookies.token;
    if(!token){
        console.log("No token found in cookies");
        return res.status(403).json("A token is required for authentication")
       
    }
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token decoded successfully:", decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Error decoding token:", err);
        return res.status(401).json("Invalid Token")
    }
     
}

module.exports = verifyToken;