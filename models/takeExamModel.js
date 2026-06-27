const db = require("../config/db");

// 1️⃣ Get all questions for a specific exam (without revealing answers)
let getExamQuestions = (examId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT q.id, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_option, q.marks
      FROM exam_question eq
      JOIN questions q ON eq.question_id = q.id
      WHERE eq.exam_id = ?
    `;
    db.query(sql, [examId], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};
// 2️⃣ Submit student answers and calculate score
const submitExamAnswers = (studentId, examId, answers) => {
  return new Promise((resolve, reject) => {
    if (!studentId || !examId || !answers || answers.length === 0) {
      return reject(new Error("Exam ID, student ID, and answers are required"));
    }

    const questionIds = answers.map(a => a.qid);

    // Fetch correct options and marks
    const sqlFetch = `SELECT id, correct_option, marks FROM question WHERE id IN (?)`;

    db.query(sqlFetch, [questionIds], (err, results) => {
      if (err) return reject(err);
      if (!results.length) return reject(new Error("Questions not found"));

      let obtainedMarks = 0;

      // Prepare values for batch insert
      const values = answers.map(a => {
        const question = results.find(q => q.id === a.qid);
        if (!question) return null; // skip invalid questions

        const isCorrect = a.selectedOption === question.correct_option ? 1 : 0;
        if (isCorrect) obtainedMarks += question.marks;

        return [
          studentId,
          examId,
          question.id,
          a.selectedOption,
          isCorrect,
          isCorrect ? question.marks : 0
        ];
      }).filter(v => v !== null);

      if (values.length === 0) return reject(new Error("No valid answers to submit"));

      const sqlInsert = `
        INSERT INTO student_answers
        (student_id, exam_id, question_id, selected_option, is_correct, marks_obtained)
        VALUES ?
      `;

      db.query(sqlInsert, [values], (err2) => {
        if (err2) return reject(err2);

        const totalMarks = results.reduce((sum, q) => sum + q.marks, 0);

        // ✅ Return numeric values
        resolve({
          totalMarks: Number(totalMarks),
          obtainedMarks: Number(obtainedMarks),
          percentage: Number(((obtainedMarks / totalMarks) * 100).toFixed(2)),
          status: obtainedMarks >= totalMarks / 2 ? "Pass" : "Fail"
        });
      });
    });
  });
};


let getStudentResults = (studentId) => {
  return new Promise((resolve, reject) => {
    let sql = `
      SELECT sa.exam_id, e.title AS exam_title, e.date AS exam_date,
             SUM(CASE WHEN sa.selected_option = q.correct_option THEN q.marks ELSE 0 END) AS obtainedMarks,
             SUM(q.marks) AS totalMarks,
             ROUND(SUM(CASE WHEN sa.selected_option = q.correct_option THEN q.marks ELSE 0 END)/SUM(q.marks)*100,2) AS percentage,
             IF(SUM(CASE WHEN sa.selected_option = q.correct_option THEN q.marks ELSE 0 END) >= SUM(q.marks)/2, 'Pass', 'Fail') AS status
      FROM student_answers sa
      JOIN exam e ON sa.exam_id = e.id
      JOIN question q ON sa.question_id = q.id
      WHERE sa.student_id = ?
      GROUP BY sa.exam_id
      ORDER BY e.date DESC
    `;
    db.query(sql, [studentId], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};


let getStudentExamResult = (studentId, examId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT sa.question_id AS qid, q.question_text, sa.selected_option, q.correct_option, sa.marks_obtained
      FROM student_answers sa
      JOIN question q ON sa.question_id = q.id
      WHERE sa.student_id = ? AND sa.exam_id = ?
    `;
    db.query(sql, [studentId, examId], (err, results) => {
      if (err) return reject(err);

      if (!results.length) return resolve(null);

      // Calculate totals
      let totalMarks = results.reduce((sum, r) => sum + r.marks_obtained, 0);
      let obtainedMarks = results.reduce((sum, r) => sum + r.marks_obtained, 0);
      let totalPossible = results.length > 0 ? results.reduce((sum, r) => sum + r.marks_obtained, 0) : 0;

      resolve({
        answers: results,
        totalMarks: totalPossible,
        obtainedMarks: obtainedMarks,
        percentage: totalPossible > 0 ? ((obtainedMarks / totalPossible) * 100).toFixed(2) : 0,
        status: obtainedMarks >= totalPossible / 2 ? "Pass" : "Fail"
      });
    });
  });
};


module.exports = {
  getExamQuestions,
  submitExamAnswers,
  getStudentResults,
  getStudentExamResult
};
