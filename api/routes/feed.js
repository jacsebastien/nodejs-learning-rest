const express = require("express");
const { body } = require("express-validator");

const feedCtrl = require("../controllers/feed");
const authGuard = require("../middleware/auth");

const router = express.Router();

// GET /feed/posts
router.get("/posts", authGuard, feedCtrl.getPosts);
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

router.delete("/post/:postId", feedCtrl.deletePost);

module.exports = router;
