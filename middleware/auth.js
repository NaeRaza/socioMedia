const jwt = require("jsonwebtoken")
const User = require("../models/User")


//Verification du token
const verifyToken = async (req, res, next)=> {
    try{
        let token = req.header("Authorization")

        if (!token){
            return res.status(403).json("Access Denied")
        }

        if(token.startsWith("Bearer ")){
            token = token.slice(7, token.lenght).trimLeft();
        }
        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(403).json("User don't have token");
        }

        const verified = jwt.verify(token, user.secretKey)
        req.user = verified;
        next();

    }catch(err){
        res.status(500).json({ error: err.message})
    }
  }

  module.exports = verifyToken