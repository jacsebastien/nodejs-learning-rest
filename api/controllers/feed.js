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
  const { title, content } = req.body;

  // Create post in DB

  res.status(201).json({
    message: "Post created successfully.",
    post: {
      id: new Date().toISOString(),
      title,
      content,
    },
  });
};
