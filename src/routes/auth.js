const express = require("express");
const validation = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

// Sign up API
authRouter.post("/signup", async (req, res) => {
  try {
    //Validation of data
    validation.validateSignUpData(req);

    //Encrypting the password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    // Creating new instance of user model

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    // Add the token to the cookie and send response to the user
    res.cookie("token", token);

    res.json({ message: "User added successfully", data: savedUser });
  } catch (err) {
    res.status(400).send("Error saving the data " + err.message);
  }
});

//login API
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // Validate whether email is present in the database or not
    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("Invalid Credentials!");
    }
    // if the email is present, validate the password (using the schema level function)
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // Creating a JWT token (hiding the userId in the token)
      // schema level function getJWT
      const token = await user.getJWT();

      // Add the token to the cookie and send response to the user
      res.cookie("token", token);
      res.send(user);
    } else {
      throw new Error("Invalid Credentials!");
    }
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("logout successful.");
});

module.exports = authRouter;
