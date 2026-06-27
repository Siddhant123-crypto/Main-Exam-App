let db = require("../config/db");

let assignmentModel = {};

// Assign exam to a student
assignmentModel.assignExam = function (studentId, examId) {
    return new Promise(function (resolve, reject) {
        if (!studentId || !examId) {
            return reject({ message: "studentId and examId are required" });
        }
        db.query(
            "SELECT * FROM assignment WHERE student_id = ? AND exam_id = ?",
            [studentId, examId],
            function (err, rows) {
                if (err) return reject(err);
                if (rows.length > 0) {
                    return reject({ message: "Exam already assigned" });
                }
                db.query(
                    "INSERT INTO assignment (student_id, exam_id) VALUES (?, ?)",
                    [studentId, examId],
                    function (err2, result) {
                        if (err2) return reject(err2);
                        resolve({ message: "Exam assigned successfully" });
                    }
                );
            }
        );
    });
};

// Get exams assigned to a student
assignmentModel.getAssignedExams = function (studentId) {
    return new Promise(function (resolve, reject) {
        db.query(
            "SELECT * FROM assignment WHERE student_id = ?",
            [studentId],
            function (err, rows) {
                if (err) return reject(err);
                resolve(rows);
            }
        );
    });
};

module.exports = assignmentModel;
