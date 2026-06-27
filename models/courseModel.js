const db = require("../config/db");

// Add new subject
let addCourse = (data) => {
  return new Promise((resolve, reject) => {
    let sql = "INSERT INTO course (name, description) VALUES (?, ?)";
    db.query(sql, [data.name, data.description], (err, result) => {
      if (err) reject(err);
      else resolve(result.insertId);
    });
  });
};

// Get all subjects
let getAllCourse = () => {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM course";
    db.query(sql, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Get subject by ID
let getCourseById = (id) => {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM course WHERE id = ?";
    db.query(sql, [id], (err, rows) => {
      if (err) reject(err);
      else resolve(rows[0]);
    });
  });
};

// Update subject
let updateCourse = (id, data) => {
  return new Promise((resolve, reject) => {
    let sql = "UPDATE course SET name = ?, description = ? WHERE id = ?";
    db.query(sql, [data.name, data.description, id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Delete subject
let deleteCourse = (id) => {
  return new Promise((resolve, reject) => {
    let sql = "DELETE FROM course WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

module.exports = {
  addCourse,
  getAllCourse,
  getCourseById,
  updateCourse,
  deleteCourse
};

