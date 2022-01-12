const expect = require("chai").expect;
const jwt = require("jsonwebtoken");
const sinon = require("sinon");
const authMiddleware = require("../middleware/auth");

describe("Auth Middleware", () => {
  it("Should throw an error if NO auth header is present", () => {
    const req = {
      get: () => null,
    };

    expect(() => authMiddleware(req, {}, () => {})).to.throw();
  });

  it("Should throw an error if auth header is only one word", () => {
    const req = {
      get: () => "xyz",
    };

    expect(() => authMiddleware(req, {}, () => {})).to.throw();
  });

  it("Should yield a userId after decoding the token", () => {
    const req = {
      get: () => "Bearer dummyjwttoken",
    };

    // Mock jwt.verify method to be sure it will always return an object containing userId
    sinon.stub(jwt, "verify");
    // returns() is added by sinon
    jwt.verify.returns({ userId: "abc" });

    authMiddleware(req, {}, () => {});
    // After calling the middleware, userId should be added to req
    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId", "abc");
    expect(jwt.verify.called).to.be.true;

    // Restore verify method to it's normal implementation to not interfere with next tests
    jwt.verify.restore();
  });

  it("Should throw an error if the token cannot be verified", () => {
    const req = {
      get: () => "Bearer xyz",
    };

    expect(() => authMiddleware(req, {}, () => {})).to.throw();
  });
});
