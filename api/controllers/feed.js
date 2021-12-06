const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");

const Post = require("../models/post");
const User = require("../models/user");

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
  const userId = req.userId;
  const imageUrl = req.file.path.replace("\\", "/");
  const post = new Post({
    title,
    content,
    imageUrl,
    creator: userId,
  });
  let creator;
  post
    .save()
    .then(() => {
      return User.findById(userId);
    })
    .then((user) => {
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then(() => {
      res.status(201).json({
        message: "Post created successfully.",
        post: post,
        creator: {
          _id: creator._id,
          name: creator.name,
        },
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
    const error = new Error("PUT post: Validation errors");
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }

  const postId = req.params.postId;
  const { title, content } = req.body;
  const imageUrl = req.file ? req.file.path.replace("\\", "/") : req.body.image;

  if (!imageUrl) {
    const error = new Error("PUT post: No image provided");
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
      if (post.creator.toString() !== req.userId) {
        const error = new Error("Not authorized.");
        error.statusCode = 403;
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
      if (post.creator.toString() !== req.userId) {
        const error = new Error("Not authorized.");
        error.statusCode = 403;
        throw error;
      }

      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then(() => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
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
