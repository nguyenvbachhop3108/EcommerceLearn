const notFound = (req, res, next) => {
  const error = new Error(`Route not found!`);
  error.status = 404;
  next(error);
};

const errHandler = (error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "Error",
    code: statusCode,
    messate: error.message || "Internal Server Error",
  });
};

module.exports = { notFound, errHandler };
