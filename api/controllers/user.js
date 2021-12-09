const { validationResult } = require("express-validator");
const User = require("../models/user");

exports.getStatus = async (req, res, next) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ status: user.status });
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("PUT user: Validation errors");
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }

  const { status } = req.body;
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    user.status = status;
    const savedUser = user.save();
    res
      .status(200)
      .json({ message: "Status updated", status: savedUser.status });
  } catch (err) {
    next(err);
  }
};
