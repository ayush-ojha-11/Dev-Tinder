const express = require("express");

const app = express();

app.use((req, res) => {
  res.send("Welcome to server!");
});

app.listen(7099, () => {
  console.log("Server is successfully running on port 7099");
});
