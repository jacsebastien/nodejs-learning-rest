const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let loadedUser;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        const error = new Error("No user found with this email");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;

      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong password");
        error.statusCode = 401;
        throw error;
      }
      const userId = loadedUser._id.toString();

      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId,
        },
        "nodejs on the rock !",
        { expiresIn: "1h" }
      );

      res.status(200).json({ token, userId });
    })
    .catch((err) => next(err));
};
