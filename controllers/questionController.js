let db = require("../config/db");
let questionsModel = require("../models/questionsModel");

let createQuestion = (req, res) => {
  let data = req.body;

  if (
    !data.exam_id ||
    !data.question_text ||
    !data.option_a ||
    !data.option_b ||
    !data.option_c ||
    !data.option_d ||
    !data.correct_option ||
    !data.marks
  ) {
    res.send({ message: "All fields are required" });
    return;
  }

  questionsModel
    .addQuestion(data)
    .then((result) => {
      res.send({ message: "Question added", data: result });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};// 2. Get all questions
let getAllQuestion = (req, res) => {
  let sql = "SELECT * FROM questions";
  db.query(sql, (err, result) => {
    if (err) res.send(err);
    else res.send(result);
  });
};

// 3. Get question by ID
let getQuestionById = (req, res) => {
  let id = req.params.id;
  let sql = "SELECT * FROM questions WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) res.send(err);
    else if (result.length === 0) res.send({ message: "Question not found" });
    else res.send(result[0]);
  });
};

// 4. Update question by ID
let updateQuestion = (req, res) => {
  let id = req.params.id;
  let data = req.body;

  if (!data.question || !data.option1 || !data.option2 || !data.option3 || !data.option4 || !data.answer) {
    res.send({ message: "All fields are required" });
    return;
  }

  let sql = "UPDATE questions SET question = ?, option1 = ?, option2 = ?, option3 = ?, option4 = ?, answer = ? WHERE id = ?";
  db.query(sql, [data.question, data.option1, data.option2, data.option3, data.option4, data.answer, id], (err, result) => {
    if (err) res.send(err);
    else res.send({ message: "Question updated", data: result });
  });
};

// 5. Delete question by ID
let deleteQuestion = (req, res) => {
  let id = req.params.id;
  let sql = "DELETE FROM questions WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) res.send(err);
    else res.send({ message: "Question deleted", data: result });
  });
};

let assignQuestionToExamController = (req, res) => {
  let { examId, questionIds } = req.body;

  questionModel.assignQuestionToExam(examId, questionIds)
    .then((result) => {
      res.send({ message: "Questions assigned to exam successfully", result });
    })
    .catch((err) => {
      res.status(400).send({ error: err.message || err });
    });
};


// 6. Search question by text
let searchQuestionByName = (req, res) => {
  let name = req.query.name; // ✅ FIX: use req.query instead of req.params

  if (!name) {
    res.status(400).send({ message: "Search keyword is required" });
    return;
  }

  let sql = "SELECT * FROM questions WHERE question LIKE ?";
  db.query(sql, [`%${name}%`], (err, result) => {
    if (err) res.status(500).send(err);
    else res.send(result);
  });
};
let getQuestionsByExamId = (req, res) => {
  let examId = req.params.examId;

  questionModel
    .getQuestionsByExamId(examId)
    .then((questions) => {
      if (questions.length === 0) {
        res.status(404).json({ message: "No questions assigned to this exam" });
      } else {
        res.json(questions);
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

let searchQuestionByExam = (req, res) => {
  let examName = req.params.name;

  questionModel
    .searchQuestionByExam(examName)
    .then((questions) => {
      if (questions.length === 0) {
        res.status(404).send({ message: "No questions found for this exam" });
      } else {
        res.send(questions);
      }
    })
    .catch((err) => {
      res.status(400).send({ message: err.message || err });
    });
};
let searchQuestionByCourseName = (req, res) => {
    let courseName = req.query.name;

    if (!courseName) {
        res.status(400).json({ message: "Course name is required" });
    } else {
        questionModel.searchQuestionByCourseName(courseName)
            .then((questions) => {
                if (questions.length > 0) {
                    res.status(200).json(questions);
                } else {
                    res.status(404).json({ message: "No questions found for the given course" });
                }
            })
            .catch((err) => {
                res.status(500).json({ message: err.message });
            });
    }
};


module.exports = {
  createQuestion,
  getAllQuestion,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  searchQuestionByName,
  getQuestionsByExamId ,
  assignQuestionToExamController,
  searchQuestionByExam,
  searchQuestionByCourseName,

};
