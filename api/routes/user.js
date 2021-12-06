const express = require("express");
const { body } = require("express-validator");

const userCtrl = require("../controllers/user");
const authGuard = require("../middleware/auth");

const router = express.Router();

router.get("/status", authGuard, userCtrl.getStatus);
router.patch(
  "/status",
  authGuard,
  [body("status").trim().not().isEmpty()],
  userCtrl.updateStatus
);

module.exports = router;
