const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");

const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const itemsPerPage = 2;
  let totalItems;
  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * itemsPerPage)
        .limit(itemsPerPage);
    })
    .then((posts) => {
      res.status(200).json({ posts, totalItems });
    })
    .catch((err) => next(err));
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("POST post: Validation errors");
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }
  // multer store image infos in 'file' property
  if (!req.file) {
    const error = new Error("POST post: No image provided");
    error.statusCode = 422;
    throw error;
  }

  const { title, content } = req.body;
  const imageUrl = req.file.path.replace("\\", "/");
  const post = new Post({
    title,
    content,
    imageUrl,
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
    .catch((err) => next(err));
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
    .catch((err) => next(err));
};

exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("POST post: Validation errors");
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }

  const postId = req.params.postId;
  const { title, content } = req.body;
  const imageUrl = req.file ? req.file.path.replace("\\", "/") : req.body.image;

  if (!imageUrl) {
    const error = new Error("POST post: No image provided");
    error.statusCode = 422;
    throw error;
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not found.");
        error.statusCode = 404;
        throw error;
      }

      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }

      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ post: result });
    })
    .catch((err) => next(err));
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not found.");
        error.statusCode = 404;
        throw error;
      }
      // TODO: Check if user can delete the post
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then(() => {
      res.status(200).json({ deletedPost: postId });
    })
    .catch((err) => next(err));
};

const clearImage = (filePath) => {
  // eslint-disable-next-line no-undef
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
