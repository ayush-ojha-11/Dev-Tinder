const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

User.syncIndexes();

// connect to database
connectDB()
  .then(() => {
    console.log("Connected to Database successfully.");
    // start listening to server once database is connected successfully
    app.listen(7099, () => {
      console.log("Server is successfully running on port 7099");
    });
  })
  .catch((err) => {
    console.error("Database connection failed!");
  });

// using express.json to read JSON data from request for all routes
app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error saving the data " + err.message);
  }
});

// feed api - GET all users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

// delete API - to delete a user from the database

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    res.send("User deleted successfully.");
  } catch (error) {
    res.status(400).send("Error in deleting the user!");
  }
});

// update API - update data of user

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: "truen",
    });
    res.send("User data updated successfully.");
  } catch (error) {
    res.status(400).send("Error in updating the user data!");
  }
});
