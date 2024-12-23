const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();

//Profile view API
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error getting the profile: " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request!");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    // one of the best practices to send response
    res.json({
      message: `${loggedInUser.firstName}, your profile was updated successfully.`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

profileRouter.patch("/profile/changePassword", userAuth, async (req, res) => {
  try {
    // take current password and check if it is valid
    const loggedInUser = req.user;
    const currentPassword = req.body.currentPassword;
    const isPasswordValid = await loggedInUser.validatePassword(
      currentPassword
    );
    if (!isPasswordValid) {
      throw new Error("Wrong Password!");
    }

    // if the current password is valid take the new password
    // and encrypt it before saving in the database

    const newPassword = req.body.newPassword;
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    loggedInUser["password"] = newPasswordHash;
    await loggedInUser.save();

    // logout the user
    res.cookie("token", null, { expires: new Date(Date.now()) });

    res.send("Password changed successfully");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = profileRouter;
