let db = require("../config/db");

let assignQuestionsToExam = (req, res) => {
  let { exam_id, question_ids } = req.body;

  if (!exam_id || !Array.isArray(question_ids) || question_ids.length === 0) {
    res.status(400).send({ message: "exam_id and question_ids are required" });
    return;
  }

  let values = question_ids.map(qid => [exam_id, qid]);

  let sql = "INSERT INTO exam_question (exam_id, question_id) VALUES ?";
  db.query(sql, [values], (err, result) => {
    if (err) res.status(500).send(err);
    else res.send({ message: "Questions assigned to exam", data: result });
  });
};
module.exports={
assignQuestionsToExam
}