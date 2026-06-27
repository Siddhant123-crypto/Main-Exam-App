const Report = require("../models/reportModel");

const reportController = {
  getByStudent: (req, res) => {
    const studentId = req.params.studentId;
    Report.getByStudentId(studentId)
      .then((data) => res.json(data))
      .catch((err) => res.status(500).json({ error: err.message }));
  },

  getByStudentAndExam: (req, res) => {
    const studentId = req.params.studentId;
    const examId = req.params.examId;
    Report.getByStudentAndExam(studentId, examId)
      .then((data) => res.json(data))
      .catch((err) => res.status(500).json({ error: err.message }));
  }
};

module.exports = reportController;
