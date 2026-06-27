const db = require("../config/db");

const Result = {
  // Create result using student_exam_id
  create: ({ student_exam_id, total_marks, marks_obtained }) => {
    return new Promise((resolve, reject) => {
      if (!student_exam_id || !total_marks || !marks_obtained) {
        return reject(new Error("All fields are required"));
      }

      const percentage = ((marks_obtained / total_marks) * 100).toFixed(2);
      const status = percentage >= 40 ? "pass" : "fail";

      const sql = `
        INSERT INTO result (student_exam_id, total_marks, marks_obtained, percentage, status)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(sql, [student_exam_id, total_marks, marks_obtained, percentage, status], (err, res) => {
        if (err) return reject(err);
        resolve({
          id: res.insertId,
          student_exam_id,
          total_marks,
          marks_obtained,
          percentage,
          status,
        });
      });
    });
  },

  getAll: () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT r.id, r.total_marks, r.marks_obtained, r.percentage, r.status,
               s.stud_name AS student_name, e.title AS exam_name
        FROM result r
        JOIN stud_exam se ON r.student_exam_id = se.id
        JOIN student s ON se.student_id = s.sid
        JOIN exam e ON se.exam_id = e.id
      `;
      db.query(sql, (err, res) => (err ? reject(err) : resolve(res)));
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT r.id, r.total_marks, r.marks_obtained, r.percentage, r.status,
               s.stud_name AS student_name, e.title AS exam_name
        FROM result r
        JOIN stud_exam se ON r.student_exam_id = se.id
        JOIN student s ON se.student_id = s.sid
        JOIN exam e ON se.exam_id = e.id
        WHERE r.id = ?
      `;
      db.query(sql, [id], (err, res) => (err ? reject(err) : resolve(res[0])));
    });
  },

  update: (id, { total_marks, marks_obtained }) => {
    return new Promise((resolve, reject) => {
      if (!total_marks || !marks_obtained) {
        return reject(new Error("Total marks and obtained marks are required"));
      }

      const percentage = ((marks_obtained / total_marks) * 100).toFixed(2);
      const status = percentage >= 40 ? "pass" : "fail";

      const sql = `
        UPDATE result
        SET total_marks = ?, marks_obtained = ?, percentage = ?, status = ?
        WHERE id = ?
      `;
      db.query(sql, [total_marks, marks_obtained, percentage, status, id], (err, res) => {
        if (err) return reject(err);
        resolve({ id, total_marks, marks_obtained, percentage, status });
      });
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.query("DELETE FROM result WHERE id = ?", [id], (err, res) => {
        if (err) return reject(err);
        resolve({ message: "Result deleted successfully", affectedRows: res.affectedRows });
      });
    });
  },
};

module.exports = Result;
