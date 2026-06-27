let express = require("express");
let router = express.Router();

let {
  createQuestion,
  getAllQuestion,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  searchQuestionByName,
  getQuestionsByExamId,
  assignQuestionToExamController,
  searchQuestionByExam,
  searchQuestionByCourseName
} = require("../controllers/questionController");

let { verifyToken, isAdmin } = require("../middleware/questionauthMiddleware");

router.post("/add", verifyToken, isAdmin, createQuestion);
router.get("/view", verifyToken, getAllQuestion);
router.get("/schedule/:id", verifyToken, getQuestionById);
router.put("/update/:id", verifyToken, isAdmin, updateQuestion);
router.delete("/delete/:id", verifyToken, isAdmin, deleteQuestion);
router.get("/search", verifyToken, searchQuestionByName);
router.get("/questions/:examId", verifyToken, getQuestionsByExamId);
router.post("/assign-question", verifyToken, isAdmin, assignQuestionToExamController);
router.get("/by-exam/:name", verifyToken, searchQuestionByExam);
router.get("/search-by-course",searchQuestionByCourseName);

module.exports = router;
