const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  const token = authHeader ? req.get("Authorization").split(" ")[1] : null;

  const decodedToken = jwt.verify(token, "nodejs on the rock !");

  if (!decodedToken) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodedToken.userId;
  next();
};
