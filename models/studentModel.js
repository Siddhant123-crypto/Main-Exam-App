let db = require("../config/db");
let bcrypt = require("bcrypt");

let studentModel = {};

// ✅ Register Student
studentModel.register = (data) => {
  return new Promise((resolve, reject) => {
    const { stud_name, stud_email, password, dob, mobile } = data;

    if (!stud_name || !stud_email || !password) {
      return reject("Name, email, and password are required");
    }

    let checkQuery = "SELECT * FROM student WHERE stud_email = ?";
    db.query(checkQuery, [stud_email], (err, results) => {
      if (err) return reject("Error checking email: " + err.message);
      if (results.length > 0) return reject("Email already exists");

      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return reject("Error hashing password: " + err.message);

        let insertQuery =
          "INSERT INTO student(stud_name, stud_email, password, dob, mobile, role) VALUES (?, ?, ?, ?, ?, ?)";
        let values = [stud_name, stud_email, hashedPassword, dob || null, mobile || null, "student"];

        db.query(insertQuery, values, (err, result) => {
          if (err) return reject("Error inserting student: " + err.message);
          if (result.affectedRows > 0) resolve(result);
          else reject("Registration failed for unknown reason");
        });
      });
    });
  });
};

// ✅ Login Student
studentModel.login = (stud_email, password) => {
  return new Promise((resolve, reject) => {
    if (!stud_email || !password) {
      return reject("Email and password are required");
    }

    let query = "SELECT * FROM student WHERE stud_email = ?";
    db.query(query, [stud_email], (err, results) => {
      if (err) return reject("Error during login");
      if (results.length === 0) return reject("Student not found");

      let student = results[0];

      bcrypt.compare(password, student.password, (err, match) => {
        if (err) return reject("Error comparing password");
        if (!match) return reject("Invalid password");

        resolve(student);
      });
    });
  });
};

// ✅ Add new Student (Admin use)
studentModel.addStudent = (data) => {
  return new Promise((resolve, reject) => {
    if (!data.password) {
      return reject("Password is required");
    }

    bcrypt.hash(data.password, 10, (err, hashedPassword) => {
      if (err) {
        console.error("Hashing Error:", err);
        return reject("Error hashing password");
      }

      const sql =
        "INSERT INTO student (stud_name, stud_email, password, dob, mobile, role) VALUES (?, ?, ?, ?, ?, ?)";
      db.query(
        sql,
        [
          data.stud_name || null,
          data.stud_email || null,
          hashedPassword,
          data.dob || null,
          data.mobile || null,
          data.role || "student",
        ],
        (err, result) => {
          if (err) {
            console.error("SQL Error:", err);
            reject("Error inserting student: " + err.message);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
};

// ✅ Get Student by ID
studentModel.getStudentById = (sid, callback) => {
  db.query("SELECT * FROM student WHERE sid = ?", [sid], (err, results) => {
    if (err) {
      return callback(err, null);
    } else if (results.length === 0) {
      return callback(null, null);
    } else {
      return callback(null, results[0]);
    }
  });
};

// ✅ Update Student
studentModel.updateStudent = (sid, data, result) => {
  const role = data.role ? data.role : "student";

  db.query(
    "UPDATE student SET stud_name=?, stud_email=?, dob=?, mobile=?, role=? WHERE sid=?",
    [data.stud_name, data.stud_email, data.dob, data.mobile, role, sid],
    (err, res) => {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// ✅ Delete Student
studentModel.deleteStudent = (sid, result) => {
  db.query("DELETE FROM student WHERE sid=?", [sid], (err, res) => {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};
studentModel.getStudentById = (sid, callback) => {
  db.query("SELECT * FROM student WHERE sid = ?", [sid], (err, results) => {
    if (err) {
      return callback(err, null);
    } else if (results.length === 0) {
      return callback(null, null);
    } else {
      return callback(null, results[0]);
    }
  });
};

module.exports = studentModel;
