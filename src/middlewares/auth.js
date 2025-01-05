const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // get the token
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login!");
    }

    // validate the token
    const decodedObj = await jwt.verify(token, "DEV@TINDER@79");

    // get the user
    const { _id } = decodedObj;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    } else {
      // attach the user to user object
      req.user = user;
      // calling next to move to next request handler
      next();
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};
//
module.exports = { userAuth };
