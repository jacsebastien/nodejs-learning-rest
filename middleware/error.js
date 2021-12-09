module.exports = (error, req, res, next) => {
  console.log(error);
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const errors = error.errors || [];
  res.status(statusCode).json({ message, errors });
};
