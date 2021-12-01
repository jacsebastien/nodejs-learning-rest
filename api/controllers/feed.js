const { validationResult } = require("express-validator");

const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: 1,
        title: "First Post",
        content: "This is the first post.",
        imageUrl: "images/tw3.png",
        creator: {
          name: "Seb",
        },
        createdAt: new Date(),
      },
    ],
  });
};

exports.postPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  const { title, content } = req.body;
  const post = new Post({ title, content, imageUrl: 'images/tw3.png', creator: { name: "Seb" } });

  post
    .save()
    .then(result => {
      res.status(201).json({
        message: "Post created successfully.",
        post: result,
      });
    })
    .catch((err) => console.log(err));
};
