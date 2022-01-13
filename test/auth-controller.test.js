const expect = require("chai").expect;
const sinon = require("sinon");

const User = require("../models/user");
const AuthCtrl = require("../controllers/auth");

describe("Auth Controller - Login", () => {
  before(() => {
    sinon.stub(User, "findOne");
  });

  it("Should throw an error if accessing the database fails", (done) => {
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
  });

  after(() => {
    User.findOne.restore();
  });
});
