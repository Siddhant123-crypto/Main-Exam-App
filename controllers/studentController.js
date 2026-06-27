let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
let db = require("../config/db");
let Student = require("../models/studentModel"); 


// ✅ Register student
exports.register = (req, res) => {
  let { stud_name, stud_email, password, dob, mobile } = req.body;

  if (!stud_name || !stud_email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: "Error hashing password" });

    let sql = "INSERT INTO student (stud_name, stud_email, password, dob, mobile) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [stud_name, stud_email, hashedPassword, dob, mobile], (err, result) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ message: "Registration failed", error: err.sqlMessage });
      }
      res.json({ message: "Registered successfully", studentId: result.insertId });
    });
  });
};

// ✅ Login student
// ✅ Login student
exports.login = (req, res) => {
  let { stud_email, password } = req.body;

  db.query("SELECT * FROM student WHERE stud_email = ?", [stud_email], (err, results) => {
    if (err) return res.status(500).json({ message: "Login error" });
    if (results.length === 0) return res.status(401).json({ message: "User not found" });

    let student = results[0];

    // ✅ Compare password (bcrypt or plain fallback)
    bcrypt.compare(password, student.password, (err, match) => {
      if (match || password === student.password) {
        // ✅ Add role into token so isStudent works
        let token = jwt.sign(
          {
            sid: student.sid,
            email: student.stud_email,
            role: "student",   // 👈 added role
          },
          process.env.JWT_SECRET || "secretkey",
          { expiresIn: "24h" }
        );

        // ✅ Return sid + role for frontend usage
        return res.json({
          message: "Login successful",
          sid: student.sid,
          stud_name: student.stud_name,
          stud_email: student.stud_email,
          role: "student",
          token,
        });
      } else {
        return res.status(401).json({ message: "Invalid password" });
      }
    });
  });
};
// ✅ Get all students
exports.getAllStudents = (req, res) => {
  db.query("SELECT * FROM student", (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching students" });
    res.json(results);
  });
};

// ✅ Add new student (without JWT, just like register)
exports.addStudent = (req, res) => {
  Student.addStudent(req.body)
    .then((result) => {
      res
        .status(201)
        .json({ message: "Student added successfully", id: result.insertId });
    })
    .catch((err) => {
      console.error("Error adding student:", err);
      res.status(500).json({ error: "Database error" });
    });
};


// ✅ Get student by ID
exports.getStudentById = (req, res) => {
  const sid = req.params.id;

  Student.getStudentById(sid, (err, student) => {
    if (err) {
      res.status(500).json({ message: "Error fetching student" });
    } else if (!student) {
      res.status(404).json({ message: "Student not found" });
    } else {
      // remove password before sending
      delete student.password;
      res.json(student);
    }
  });
};

// ✅ Update student by ID
exports.updateStudent = (req, res) => {
  const sid = req.params.id;
  const data = req.body;

  // ✅ Fix DOB format if provided (MM/DD/YYYY → YYYY-MM-DD)
  if (data.dob) {
    let parts = data.dob.split("/");
    if (parts.length === 3) {
      data.dob = `${parts[2]}-${parts[0]}-${parts[1]}`;
    }
  }

  // ✅ Ensure role is always set (default = "student")
  if (!data.role) {
    data.role = "student";
  }

  Student.updateStudent(sid, data, (err, result) => {
    if (err) {
      res.status(500).json({ message: "Error updating student", error: err });
    } else {
      res.json({ message: "Student updated successfully" });
    }
  });
};

// ✅ Delete student
// controllers/studentController.js

exports.deleteStudent = (req, res) => {
  const { id } = req.params;

  // First, check if student exists
  db.query("SELECT * FROM student WHERE sid = ?", [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Delete student
    db.query("DELETE FROM student WHERE sid = ?", [id], (err2, result2) => {
      if (err2) {
        console.error(err2);
        // Check for foreign key constraint error
        if (err2.code === "ER_ROW_IS_REFERENCED_2") {
          return res.status(400).json({
            message: "Cannot delete student: related records exist",
          });
        }
        return res.status(500).json({ message: "Failed to delete student" });
      }

      res.json({ message: "Student deleted successfully" });
    });
  });
};

// ✅ Get logged-in student profile
// controllers/studentController.js
exports.getMyProfile = (req, res) => {
  const studentId = req.params.id; // must exist in route

  Student.getStudentById(studentId, (err, student) => {
    if (err) return res.status(500).json({ message: "Error fetching student" });
    if (!student) return res.status(404).json({ message: "Student not found" });

    delete student.password; // remove password
    res.json(student);
  });
};

