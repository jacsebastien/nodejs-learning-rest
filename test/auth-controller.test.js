const expect = require("chai").expect;
const sinon = require("sinon");

const User = require("../models/user");
const AuthCtrl = require("../controllers/auth");

describe("Auth Controller - Login", () => {
  it("Should throw an error if accessing the database fails", (done) => {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "test@test.test",
        password: "password",
      },
    };

    AuthCtrl.login(req, {}, () => {}).then((result) => {
      expect(result).to.be.an("error");
      done();
    });

    User.findOne.restore();
  });
});
