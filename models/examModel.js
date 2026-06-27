const db = require("../config/db");

let addExam = (examData, callback) => {
  let { title, description, date, start_time, end_time, duration } = examData;

  let query = `
    insert into exam (title, description, date, start_time, end_time, duration)
    values (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [title, description, date, start_time, end_time, duration], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

let getAllExams = () => {
  return new Promise((resolve, reject) => {
    let sql = "select *from exam";
    db.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// Get exam by ID
let getExamById = (id) => {
  return new Promise((resolve, reject) => {
    let sql = "select *from exam where id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

let updateExam = (id, data) => {
  return new Promise((resolve, reject) => {
    let sql = "update exam set ? where id = ?";
    db.query(sql, [data, id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

let deleteExam = (id) => {
  return new Promise((resolve, reject) => {
    let sql = "delete from exam where id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

const assignScheduleToExam = (examId, schedule_id) => {
  return db.query("update exam set schedule_id = ? where id = ?", [schedule_id, examId])
    .then(([result]) => result)
    .catch((err) => Promise.reject(err));
};
let assignQuestionsToExam = (exam_id, question_ids) => {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(question_ids) || question_ids.length === 0) {
      return reject(new Error("question_ids must be a non-empty array"));
    }

    let values = question_ids.map((qid) => [exam_id, qid]);
    let sql = "INSERT INTO exam_question (exam_id, question_id) VALUES ?";

    db.query(sql, [values], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

const searchExamByDate = (date) => {
  return db.query("select *from exam where date = ?", [date])
    .then(([rows]) => rows)
    .catch((err) => Promise.reject(err));
}
let assignSubject = (examId, subjectId) => {
    return new Promise((resolve, reject) => {
        // First check if subject exists
        db.query("SELECT * FROM subject WHERE id = ?", [subjectId], (err, subjectResult) => {
            if (err) return reject(err);
            if (subjectResult.length === 0) return resolve({ message: "Subject not found" });

            // Insert relation into exam_subject table
            db.query(
                "INSERT INTO exam_subject (exam_id, subject_id) VALUES (?, ?)",
                [examId, subjectId],
                (err, res) => {
                    if (err) return reject(err);
                    resolve({ message: "Subject assigned to exam successfully" });
                }
            );
        });
    });
};

const getAssignedSubjects = (examId) => {
  return new Promise((resolve, reject) => {
    console.log("[examModel.getAssignedSubjects] examId:", examId);

    const sql = `
      SELECT DISTINCT s.id, s.name, s.description
      FROM exam_subject es
      JOIN subject s ON es.subject_id = s.id
      WHERE es.exam_id = ?
    `;

    db.query(sql, [examId], (err, results) => {
      if (err) {
        console.error("[examModel.getAssignedSubjects] SQL error:", err);
        return reject(err);
      }
      console.log("[examModel.getAssignedSubjects] rows:", results.length);
      resolve(results);
    });
  });
};


// Get all questions for a specific exam
// Submit exam answers

let submitExamAnswers = (studentId, examId, answers) => {
  return new Promise((resolve, reject) => {
    if (!answers || answers.length === 0) {
      return reject({ message: "No answers submitted" });
    }

    // Save student answers
    const sqlInsert = `
      INSERT INTO student_answers
      (student_id, exam_id, question_id, selected_option)
      VALUES ?
    `;
    const values = answers.map(a => [studentId, examId, a.qid, a.selectedOption]);

    db.query(sqlInsert, [values], (err) => {
      if (err) return reject(err);

      // Fetch correct answers
      const questionIds = answers.map(a => a.qid);
      const sqlCorrect = `SELECT id, correct_option FROM question WHERE id IN (?)`;

      db.query(sqlCorrect, [questionIds], (err2, rows) => {
        if (err2) return reject(err2);

        let score = 0;
        answers.forEach(ans => {
          const correct = rows.find(q => q.id === ans.qid)?.correct_option;
          if (correct && correct === ans.selectedOption) score++;
        });

        let total = answers.length;
        let percentage = ((score / total) * 100).toFixed(2);
        let status = percentage >= 40 ? "Pass" : "Fail";

        // Fetch exam title + student name
        const sqlMeta = `
          SELECT e.title AS examTitle, s.stud_name AS studentName
          FROM exam e
          JOIN student s ON s.id = ?
          WHERE e.id = ?
        `;
        db.query(sqlMeta, [studentId, examId], (err3, metaRows) => {
          if (err3) return reject(err3);

          let examTitle = metaRows[0]?.examTitle || "Unknown Exam";
          let studentName = metaRows[0]?.studentName || "Unknown Student";

          resolve({
            examId,
            examTitle,
            studentId,
            studentName,
            obtained: score,
            total,
            percentage,
            status
          });
        });
      });
    });
  });
};


// Fetch questions for an exam

// ✅ Get all questions for a given exam
let getExamQuestions = (examId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT id, question_text, option_a, option_b, option_c, option_d, correct_option, marks
      FROM question
      WHERE exam_id = ?
    `;
    db.query(sql, [examId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
// Save submitted answers (optional: if you want to log them)
let saveExamSubmission = (studentId, examId, obtained, total) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO exam_results (student_id, exam_id, obtained_marks, total_marks) VALUES (?, ?, ?, ?)",
      [studentId, examId, obtained, total],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

module.exports = {
  addExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
  assignScheduleToExam,
  assignQuestionsToExam,
  assignSubject,
  searchExamByDate,
  getAssignedSubjects,
  submitExamAnswers,
  getExamQuestions,
  saveExamSubmission
};



