const express = require("express");
const router = express.Router();
const takeExamController = require("../controllers/takeExamController"); // import full controller
const { verifyToken } = require("../middleware/examauthMiddleware");

// ✅ Fetch all questions for a specific exam
router.get("/:examId/questions", verifyToken, takeExamController.getQuestions);

// ✅ Submit exam answers
router.post("/:examId/submit", verifyToken, takeExamController.submitExam);

// ✅ Get student's past exam results
// ✅ Get student's past exam results
router.get("/results/:studentId", verifyToken, takeExamController.getStudentResults);

router.get("/result/download/:examId", verifyToken, takeExamController.downloadResultExcel);
module.exports = router;
