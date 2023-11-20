const User = require("../models/user.model.js");
const errorHandler = require("../utils/error");
const bcrypt = require("bcryptjs");

const test = (req, res) => {
  res.json({
    message: "Api route is working!",
  });
};

const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));
  res.status(200).clearCookie("access_token").json({
    success: true,
    message: "User has been deleted!",
  });
  try {
    await User.findByIdAndDelete(req.params.id);
  } catch (err) {
    next(err);
  }
};

module.exports = { test, updateUser, deleteUser };
