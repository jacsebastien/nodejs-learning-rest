const { validationResult } = require("express-validator");

const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({ posts });
    })
    .catch((err) => next(err));
};

exports.postPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("POST post: validation errors");
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }

  const { title, content } = req.body;
  const post = new Post({
    title,
    content,
    imageUrl: "images/tw3.png",
    creator: { name: "Seb" },
  });

  post
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Post created successfully.",
        post: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not found.");
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({ post });
    })
    .catch((err) => {
      next(err);
    });
};
