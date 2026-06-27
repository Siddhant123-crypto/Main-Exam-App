const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subjectController");
let { subjectNotFound } = require("../middleware/subjecterrorHandler.js");

router.post("/add", subjectController.createSubject);
router.get("/view", subjectController.getAllSubject);
router.get("/schedule/:id", subjectController.getSubjectById);
router.put("/update/:id", subjectController.updateSubject);
router.delete("/delete/:id", subjectController.deleteSubject);
router.get("/search", subjectController.searchSubjectByName);
router.use(subjectNotFound); // Apply here only

module.exports = router;
