let db = require("../config/db");

let submissionModel = {};

// Submit exam
let submitExam = function (studentId, examId, answers) {
    return new Promise(function (resolve, reject) {
        // 1. Get assignment_id
        db.query(
            "SELECT id FROM assignment WHERE student_id = ? AND exam_id = ?",
            [studentId, examId],
            function (err, rows) {
                if (err) return reject(err);
                if (rows.length === 0) return reject({ message: "Assignment not found" });

                let assignmentId = rows[0].id;

                // 2. Prepare values for batch insert
                let values = answers.map(ans => [assignmentId, ans.question_id, ans.answer]);

                // 3. Insert into submission
                db.query(
                    "INSERT INTO submission (assignment_id, question_id, selected_option) VALUES ?",
                    [values],
                    function (err2, result) {
                        if (err2) return reject(err2);
                        resolve({ message: "Submission successful", inserted: result.affectedRows });
                    }
                );
            }
        );
    });
};
let getExamResult = function (studentId, examId) {
  return new Promise(function (resolve, reject) {
    // Step 1: Get assignment id for student and exam
    const assignmentQuery = "SELECT id FROM assignment WHERE student_id = ? AND exam_id = ?";
    db.query(assignmentQuery, [studentId, examId], function (err, assignmentRows) {
      if (err) return reject(err);
      if (assignmentRows.length === 0) {
        return reject({ message: "No assignment found for this student and exam" });
      }
      const assignmentId = assignmentRows[0].id;

      // Step 2: Get submissions joined with questions
      const submissionQuery = `
        SELECT 
          s.question_id,
          q.question_text,
          s.selected_option,
          q.correct_option,
          q.marks,
          CASE WHEN s.selected_option = q.correct_option THEN q.marks ELSE 0 END AS marks_obtained
        FROM submission s
        JOIN question q ON s.question_id = q.id
        WHERE s.assignment_id = ?`;
      
      db.query(submissionQuery, [assignmentId], function (err, submissionRows) {
        if (err) return reject(err);
        if (submissionRows.length === 0) {
          return reject({ message: "No submissions found for this assignment" });
        }

        let totalMarks = 0;
        submissionRows.forEach(row => {
          totalMarks += row.marks_obtained;
        });

        resolve({
          assignmentId,
          studentId,
          examId,
          totalMarksObtained: totalMarks,
          detailedResults: submissionRows
        });
      });
    });
  });
};
module.exports = {
  submitExam,
  getExamResult
};
