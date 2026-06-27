let examNotFound = (req, res, next) => {
  res.status(404).json({ message: "Route not found" });
};

let invalidIdHandler = (err, req, res, next) => {
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  next(err);
};

let generalErrorHandler = (err, req, res, next) => {
  res.status(500).json({ message: err.message || "Internal server error" });
};

module.exports = {
  examNotFound,
  invalidIdHandler,
  generalErrorHandler,
};
