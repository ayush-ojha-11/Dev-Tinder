const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

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
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: "Connection data retrieved successfully.",
      data: data,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    //limit and skip for pagination

    const page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;
    const loggedInUser = req.user;

    // Find all connectionRequests that I have sent or received
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hiddenUsersFromFeed = new Set(); // set only can have unique values
    connectionRequests.forEach((req) => {
      hiddenUsersFromFeed.add(req.fromUserId.toString());
      hiddenUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (error) {
    res.status(400).json({ message: "Error: " + error.message });
  }
});
module.exports = userRouter;
