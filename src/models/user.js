const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
  },

  age: {
    type: Number,
    min: 18,
    required: true,
  },

  gender: {
    type: String,
  },

  emailId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  photoUrl: {
    type: String,
    default: "",
  },
  about: {
    type: String,
    default: "This is default description of user",
  },
  skills: {
    type: [String],
  },
});
module.exports = mongoose.model("User", userSchema);
