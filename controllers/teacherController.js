const Teacher = require("../models/teacherModel");

// ✅ Add Teacher
exports.createTeacher = (req, res) => {
  Teacher.create(req.body)
    .then(() => res.status(201).json({ message: "Teacher added successfully" }))
    .catch((err) => res.status(500).json({ error: err.message }));
};

// ✅ Get all Teachers
exports.getAllTeachers = (req, res) => {
  Teacher.getAll()
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json({ error: err.message }));
};

// ✅ Get Teacher by ID
exports.getTeacherById = (req, res) => {
  Teacher.getById(req.params.id)
    .then((data) => {
      if (data) res.json(data);
      else res.status(404).json({ message: "Teacher not found" });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

// ✅ Update Teacher
exports.updateTeacher = (req, res) => {
  Teacher.update(req.params.id, req.body)
    .then(() => res.json({ message: "Teacher updated successfully" }))
    .catch((err) => res.status(500).json({ error: err.message }));
};

// ✅ Delete Teacher
exports.deleteTeacher = (req, res) => {
  Teacher.delete(req.params.id)
    .then(() => res.json({ message: "Teacher deleted successfully" }))
    .catch((err) => res.status(500).json({ error: err.message }));
};
