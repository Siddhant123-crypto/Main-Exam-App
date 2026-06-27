let express = require("express");
let router = express.Router();

let assignmentController = require("../controllers/assignmentController");
let submissionController = require("../controllers/submissionController");
let { verifyToken, isAdmin, isStudent } = require("../middleware/ASauthMiddleware");

router.post("/exams/assign", verifyToken, isAdmin, assignmentController.assignExam);
router.get("/student/:id/assigned-exams", verifyToken, isStudent, assignmentController.getAssignedExams);
router.post("/student/:studentId/exams/:examId/submit", submissionController.submitExam);
router.get("/student/:id/exams/:examId/result", submissionController.getExamResult);


module.exports = router;
