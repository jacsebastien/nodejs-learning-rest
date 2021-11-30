const express = require("express");
const feedCtrl = require("../controllers/feed");

const router = express.Router();

// GET /feed/posts
router.get("/posts", feedCtrl.getPosts);
// POST /feed/post
router.post("/post", feedCtrl.postPost);

module.exports = router;
