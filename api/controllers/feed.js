const { validationResult } = require("express-validator");

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
  // Create post in DB

  res.status(201).json({
    message: "Post created successfully.",
    post: {
      _id: new Date().toISOString(),
      title,
      content,
      creator: {
        name: "Seb",
      },
      createdAt: new Date(),
    },
  });
};
