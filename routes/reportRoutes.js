const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

// Report by student
router.get("/student/:studentId", reportController.getByStudent);

// Report by student + exam
router.get("/student/:studentId/exam/:examId", reportController.getByStudentAndExam);

module.exports = router;
