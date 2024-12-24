const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age gender about photoUrl skills";

//get all pending connection requests for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Data fetched successfully.",
      data: connectionRequest,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});
// get connections

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Connection data retrieved successfully.",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
module.exports = userRouter;
