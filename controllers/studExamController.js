const StudExam = require("../models/studExamModel");

// ✅ Get all stud_exam records
exports.getAllStudExams = (req, res) => {
  StudExam.getAll()
    .then((results) => res.json(results))
    .catch((err) => res.status(500).json({ error: err.message }));
};

// ✅ Find stud_exam by student_id and exam_id
exports.findByStudentAndExam = (req, res) => {
  const { studentId, examId } = req.query;
  if (!studentId || !examId) {
    return res.status(400).json({ message: "studentId and examId are required" });
  }

  StudExam.findByStudentAndExam(studentId, examId)
    .then((results) => {
      if (results.length === 0) {
        return res.status(404).json({ message: "No record found" });
      }
      res.json(results[0]);
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

// ✅ Find stud_exam by ID
exports.findById = (req, res) => {
  const id = req.params.id;
  StudExam.findById(id)
    .then((results) => {
      if (results.length === 0) return res.status(404).json({ message: "Record not found" });
      res.json(results[0]);
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

// ✅ Create new stud_exam
exports.createStudExam = (req, res) => {
  const { student_id, exam_id, status } = req.body;
  if (!student_id || !exam_id) {
    return res.status(400).json({ message: "student_id and exam_id are required" });
  }

  StudExam.create(student_id, exam_id, status || "ongoing")
    .then((result) => res.status(201).json({ id: result.insertId, student_id, exam_id, status: status || "ongoing" }))
    .catch((err) => res.status(500).json({ error: err.message }));
};

// ✅ Update stud_exam
exports.updateStudExam = (req, res) => {
  const id = req.params.id;
  const { student_id, exam_id, status } = req.body;
  if (!student_id || !exam_id) {
    return res.status(400).json({ message: "student_id and exam_id are required" });
  }

  StudExam.update(id, student_id, exam_id, status || "ongoing")
    .then(() => res.json({ message: "Record updated successfully" }))
    .catch((err) => res.status(500).json({ error: err.message }));
};

// ✅ Delete stud_exam
exports.deleteStudExam = (req, res) => {
  const id = req.params.id;

  StudExam.delete(id)
    .then(() => res.json({ message: "Record deleted successfully" }))
    .catch((err) => res.status(500).json({ error: err.message }));
};

// ✅ Search stud_exam by ID
exports.searchStudExamById = (req, res) => {
  const id = req.params.id;

  StudExam.searchById(id)
    .then((results) => {
      if (results.length === 0) return res.status(404).json({ message: "No record found" });
      res.json(results[0]);
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};
