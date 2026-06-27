const takeExamModel = require("../models/takeExamModel");
const ExcelJS = require("exceljs");
// 1️⃣ Get all questions for a specific exam
let getQuestions = (req, res) => {
  const examId = req.params.examId;

  if (!examId) {
    return res.status(400).json({ message: "Exam ID is required" });
  }

  takeExamModel.getExamQuestions(examId)
  .then(results => {
    const questions = results.map(q => ({
      qid: q.id,
      question: q.question_text,
      optionA: q.option_a,
      optionB: q.option_b,
      optionC: q.option_c,
      optionD: q.option_d,
      marks: q.marks
    }));
    res.status(200).json(questions);
  })

    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch questions", error: err.message });
    });
};

// Submit exam answers
// controllers/takeExamController.js
const submitExam = (req, res) => {
  const examId = req.params.examId;
  const studentId = req.user.sid;
  const answers = req.body.answers;

  if (!examId || !studentId || !answers || answers.length === 0) {
    return res.status(400).json({ message: "Exam ID, student ID, and answers are required" });
  }

  takeExamModel.submitExamAnswers(studentId, examId, answers)
    .then(result => {
      // ✅ Wrap in `result` key for frontend
      res.status(200).json({
        message: "Exam submitted successfully",
        result: result // this will include totalMarks, obtainedMarks, percentage, status
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Failed to submit exam", error: err.message });
    });
};

// Get student results
const getStudentResults = (req, res) => {
  const studentId = req.params.studentId || req.user.sid;

  takeExamModel.getStudentResults(studentId)
    .then(results => {
      res.status(200).json({
        studentId,
        results
      });
    })
    .catch(err => {
      console.error("Get Student Results Error:", err);
      res.status(500).json({
        message: "Failed to fetch results",
        error: err.message
      });
    });
};





const downloadResultExcel = (req, res) => {
  const examId = req.params.examId;
  const studentId = req.user.sid; // from auth middleware

  takeExamModel.getStudentExamResult(studentId, examId)
    .then(result => {
      if (!result) return res.status(404).json({ message: "Result not found" });

      // Create workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Exam Result");

      // Add headers
      worksheet.columns = [
        { header: "Question ID", key: "qid", width: 15 },
        { header: "Question", key: "question", width: 50 },
        { header: "Selected Option", key: "selected", width: 20 },
        { header: "Correct Option", key: "correct", width: 20 },
        { header: "Marks Obtained", key: "marks", width: 15 }
      ];

      // Add rows
      result.answers.forEach(a => {
        worksheet.addRow({
          qid: a.qid,
          question: a.question_text,
          selected: a.selectedOption,
          correct: a.correct_option,
          marks: a.marks_obtained
        });
      });

      // Add summary row
      worksheet.addRow({});
      worksheet.addRow({
        qid: "Total",
        marks: result.totalMarks
      });
      worksheet.addRow({
        qid: "Obtained",
        marks: result.obtainedMarks
      });
      worksheet.addRow({
        qid: "Percentage",
        marks: result.percentage
      });
      worksheet.addRow({
        qid: "Status",
        marks: result.status
      });

      // Set response headers
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=exam_result_${examId}.xlsx`
      );

      // Write to response
      workbook.xlsx.write(res).then(() => res.end());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Failed to generate Excel", error: err.message });
    });
};








module.exports = {
  getQuestions,
  submitExam,
  getStudentResults,
  downloadResultExcel  
};
