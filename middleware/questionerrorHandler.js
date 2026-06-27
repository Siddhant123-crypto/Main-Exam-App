// 1. Handle unmatched routes (404)
let questionNotFound = (req, res, next) => {
  res.status(404).send({ message: "Route not found" });
};

// 2. Handle invalid ID format (e.g., non-numeric)
let invalidIdHandler = (err, req, res, next) => {
  if (
    err.code === "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD" || // MySQL field format error
    err.code === "ER_BAD_FIELD_ERROR" ||                 // Bad field in query
    err.message === "Invalid ID format"
  ) {
    res.status(400).send({ message: "Invalid ID format" });
  } else {
    next(err); // pass to next handler
  }
};

// 3. General internal server error (500)
let generalErrorHandler = (err, req, res, next) => {
  res.status(500).send({
    message: "Internal Server Error",
    error: err.message || err,
  });
};

module.exports = {
  questionNotFound,
  invalidIdHandler,
  generalErrorHandler,
};
