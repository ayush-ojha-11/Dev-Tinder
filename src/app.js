const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Sachin",
    lastName: "Ojha",
  });

  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error saving the data ", err.message);
  }
});

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
