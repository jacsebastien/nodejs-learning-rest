const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");

const Post = require("../models/post");
const User = require("../models/user");
const { getIo } = require("../middleware/websockets");

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const itemsPerPage = 2;
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate("creator")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage);

    res.status(200).json({ posts, totalItems });
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
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

  try {
    await post.save();
    const user = await User.findById(userId);
    user.posts.push(post);
    await user.save();

    getIo().emit("posts", {
      action: "create",
      post: { ...post._doc, creator: user },
    });

    res.status(201).json({
      message: "Post created successfully.",
      post: post,
      creator: user,
    });
  } catch (err) {
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId).populate("creator");

    if (!post) {
      const error = new Error("Post not found.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ post });
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
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

  try {
    const post = await Post.findById(postId).populate("creator");
    if (!post) {
      const error = new Error("Post not found.");
      error.statusCode = 404;
      throw error;
    }
    if (post.creator._id.toString() !== req.userId) {
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
    const savedPost = await post.save();

    getIo().emit("posts", { action: "update", post: savedPost });
    res.status(200).json({ post: savedPost });
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);
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
    await Post.findByIdAndRemove(postId);

    const user = await User.findById(req.userId);

    user.posts.pull(postId);
    await user.save();

    getIo().emit("posts", { action: "delete", post: postId });
    res.status(200).json({ deletedPost: postId });
  } catch (err) {
    next(err);
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
