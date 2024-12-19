const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://ayushojhaMongo:5LXXcobmwAyps6HP@namastenode.bbudh.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
