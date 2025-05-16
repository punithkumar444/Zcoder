import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

const QuestionPage: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

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

      {/* Right Panel - Code Editor (Placeholder) */}
      <div className="w-full md:w-1/2 p-6 overflow-y-auto bg-white">
        <h2 className="text-xl font-semibold mb-4">Write Your Code</h2>
        <textarea
          className="w-full h-96 border rounded p-4 font-mono text-sm"
          placeholder="Write your solution here..."
        />
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </div>
    </div>
  );
};

export default QuestionPage;

