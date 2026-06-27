const db = require("../config/db");

// Add new subject
let addSubject = (data) => {
  return new Promise((resolve, reject) => {
    let sql = "INSERT INTO subject (name, description) VALUES (?, ?)";
    db.query(sql, [data.name, data.description], (err, result) => {
      if (err) reject(err);
      else resolve(result.insertId);
    });
  });
};

// Get all subjects
let getAllSubjects = () => {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM subject";
    db.query(sql, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Get subject by ID
let getSubjectById = (id) => {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM subject WHERE id = ?";
    db.query(sql, [id], (err, rows) => {
      if (err) reject(err);
      else resolve(rows[0]);
    });
  });
};

// Update subject
let updateSubject = (id, data) => {
  return new Promise((resolve, reject) => {
    let sql = "UPDATE subject SET name = ?, description = ? WHERE id = ?";
    db.query(sql, [data.name, data.description, id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Delete subject
let deleteSubject = (id) => {
  return new Promise((resolve, reject) => {
    let sql = "DELETE FROM subject WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

module.exports = {
  addSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  
};

