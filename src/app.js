const express = require("express");

const app = express();

app.listen(7099, () => {
  console.log("Server is successfully running on port 7099");
});

app.use("/ab+c", (req, res) => {
  res.send("Test route...");
});

app.use("/home", (req, res) => {
  res.send("Home route...");
});

app.get("/user", (req, res) => {
  res.send({ "first name": "Ayush" });
});

app.post("/user", (req, res) => {
  res.send("Data saved successfully!!");
});
