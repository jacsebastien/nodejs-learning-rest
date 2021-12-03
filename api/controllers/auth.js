const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Signup: Validation errors");
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }

  const { email, name, password } = req.body;
  bcrypt
    .hash(password, 12)
    .then((hashedPwd) => {
      const user = new User({
        email,
        password: hashedPwd,
        name,
      });
      return user.save();
    })
    .then((savedUser) => {
      res.status(201).json({ userId: savedUser._id });
    })
    .catch((err) => next(err));
};
