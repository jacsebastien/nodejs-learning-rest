require("dotenv").config();
const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const UserCtrl = require("../controllers/user");

describe("User Controller - Get Status", () => {
  it("Should send a response with valid user status for existing user", (done) => {
    mongoose
      .connect(process.env.MONGODB_TEST_CONNECTION_STRING)
      .then(() => {
        const user = new User({
          email: "test@test.test",
          password: "password",
          name: "Test User",
          posts: [],
        });
        return user.save();
      })
      .then((res) => {
        const req = { user: res._id.toString() };
      })
      .catch((err) => console.log(err));
  });
});
