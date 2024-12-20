const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: 1,
      maxLength: 20,
      trim: true,
      required: true,
    },

    lastName: {
      type: String,
      minLength: 1,
      maxLength: 20,
      trim: true,
    },

    age: {
      type: Number,
      trim: true,
      min: 18,
      max: 70,
    },

    gender: {
      type: String,
      trim: true,
    },

    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,

      // the data is validated before entering the database
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },

    password: {
      type: String,
      trim: true,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Enter a Strong Password (Min 1 uppercase, 1 lowercase, 1 digit, 1 symbol and min length of 8 characters)"
          );
        }
      },
    },

    photoUrl: {
      type: String,
      trim: true,
      default: "",
    },
    about: {
      type: String,
      trim: true,
      default: "This is default description of user",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
