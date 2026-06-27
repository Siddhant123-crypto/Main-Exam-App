const express = require("express");
const router = express.Router();
const {
  searchCourseByName,
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} = require("../controllers/courseController");

const { verifyToken, isCourseAdmin } = require("../middleware/courseauthMiddleware");
const { courseNotFound } = require("../middleware/courseerrorHandler");

// Public route
router.get("/search", searchCourseByName);

// Protected routes
router.post("/add", verifyToken, isCourseAdmin, createCourse);
router.get("/view", verifyToken, getAllCourses);
router.get("/:id", verifyToken, getCourseById);
router.put("/update/:id", verifyToken, isCourseAdmin, updateCourse);
router.delete("/delete/:id", verifyToken, isCourseAdmin, deleteCourse);

// Error handling
router.use(courseNotFound);

module.exports = router;