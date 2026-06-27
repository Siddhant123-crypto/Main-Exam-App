// routes/studentRoutes.js
let express = require("express");
let router = express.Router();
let student = require("../controllers/studentController");

// Register & Login
router.post("/register", student.register);
router.post("/login", student.login);

// Student CRUD
router.get("/", student.getAllStudents);      // GET /student
router.post("/", student.addStudent);         // POST /student
router.get("/:id", student.getStudentById);   // GET /student/:id
router.put("/:id", student.updateStudent);    // PUT /student/:id
router.delete("/:id", student.deleteStudent); // DELETE /student/:id
router.get("/my-profile/:id", student.getMyProfile);



module.exports = router;
