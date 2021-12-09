const https = require("https");
const fs = require("fs");
const path = require("path");

const createServer = (app) => {
  const key = fs.readFileSync(path.join(__dirname, "..", "server.key"));
  const cert = fs.readFileSync(path.join(__dirname, "..", "server.cert"));

  return https.createServer({ key, cert }, app);
};

module.exports = { createServer };
