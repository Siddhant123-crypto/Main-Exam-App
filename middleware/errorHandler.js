// Not Found Route
let notFound = (req, res, next) => {
  res.status(404).send({ message: "route not found" });
};

// Global Error Handler
let errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Handle invalid ID format (e.g. non-numeric where number expected)
  if (err.kind === "ObjectId" || err.name === "CastError") {
    return res.status(400).send({ message: "invalid ID format" });
  }

  res.status(500).send({
    message: "internal server error",
    error: err.message || err,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
