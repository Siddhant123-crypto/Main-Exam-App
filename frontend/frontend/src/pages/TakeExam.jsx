// src/pages/TakeExam.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../index.css";
export default function TakeExam() {
  const { examId } = useParams(); // examId from route (/exam/:examId/take)
  const studentId = 72; // Replace with logged-in student's ID (from auth/session)
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:3000";

  // Fetch exam questions
  useEffect(() => {
    axios
      .get(`${API_BASE}/exam/${examId}/questions`)
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch questions", err);
        setLoading(false);
      });
  }, [examId]);

  // Handle answer selection
  const handleChange = (qId, option) => {
    setAnswers({ ...answers, [qId]: option });
  };

  // Submit exam
  const handleSubmit = () => {
    axios
      .post(`${API_BASE}/exam/${examId}/submit`, {
        studentId,
        answers: Object.keys(answers).map((qid) => ({
          questionId: qid,
          selectedOption: answers[qid],
        })),
      })
      .then((res) => {
        setResult(res.data);
        setSubmitted(true);
      })
      .catch((err) => console.error("Submit error", err));
  };

  // Download result Excel
  const downloadResult = () => {
    axios({
      url: `${API_BASE}/results/${examId}/${studentId}/excel`,
      method: "GET",
      responseType: "blob",
    }).then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Result_${studentId}_${examId}.xlsx`);
      document.body.appendChild(link);
      link.click();
    });
  };

  if (loading) return <p>Loading exam...</p>;

  return (
    <div className="take-exam-container">
      <h2>Exam #{examId}</h2>

      {!submitted ? (
        <>
          {questions.length === 0 ? (
            <p>No questions found.</p>
          ) : (
            <form>
              {questions.map((q, index) => (
                <div key={q.qid} className="question-card">
                  <p>
                    <strong>
                      {index + 1}. {q.question}
                    </strong>
                  </p>
                  {[q.option1, q.option2, q.option3, q.option4].map(
                    (opt, i) => (
                      <label key={i} className="option-label">
                        <input
                          type="radio"
                          name={`q-${q.qid}`}
                          value={opt}
                          checked={answers[q.qid] === opt}
                          onChange={() => handleChange(q.qid, opt)}
                        />
                        {opt}
                      </label>
                    )
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleSubmit}
                className="submit-btn"
              >
                Submit Exam
              </button>
            </form>
          )}
        </>
      ) : (
        <div className="result-card">
          <h3>Result</h3>
          <p>
            Score: {result.score} / {result.totalMarks}
          </p>
          <p>Status: {result.status}</p>
          <button onClick={downloadResult} className="download-btn">
            Download Excel
          </button>
        </div>
      )}
    </div>
  );
}
