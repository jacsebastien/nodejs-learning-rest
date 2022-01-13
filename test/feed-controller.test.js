require("dotenv").config();
const expect = require("chai").expect;
const mongoose = require("mongoose");

const User = require("../models/user");
const FeedCtrl = require("../controllers/feed");

describe("Feed Controller", () => {
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

  it("Should create a post for the user", (done) => {
    const req = {
      body: {
        title: "Test post",
        content: "A test post",
      },
      file: {
        path: "a/test/path",
      },
      userId: createdUserId,
    };

    const res = {
      statusCode: 500,
      jsonResponse: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.jsonResponse = data;
      },
    };
    FeedCtrl.createPost(req, res, () => {})
      .then(() => {
        const { statusCode, jsonResponse } = res;
        expect(statusCode).to.be.equal(201);
        expect(jsonResponse).to.have.property("post");
        expect(jsonResponse).to.have.property("creator");
        expect(jsonResponse.creator).to.have.property("posts");
        expect(jsonResponse.creator.posts).to.have.length(1);
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
