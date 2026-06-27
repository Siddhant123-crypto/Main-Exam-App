function subjectNotFound(req, res, next) {
  res.status(404).json({ message: "Subject not found" });
}

function invalidIdHandler(err, req, res, next) {
  if (err.name === "CastError" || err.message.includes("invalid id")) {
    res.status(400).json({ message: "Invalid ID format" });
  } else {
    next(err);
  }
}

function generalErrorHandler(err, req, res, next) {
  res.status(500).json({ message: "Internal Server Error", error: err.message });
}

module.exports = {
  subjectNotFound,
  invalidIdHandler,
  generalErrorHandler,
};
