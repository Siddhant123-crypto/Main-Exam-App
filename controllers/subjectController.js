let subjectModel = require("../models/subjectModel");
let db = require("../config/db");

// Create subject
let createSubject = (req, res) => {
  let { name, description } = req.body;

  if (!name) {
    res.status(400).json({ message: "Name is required" });
    return;
  }

  subjectModel.addSubject({ name, description })
    .then((id) => {
      res.status(201).json({ message: "Subject added successfully", subjectId: id });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// Get all subjects
let getAllSubject = (req, res) => {
  subjectModel.getAllSubjects()
    .then((rows) => res.json(rows))
    .catch((err) => res.status(500).json({ message: err.message }));
};

// Get subject by ID
let getSubjectById = (req, res) => {
  let id = req.params.id;

  subjectModel.getSubjectById(id)
    .then((subject) => {
      if (!subject) res.status(404).json({ message: "Subject not found" });
      else res.json(subject);
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

// Update subject
let updateSubject = (req, res) => {
  let id = req.params.id;
  let { name, description } = req.body;

  if (!name) {
    res.status(400).json({ message: "Name is required" });
    return;
  }

  subjectModel.updateSubject(id, { name, description })
    .then(() => {
      res.json({ message: "Subject updated successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// Delete subject
let deleteSubject = (req, res) => {
  let id = req.params.id;

  subjectModel.deleteSubject(id)
    .then(() => {
      res.json({ message: "Subject deleted successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// Search by name using raw query
let searchSubjectByName = (req, res) => {
  let { name } = req.query;
  if (!name) {
    res.status(400).json({ message: "Name query param is required" });
    return;
  }

  let sql = "SELECT * FROM subject WHERE name LIKE ?";
  db.query(sql, [`%${name}%`], (err, rows) => {
    if (err) res.status(500).json({ message: err.message });
    else res.json(rows);
  });
};

module.exports = {
  createSubject,
  getAllSubject,
  getSubjectById,
  updateSubject,
  deleteSubject,
  searchSubjectByName,
  
};
