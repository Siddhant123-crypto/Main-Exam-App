let express = require("express");
let router = express.Router();
let examController = require("../controllers/examController.js");
let { verifyToken, isAdmin } = require("../middleware/examauthMiddleware");

router.post("/add", verifyToken, isAdmin, examController.addExam);
router.get("/view", verifyToken, examController.getAllExams);
router.get("/schedule/:id", verifyToken, examController.getExamById);
router.put("/update/:id", verifyToken, isAdmin, examController.updateExam);
router.delete("/delete/:id", verifyToken, isAdmin, examController.deleteExam);
router.get("/search", verifyToken, examController.searchExamByDate);
router.put("/assign-schedule/:examId", verifyToken, isAdmin, examController.assignScheduleToExam);
router.post("/:examId/assign-subject", examController.assignSubjectToExam);
router.get("/:examId/subjects", verifyToken,  examController.getAssignedSubjects);
router.get("/stats", verifyToken, examController.getExamStats);
// Submit exam answers
router.get("/:examId/questions", verifyToken,examController.getExamQuestions)
router.post("/:examId/submit", verifyToken,examController. submitExam);


module.exports = router;
