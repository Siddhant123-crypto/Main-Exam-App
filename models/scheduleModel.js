let db = require("../config/db");

let validator = require("validator");

let Schedule = function (data) {
  this.id = data.id;
  this.title = data.title;
  this.exam_date = data.exam_date;
  this.start_time = data.start_time;
};

// Validation: all fields required
Schedule.validate = function (data) {
  let errors = [];

  if (!data.title || data.title.trim() === "") {
    errors.push("Title is required");
  }

  if (!data.exam_date || !validator.isDate(data.exam_date)) {
    errors.push("Valid exam date is required (YYYY-MM-DD)");
  }

  if (!data.start_time || data.start_time.trim() === "") {
    errors.push("Start time is required");
  }

  return errors;
};

// Check for duplicate schedule
Schedule.isDuplicate = function (title, exam_date) {
  return new Promise((resolve, reject) => {
    let query = "SELECT * FROM schedule WHERE title = ? AND exam_date = ?";
    db.query(query, [title, exam_date], (err, results) => {
      if (err) return reject(err);
      resolve(results.length > 0); // true if duplicate exists
    });
  });
};

// Create schedule
Schedule.create = function (data) {
  return new Promise((resolve, reject) => {
    let errors = Schedule.validate(data);
    if (errors.length > 0) {
      return reject({ type: "validation", errors });
    }

    Schedule.isDuplicate(data.title, data.exam_date)
      .then((isDup) => {
        if (isDup) {
          return reject({ type: "duplicate", message: "Schedule already exists for this course and date" });
        }

        let query = "INSERT INTO schedule (title, exam_date, start_time) VALUES (?, ?, ?)";
        db.query(query, [data.title, data.exam_date, data.start_time], (err, result) => {
          if (err) return reject(err);
          resolve({ id: result.insertId, ...data });
        });
      })
      .catch((err) => reject(err));
  });
};

module.exports = Schedule;


