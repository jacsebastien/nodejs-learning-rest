const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Signup: Validation errors");
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }

  const { email, name, password } = req.body;

  try {
    const hashedPwd = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      password: hashedPwd,
      name,
    });
    const savedUser = await user.save();

    res.status(201).json({ userId: savedUser._id });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error(`No user found with this email: ${email}`);
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = new Error("Wrong password");
      error.statusCode = 401;
      throw error;
    }
    const userId = user._id.toString();

    const token = jwt.sign(
      {
        email: user.email,
        userId,
      },
      process.env.JWT_SALT,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, userId });
    return;
  } catch (err) {
    next(err);
    return err;
  }
};
