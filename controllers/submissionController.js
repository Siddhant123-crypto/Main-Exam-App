let submissionModel = require("../models/submissionModel");

let submitExam = function (req, res) {
    let studentId = req.params.studentId;  // from URL
    let examId = req.params.examId;        // from URL
    let answers = req.body.answers;        // array of answers

    // Basic validation
    if (!studentId || !examId || !answers || !Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ message: "All fields are required" });
    }

    submissionModel.submitExam(studentId, examId, answers)
        .then(function (result) {
            res.status(200).json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        });
};


let getExamResult = function (req, res) {
  console.log("GET Exam Result called", req.params);
  const studentId = req.params.id;
  const examId = req.params.examId;

  submissionModel.getExamResult(studentId, examId)
    .then(result => {
      console.log("Result found:", result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.error("Error:", err);
      res.status(400).json(err);
    });
};

module.exports = {
  submitExam,
  getExamResult
};
