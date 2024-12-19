const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

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
    res.status(400).send("Error saving the data ", err.message);
  }
});

// Get a user

app.get("/user", async (req, res) => {});
