const db = require("../config/db");

const StudExam = {
  // Get all stud_exam records
  getAll: () => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM stud_exam";
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  // Find record by student_id and exam_id
  findByStudentAndExam: (studentId, examId) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM stud_exam WHERE student_id = ? AND exam_id = ?";
      db.query(sql, [studentId, examId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  // Find by stud_exam id
  findById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM stud_exam WHERE id = ?";
      db.query(sql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  // Create new stud_exam
  create: (student_id, exam_id, status) => {
    return new Promise((resolve, reject) => {
      const sql = "INSERT INTO stud_exam (student_id, exam_id, status) VALUES (?, ?, ?)";
      db.query(sql, [student_id, exam_id, status], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  // Update stud_exam
  update: (id, student_id, exam_id, status) => {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE stud_exam SET student_id = ?, exam_id = ?, status = ? WHERE id = ?";
      db.query(sql, [student_id, exam_id, status, id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  // Delete stud_exam
  delete: (id) => {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM stud_exam WHERE id = ?";
      db.query(sql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  // Search stud_exam by ID
  searchById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM stud_exam WHERE id = ?";
      db.query(sql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },
};

module.exports = StudExam;
