const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const errorHandler = require("../utils/error.js");

const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    console.log(newUser);
    await newUser.save();
    res.status(201).json({ message: "User created successfully.." });
  } catch (error) {
    next(error);
  }
};

module.exports = signup;
