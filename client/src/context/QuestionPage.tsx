import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MonacoEditor from "@monaco-editor/react";

type TestCase = {
  input: string;
  expectedOutput: string;
};

type Question = {
  _id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  testCases: TestCase[];
};

const languageMap: { [key: string]: string } = {
  cpp: "cpp",
  python: "python",
  java: "java",
};

const languages = Object.keys(languageMap);

const QuestionPage: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("cpp");

  useEffect(() => {
    if (!questionId) return;

    const fetchQuestion = async () => {
      try {
        const res = await fetch(`/api/v1/questions/${questionId}`);
        const data = await res.json();
        setQuestion(data.question);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId]);

  const handleSubmit = async () => {
  setSubmitting(true);
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/v1/submissions/${questionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ code, language })
    });

    const data = await res.json();
    if (res.ok) {
      navigate(`/my-submissions/${questionId}`);
    } else {
      alert(data.message || 'Submission failed');
    }
  } catch (err) {
    console.error('Submission error:', err);
    alert('An error occurred while submitting your code.');
  } finally {
    setSubmitting(false);
  }
};

  if (loading) {
    return <div className="p-6">Loading question...</div>;
  }

  if (!question) {
    return <div className="p-6 text-red-600">Question not found.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)]">
      {/* Left Panel - Question Info */}
      <div className="w-full md:w-1/2 overflow-y-auto border-r p-6 bg-gray-50">
        <h1 className="text-2xl font-bold mb-2">{question.title}</h1>
        <p className="text-sm text-gray-600 mb-2">Topic: {question.topic}</p>
        <span
          className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
            question.difficulty === "Easy"
              ? "bg-green-100 text-green-800"
              : question.difficulty === "Medium"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {question.difficulty}
        </span>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="whitespace-pre-wrap">{question.description}</p>
        </div>

        {/* Sample Test Cases */}
        {question.testCases.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Sample Test Cases</h3>
            <div className="space-y-4">
              {question.testCases.map((tc, index) => (
                <div key={index} className="bg-white p-3 rounded shadow-sm border">
                  <p className="text-sm font-medium">Input:</p>
                  <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">{tc.input}</pre>
                  <p className="text-sm font-medium mt-2">Expected Output:</p>
                  <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">{tc.expectedOutput}</pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Monaco Editor */}
      <div className="w-full md:w-1/2 p-6 overflow-y-auto bg-white">
        <h2 className="text-xl font-semibold mb-4">Write Your Code</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>{lang.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <MonacoEditor
          height="400px"
          language={languageMap[language]}
          value={code}
          onChange={(value) => setCode(value || "")}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`mt-4 px-4 py-2 rounded text-white ${
            submitting ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default QuestionPage;


