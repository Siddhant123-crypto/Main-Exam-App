let courseNotFound = (req, res, next) => {
  res.status(404).json({ message: "Course route not found" });
};
let invalidCourseIdHandler = (err, req, res, next) => {
  if (err.name === "CastError") {
    res.status(400).json({ message: "Invalid Course ID" });
  } else {
    next(err);
  }
};
let generalCourseErrorHandler = (err, req, res, next) => {
  res.status(500).json({ message: "Something went wrong", error: err.message });
};
module.exports = {
  courseNotFound,
  invalidCourseIdHandler,
  generalCourseErrorHandler,
};
