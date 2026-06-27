let db = require("../config/db");


let addQuestion = (data) => {
  return new Promise((resolve, reject) => {
    let sql = `
      INSERT INTO question 
      (exam_id, question_text, option_a, option_b, option_c, option_d, correct_option, marks)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
      sql,
      [
        data.exam_id,
        data.question_text,
        data.option_a,
        data.option_b,
        data.option_c,
        data.option_d,
        data.correct_option,
        data.marks,
      ],
      (err, result) => {
        if (err) reject(err);
        else resolve({ insertId: result.insertId, ...data });
      }
    );
  });
};


// Get all questions
let getAllQuestions = () => {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM questions";
    db.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Get question by ID
let getQuestionById = (id) => {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM questions WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) reject(err);
      else if (result.length === 0) reject({ message: "Question not found" });
      else resolve(result[0]);
    });
  });
};

// Update question
let updateQuestionById = (id, data) => {
  return new Promise((resolve, reject) => {
    if (!data.question || !data.option1 || !data.option2 || !data.option3 || !data.option4 || !data.answer) {
      reject({ message: "All fields are required" });
    } else {
      let sql = "UPDATE questions SET question=?, option1=?, option2=?, option3=?, option4=?, answer=? WHERE id=?";
      db.query(sql, [data.question, data.option1, data.option2, data.option3, data.option4, data.answer, id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    }
  });
};

// Delete question
let deleteQuestionById = (id) => {
  return new Promise((resolve, reject) => {
    let sql = "DELETE FROM questions WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Search question by name
let searchQuestionByName = (name) => {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM questions WHERE question LIKE ?";
    db.query(sql, [`%${name}%`], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

let assignQuestionToExam = (examId, questionIds) => {
  return new Promise((resolve, reject) => {
    if (!examId || !questionIds || questionIds.length === 0) {
      reject({ message: "examId and questionIds are required" });
      return;
    }

    let values = questionIds.map((qid) => [examId, qid]);
    let sql = "INSERT INTO exam_question (exam_id, question_id) VALUES ?";

    db.query(sql, [values], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};


let getQuestionsByExamId = (examId) => {
  return new Promise((resolve, reject) => {
    let sql = `
      SELECT DISTINCT q.id, q.question, q.option1, q.option2, q.option3, q.option4, q.answer
      FROM exam_question eq
      JOIN questions q ON eq.question_id = q.id
      WHERE eq.exam_id = ?
    `;
    db.query(sql, [examId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

let searchQuestionByExam = (examName) => {
  return new Promise((resolve, reject) => {
    if (!examName) {
      reject({ message: "Exam name is required" });
      return;
    }

    let sql = `
      select q.*
      FROM questions q
      JOIN exam_question eq ON q.id = eq.question_id
      JOIN exam e ON eq.exam_id = e.id
      WHERE e.title = ?
    `;

    db.query(sql, [examName], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
let searchQuestionByCourseName = (courseName) => {
    return new Promise((resolve, reject) => {
        let sql = `
            SELECT q.*
            FROM question q
            JOIN exam_question eq ON q.id = eq.question_id
            JOIN exam e ON eq.exam_id = e.id
            JOIN exam_subject es ON e.id = es.exam_id
            JOIN subject s ON es.subject_id = s.id
            JOIN course c ON s.course_id = c.id
            WHERE c.name LIKE ?
        `;
        db.query(sql, [`%${courseName}%`], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};


module.exports = {
  addQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestionById,
  deleteQuestionById,
  assignQuestionToExam,
  searchQuestionByName,
  getQuestionsByExamId,
  searchQuestionByExam,
  searchQuestionByCourseName,
};
