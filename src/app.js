const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

// routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

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
// to avoid cors error
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// using express.json to read JSON data from request for all routes
app.use(express.json());

//miidleware to read cookiesnp
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
//New commit
