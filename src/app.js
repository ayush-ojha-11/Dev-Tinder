const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const validation = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

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

//miidleware to read cookiesnp
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

//login API

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("Invalid Credentials!");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send("Login Successful.");
    } else {
      throw new Error("Invalid Credentials!");
    }
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});
