let assignmentModel = require("../models/assignmentModel");

exports.assignExam = function (req, res) {
    let { studentId, examId } = req.body;
    assignmentModel
        .assignExam(studentId, examId)
        .then(function (result) {
            res.status(200).json(result);
        })
        .catch(function (err) {
            res.status(400).json(err);
        });
};

exports.getAssignedExams = function (req, res) {
    let studentId = req.params.id;
    assignmentModel
        .getAssignedExams(studentId)
        .then(function (rows) {
            res.status(200).json(rows);
        })
        .catch(function (err) {
            res.status(400).json(err);
        });
};
