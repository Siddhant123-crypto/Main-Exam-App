const examModel = require("../models/examModel");
const db = require("../config/db");
const ExcelJS = require("exceljs");
let addExam = (req, res) => {
  let { title, description, date, start_time, end_time, duration } = req.body;

  console.log("Request Body:", req.body); 

  if (!title || !date || !start_time) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  let sql = "INSERT INTO exam (title, description, date, start_time, end_time, duration) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [title, description, date, start_time, end_time, duration], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    res.status(201).json({
      message: "Exam added successfully",
      examId: result.insertId,
      insertedData: {
        title,
        description,
        date,
        start_time,
        end_time,
        duration
      }
    });
  });
};


let getExamById = (req, res) => {
  let id = req.params.id;

  examModel.getExamById(id)
    .then((result) => {
      if (result.length === 0) {
        res.status(404).json({ message: "Exam not found" });
      } else {
        res.status(200).json(result[0]);
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Database error", error: err.message });
    });
};


let getAllExams = (req, res) => {
  examModel.getAllExams()
    .then((exams) => {
      res.status(200).json(exams);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Database error",
        error: err.message
      });
    });
};

let updateExam = (req, res) => {
  let examId = req.params.id;
  let { title, description, date, start_time, end_time, duration, created_by } = req.body;

  console.log('Updating exam:', examId, req.body);

  if (!title || !date) {
    return res.status(400).send({ error: "Title and Date are required" });
  }

  examModel.updateExam(examId, { title, description, date, start_time, end_time, duration, created_by })
    .then(() => res.send({ message: "Exam updated successfully" }))
    .catch(err => {
      console.error('Error updating exam:', err);
      res.status(500).send({ error: err.message || err });
    });
};




let deleteExam = (req, res) => {
  let examId = parseInt(req.params.id); 

  if (!examId || isNaN(examId)) {
    res.status(400).send({ message: "Valid exam ID is required" });
    return;
  }

  examModel
    .deleteExam(examId)
    .then(() => res.send({ message: "Exam deleted successfully" }))
    .catch((err) => res.status(500).send({ error: err.message }));
};

let assignScheduleToExam = (req, res) => {
  let examId = req.params.examId;
  let { schedule_id } = req.body;

  if (!schedule_id) {
    res.status(400).json({ message: "Schedule ID is required" });
    return;
  }

  let query = "UPDATE exam SET schedule_id = ? WHERE id = ?";
  db.query(query, [schedule_id, examId], (err, result) => {
    if (err) {
      res.status(500).json({ message: err.message || "Failed to assign schedule" });
    } else {
      res.json({ message: "Schedule assigned to exam successfully" });
    }
  });
};

let assignQuestionToExam = (req, res) => {
  let { exam_id, question_ids } = req.body;

  if (!exam_id || !Array.isArray(question_ids) || question_ids.length === 0) {
    res.status(400).json({ message: "exam_id and question_ids (array) are required" });
    return;
  }

  examModel
    .assignQuestionsToExam(exam_id, question_ids)
    .then(() => {
      res.json({ message: "Questions assigned to exam successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};



// Search exam by date
let searchExamByDate = (req, res) => {
  let { date } = req.query;
  if (!date) {
    res.status(400).json({ message: "Date query param is required" });
    return;
  }

  let sql = "SELECT * FROM exam WHERE date = ?";
  db.query(sql, [date], (err, rows) => {
    if (err) {
      res.status(500).json({ message: "Search failed", error: err.message });
    } else {
      res.json(rows);
    }
  });
};

let assignSubjectToExam = (req, res) => {
    let examId = req.params.examId;
    let subjectId = req.body.id; // from your JSON

    if (!subjectId) {
        return res.status(400).json({ message: "Subject ID is required" });
    }

    examModel.assignSubject(examId, subjectId)
        .then(result => res.json(result))
        .catch(err => res.status(500).json({ message: err.message || "Database error" }));
};
const getAssignedSubjects = (req, res) => {
  const examId = req.params.examId;

  if (!examId) {
    return res.status(400).json({ message: "Exam ID is required in URL" });
  }

  examModel.getAssignedSubjects(examId)
    .then((subjects) => {
      if (!subjects || subjects.length === 0) {
        return res.status(404).json({ message: "No subjects assigned to this exam" });
      }
      res.status(200).json(subjects);
    })
    .catch((err) => {
      console.error("[examController.getAssignedSubjects] err:", err);
      res.status(500).json({ message: "Database error", error: err.message || err });
    });
};



let getExamStats = (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) AS total,
      COALESCE(SUM(CASE WHEN date > NOW() THEN 1 ELSE 0 END), 0) AS upcoming,
      COALESCE(SUM(CASE WHEN DATE(date) = CURDATE() THEN 1 ELSE 0 END), 0) AS active,
      COALESCE(SUM(CASE WHEN date < NOW() THEN 1 ELSE 0 END), 0) AS completed
    FROM exam
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching exam stats", error: err.message });
    }

    const row = result[0] || {};
    res.json({
      total: Number(row.total) || 0,
      upcoming: Number(row.upcoming) || 0,
      active: Number(row.active) || 0,
      completed: Number(row.completed) || 0,
    });
  });
};


// Get questions for exam


let getExamQuestions = (req, res) => {
  const { examId } = req.params;

  examModel
    .getExamQuestions(examId) // pass number, not object
    .then((questions) => {
      res.json(questions);
    })
    .catch((err) => {
      console.error("Error fetching questions:", err);
      res.status(500).json({ message: "Error fetching questions", error: err });
    });
};

// Submit exam answers
let submitExam = (req, res) => {
  const { examId } = req.params;
  const { answers } = req.body; // answers = { "1": "A", "2": "B" }

  examModel
    .getExamQuestions(examId)
    .then((questions) => {
      let totalMarks = 0;
      let obtainedMarks = 0;

      questions.forEach((q) => {
        totalMarks += q.marks || 1; // use marks column, default 1 if null

        // compare student’s answer with correct_option
        if (answers[q.id] && answers[q.id] === q.correct_option) {
          obtainedMarks += q.marks || 1;
        }
      });

      const percentage = ((obtainedMarks / totalMarks) * 100).toFixed(2);
      const status = percentage >= 40 ? "Pass" : "Fail";

      res.json({
        totalMarks,
        obtainedMarks,
        percentage,
        status,
      });
    })
    .catch((err) => {
      console.error("Submit Exam Error:", err);
      res.status(500).json({ message: "Error submitting exam", error: err });
    });
};

module.exports = {
    addExam,
    getAllExams,
    getExamById,
    updateExam,
    deleteExam,
    searchExamByDate,
    assignScheduleToExam,
    assignSubjectToExam,
    getAssignedSubjects,
    assignQuestionToExam,
    getExamStats,
    getExamQuestions,
    submitExam,

};


