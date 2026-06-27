// src/components/SubmitExam.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { get, post } from "../services/api"; // Axios wrapper
import "../index.css";

export default function SubmitExam() {
  const { examId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Fetch questions when component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      setError(null);
      setFetching(true);
      try {
        const res = await get(`/api/exam/${examId}/questions`);
        if (!res.data || !res.data.length) {
          setError("No questions found for this exam.");
          return;
        }
        const mappedQuestions = res.data.map(q => ({
          qid: q.id,
          question: q.question_text,
          optionA: q.option_a,
          optionB: q.option_b,
          optionC: q.option_c,
          optionD: q.option_d,
          marks: q.marks,
        }));
        setQuestions(mappedQuestions);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load exam questions");
      } finally {
        setFetching(false);
      }
    };

    fetchQuestions();
  }, [examId]);

  // Handle selecting an answer
  const handleSelect = (qid, value) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  };

  // Prepare payload to send to backend
  const buildPayloadAnswers = () =>
    Object.entries(answers).map(([qid, selectedOption]) => ({
      qid: Number(qid),
      selectedOption,
    }));

  // Submit exam answers
  const handleSubmit = async () => {
    setError(null);
    setResult(null);

    const builtAnswers = buildPayloadAnswers();
    if (!builtAnswers.length) {
      setError("Please answer at least one question before submitting.");
      return;
    }

    setLoading(true);
    try {
      const res = await post(`/exam/${examId}/submit`, { answers: builtAnswers });

      if (res.data && res.data.result) {
  const examResult = res.data.result;
  setResult({
    totalMarks: Number(examResult.totalMarks),
    obtainedMarks: Number(examResult.obtainedMarks),
    percentage: Number(examResult.percentage),
    status: examResult.status
  });

      } else {
        setError("No result returned from server");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.response?.data?.message || "Failed to submit exam");
    } finally {
      setLoading(false);
    }
  };

  // Download Excel of result
  const handleDownload = async () => {
    try {
      const res = await get(`/exam/result/download/${examId}`, { responseType: "blob" });
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `exam_result_${examId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      setError("Failed to download result file");
    }
  };

  return (
    <div className="submit-exam">
      <h2>Exam: {examId}</h2>

      {fetching && <p>Loading questions...</p>}
      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

      {/* Questions */}
      <div className="questions-list">
        {questions.map(q => (
          <div key={q.qid} className="question-card">
            <p>{q.qid}. {q.question} ({q.marks} marks)</p>
            {["A", "B", "C", "D"].map(opt => (
              <label key={`${q.qid}-${opt}`} style={{ display: "block", margin: "5px 0" }}>
                <input
                  type="radio"
                  name={`q-${q.qid}`}
                  value={opt}
                  checked={answers[q.qid] === opt}
                  onChange={() => handleSelect(q.qid, opt)}
                />{" "}
                {q[`option${opt}`]}
              </label>
            ))}
          </div>
        ))}
      </div>

      {/* Submit button */}
      {questions.length > 0 && !result && (
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ marginTop: "15px", padding: "10px 20px" }}
        >
          {loading ? "Submitting..." : "Submit Exam"}
        </button>
      )}

      {/* Result summary */}
      {result && (
        <div className="summary" style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
          <h3>Result Summary</h3>
          <p>Total Marks: {result.totalMarks}</p>
          <p>Obtained Marks: {result.obtainedMarks}</p>
          <p>Percentage: {result.percentage}%</p>
          <p>Status: {result.status}</p>
          <button onClick={handleDownload} style={{ marginTop: "10px" }}>Download Excel</button>
        </div>
      )}
    </div>
  );
}
