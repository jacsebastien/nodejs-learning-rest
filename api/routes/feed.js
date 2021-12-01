const express = require("express");
const feedCtrl = require("../controllers/feed");
const { body } = require("express-validator/check");

const router = express.Router();

// GET /feed/posts
router.get("/posts", feedCtrl.getPosts);
// POST /feed/post
router.post(
  "/post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedCtrl.postPost
);

module.exports = router;
