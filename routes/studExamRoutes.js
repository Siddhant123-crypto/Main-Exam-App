const express = require("express");
const router = express.Router();
const studExamController = require("../controllers/studExamController");

// View all
router.get("/view", studExamController.getAllStudExams);

// Find by student & exam
router.get("/find", studExamController.findByStudentAndExam);

// Find by ID
router.get("/view/:id", studExamController.findById);

// Create
router.post("/add", studExamController.createStudExam);

// Update
router.put("/update/:id", studExamController.updateStudExam);

// Delete
router.delete("/delete/:id", studExamController.deleteStudExam);

// Search by ID
router.get("/search/:id", studExamController.searchStudExamById);

module.exports = router;
