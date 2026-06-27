const Result = require("../models/resultModel");

// Add result
exports.createResult = (req, res) => {
  Result.create(req.body)
    .then((data) => res.status(201).json(data))
    .catch((err) => res.status(400).json({ message: "Failed to create result", error: err.message }));
};

// Get all results
exports.getAllResults = (req, res) => {
  Result.getAll()
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json({ message: "Failed to fetch results", error: err.message }));
};

// Get result by ID
exports.getResultById = (req, res) => {
  Result.getById(req.params.id)
    .then((data) => (data ? res.json(data) : res.status(404).json({ message: "Result not found" })))
    .catch((err) => res.status(500).json({ message: "Failed to fetch result", error: err.message }));
};

// Update result by ID
exports.updateResult = (req, res) => {
  Result.update(req.params.id, req.body)
    .then((data) => res.json({ message: "Result updated successfully", data }))
    .catch((err) => res.status(400).json({ message: "Failed to update result", error: err.message }));
};

// Delete result by ID
exports.deleteResult = (req, res) => {
  Result.delete(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json({ message: "Failed to delete result", error: err.message }));
};


// Optional: Get results for a specific student (if you have auth)
exports.getMyResults = (req, res) => {
  const studentId = req.user?.id; // assumes auth middleware sets req.user
  if (!studentId) return res.status(400).json({ message: "Student ID not found" });

  const sql = `
    SELECT r.id AS result_id,
           e.title AS exam_name,
           r.total_marks,
           r.marks_obtained,
           r.percentage,
           r.status
    FROM result r
    JOIN stud_exam se ON r.student_exam_id = se.id
    JOIN exam e ON se.exam_id = e.id
    WHERE se.student_id = ?
  `;
  db.query(sql, [studentId], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching results", error: err });
    res.json(results);
  });
};
