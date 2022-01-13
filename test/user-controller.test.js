require("dotenv").config();
const expect = require("chai").expect;
const mongoose = require("mongoose");

const User = require("../models/user");
const UserCtrl = require("../controllers/user");

describe("User Controller - Get Status", () => {
  let createdUserId = null;

  before((done) => {
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
      .then((createdUser) => {
        createdUserId = createdUser._id.toString();
        done();
      });
  });

  it("Should send a response with valid user status for existing user", (done) => {
    const req = { userId: createdUserId };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      },
    };
    UserCtrl.getStatus(req, res, () => {})
      .then(() => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.userStatus).to.be.equal("I'm new");
        done();
      })
      .catch((err) => done(err));
  });

  after((done) => {
    User.deleteMany({})
      .then(() => mongoose.disconnect())
      .then(() => done());
  });
});
