require("dotenv").config();
let express = require("express");
let path = require("path");
let cors = require("cors");
let app = express();


let student_routes = require("./routes/studentRoutes");
let schedule_routes = require("./routes/scheduleRoutes");
let exam_routes = require("./routes/examRoutes");
let subjectRoutes = require("./routes/subjectRoutes");
let courseRoutes = require("./routes/courseRoutes");
let questionRoutes = require("./routes/questionRoutes");
let assingsubmissionRoutes = require("./routes/assingsubmissionRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const resultRoutes = require("./routes/resultRoutes");
const studExamRoutes = require("./routes/studExamRoutes");
const reportRoutes = require("./routes/reportRoutes");
const settingRoutes = require("./routes/settingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const takeExamRoutes = require("./routes/takeExamRoutes");






let { subjectNotFound } = require("./middleware/subjecterrorHandler");
let {
  examNotFound,
  invalidIdHandler: examInvalidIdHandler,
  generalErrorHandler: examGeneralErrorHandler,
} = require("./middleware/examerrorHandler");

let {
  questionNotFound,
  invalidIdHandler: questionInvalidIdHandler,
  generalErrorHandler: questionGeneralErrorHandler,
} = require("./middleware/questionerrorHandler");

let {
  courseNotFound,
  invalidCourseIdHandler,
  generalCourseErrorHandler,
} = require("./middleware/courseerrorHandler");

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

// Routes
app.use("/student", student_routes);
app.use("/schedule", schedule_routes);
app.use("/api/exam", exam_routes);
app.use("/api/subject", subjectRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/assign-submission", assingsubmissionRoutes);
app.use("/teacher", teacherRoutes);
app.use("/admin", require("./routes/adminRoutes"));
app.use("/api/result", resultRoutes);
app.use("/api/stud_exam", studExamRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/setting", settingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/exam", takeExamRoutes);

// ✅ Serve React build
app.use(express.static(path.join(__dirname, "../frontend/frontend/dist")));

// ✅ Serve React frontend for non-API routes only
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/frontend/dist", "index.html"));
});



// Not Found Handlers
app.use(subjectNotFound);
app.use(examNotFound);
app.use(questionNotFound);
app.use(courseNotFound);

// Invalid ID Handlers
app.use(examInvalidIdHandler);
app.use(questionInvalidIdHandler);
app.use(invalidCourseIdHandler);

// General Error Handlers
app.use(examGeneralErrorHandler);
app.use(questionGeneralErrorHandler);
app.use(generalCourseErrorHandler);

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is running on port", port);
});
