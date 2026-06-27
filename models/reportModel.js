const db = require("../config/db");

const Report = {
  // Get report by student id
  getByStudentId: (studentId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT r.id, s.stud_name AS student_name, e.title AS exam_name,
               r.total_marks, r.marks_obtained,
               ROUND((r.marks_obtained / r.total_marks) * 100, 2) AS percentage,
               r.status
        FROM result r
        JOIN stud_exam se ON r.student_exam_id = se.id
        JOIN student s ON se.student_id = s.sid
        JOIN exam e ON se.exam_id = e.id
        WHERE s.sid = ?
        ORDER BY e.title, r.id
      `;
      db.query(sql, [studentId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  // Get report by student + exam
  getByStudentAndExam: (studentId, examId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT r.id, s.stud_name AS student_name, e.title AS exam_name,
               r.total_marks, r.marks_obtained,
               ROUND((r.marks_obtained / r.total_marks) * 100, 2) AS percentage,
               r.status
        FROM result r
        JOIN stud_exam se ON r.student_exam_id = se.id
        JOIN student s ON se.student_id = s.sid
        JOIN exam e ON se.exam_id = e.id
        WHERE s.sid = ? AND e.id = ?
        ORDER BY r.id
      `;
      db.query(sql, [studentId, examId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
};

module.exports = Report;
