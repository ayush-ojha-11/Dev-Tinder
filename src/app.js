const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const validation = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

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

// Sign up API
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

//login API
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // Validate whether email is present in the database or not
    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("Invalid Credentials!");
    }
    // if the email is present, validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // Creating a JWT token (hiding the userId in the token)
      const token = await jwt.sign({ _id: user._id }, "DEV@TINDER@79", {
        expiresIn: "4d",
      });

      // Add the token to the cookie and send response to the user
      res.cookie("token", token);
      res.send("Login Successful.");
    } else {
      throw new Error("Invalid Credentials!");
    }
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

//Profile API
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error getting the profile: " + error.message);
  }
});

//sendConnectionRequest API

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + " sent the connection request.");
});
