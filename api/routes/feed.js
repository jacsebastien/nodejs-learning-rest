const express = require("express");
const feedCtrl = require("../controllers/feed");
const { body } = require("express-validator");

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
  feedCtrl.createPost
);

router.get("/post/:postId", feedCtrl.getPost);

router.put(
  "/post/:postId",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedCtrl.updatePost
);

module.exports = router;
