let courseModel = require("../models/courseModel");
let db = require("../config/db");

// Create subject
let createCourse = (req, res) => {
  let { name, description } = req.body;

  if (!name) {
    res.status(400).json({ message: "Name is required" });
    return;
  }

  courseModel.addCourse({ name, description })
    .then((id) => {
      res.status(201).json({ message: "course added successfully", courseId: id });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// Get all subjects
let getAllCourses = (req, res) => {
  courseModel.getAllCourse()
    .then((rows) => res.json(rows))
    .catch((err) => res.status(500).json({ message: err.message }));
};

// Get subject by ID
let getCourseById = (req, res) => {
  let id = req.params.id;

  courseModel.getCourseById(id)
    .then((course) => {
      if (!course) res.status(404).json({ message: "course not found" });
      else res.json(course);
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

// Update subject
let updateCourse = (req, res) => {
  let id = req.params.id;
  let { name, description } = req.body;

  if (!name) {
    res.status(400).json({ message: "Name is required" });
    return;
  }

  courseModel.updateCourse(id, { name, description })
    .then(() => {
      res.json({ message: "course updated successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// Delete subject
let deleteCourse = (req, res) => {
  let id = req.params.id;

  courseModel.deleteCourse(id)
    .then(() => {
      res.json({ message: "course deleted successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// Search by name using raw query
let searchCourseByName = (req, res) => {
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

let getSubjectsByExamId = (req, res) => {
  let examId = req.params.examId;
  
  examModel.getSubjectsByExamId(examId)
    .then(subjects => {
      if (subjects.length > 0) {
        res.json(subjects);
      } else {
        res.status(404).json({ message: "No subjects found for this exam" });
      }
    })
    .catch(err => res.status(500).json({ message: err.message }));
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  searchCourseByName,
  getSubjectsByExamId,
};