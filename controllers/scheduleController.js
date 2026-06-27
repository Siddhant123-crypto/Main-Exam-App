let Schedule = require("../models/scheduleModel");
let db = require("../config/db");

// Create new schedule
let createSchedule = (req, res) => {
  let data = req.body;

  Schedule.create(data)
    .then((result) => {
      res.status(201).send({ message: "schedule created successfully", data: result });
    })
    .catch((err) => {
      if (err.type === "validation") {
        res.status(400).send({ message: "validation failed", errors: err.errors });
      } else if (err.type === "duplicate") {
        res.status(409).send({ message: err.message });
      } else {
        res.status(500).send({ message: "internal server error", error: err });
      }
    });
};

// Get all schedules
let getAllSchedules = (req, res) => {
  let query = "select * from schedule";
  db.query(query, (err, results) => {
    if (err) return res.status(500).send({ message: "database error", error: err });
    res.send(results);
  });
};

// Get schedule by ID
let getScheduleById = (req, res) => {
  let id = req.params.id;
  let query = "select * from schedule where id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send({ message: "database error", error: err });
    if (results.length === 0) return res.status(404).send({ message: "schedule not found" });
    res.send(results[0]);
  });
};

// Update schedule by ID
let updateSchedule = (req, res) => {
  let id = req.params.id;
  let data = req.body;

  let errors = Schedule.validate(data);
  if (errors.length > 0) {
    return res.status(400).send({ message: "validation failed", errors });
  }

  let checkQuery = "select * from schedule where title = ? and exam_date = ? and id != ?";
  db.query(checkQuery, [data.title, data.exam_date, id], (err, results) => {
    if (err) return res.status(500).send({ message: "database error", error: err });
    if (results.length > 0) return res.status(409).send({ message: "another schedule with same title and date exists" });

    let updateQuery = "update schedule set title = ?, exam_date = ?, start_time = ? where id = ?";
    db.query(updateQuery, [data.title, data.exam_date, data.start_time, id], (err, result) => {
      if (err) return res.status(500).send({ message: "update failed", error: err });
      res.send({ message: "schedule updated successfully" });
    });
  });
};

// Delete schedule by ID
let deleteSchedule = (req, res) => {
  let id = req.params.id;
  let query = "delete from schedule where id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).send({ message: "delete failed", error: err });
    if (result.affectedRows === 0) return res.status(404).send({ message: "schedule not found" });
    res.send({ message: "schedule deleted successfully" });
  });
};

// Search schedule by exam_date
let searchScheduleByDate = (req, res) => {
  let exam_date = req.query.exam_date;
  if (!exam_date) return res.status(400).send({ message: "exam_date is required" });

  let start = exam_date + " 00:00:00";
  let end = exam_date + " 23:59:59";

  let query = "SELECT * FROM schedule WHERE exam_date BETWEEN ? AND ?";
  db.query(query, [start, end], (err, results) => {
    if (err) return res.status(500).send({ message: "search failed", error: err });
    res.send(results);
  });
};

module.exports = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
  searchScheduleByDate,
};
