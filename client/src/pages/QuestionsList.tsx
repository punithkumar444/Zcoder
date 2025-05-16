// src/pages/QuestionsList.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Question = {
  _id: string;
  title: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
};

const QuestionsList: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('/api/v1/questions');
        const data = await res.json();
        setQuestions(data.questions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleClick = (questionId: string) => {
    navigate(`/questions/${questionId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Coding Questions</h1>
      {loading ? (
        <p>Loading questions...</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div
              key={q._id}
              onClick={() => handleClick(q._id)}
              className="cursor-pointer border p-4 rounded shadow hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{q.title}</h2>
                <span
                    className={`text-sm px-2 py-1 rounded bg-${
                      q.difficulty === 'Easy'
                        ? 'green'
                        : q.difficulty === 'Medium'
                        ? 'yellow'
                        : 'red'
                    }-100 text-${
                      q.difficulty === 'Easy'
                        ? 'green'
                        : q.difficulty === 'Medium'
                        ? 'yellow'
                        : 'red'
                    }-800`}
                  >
                  {q.difficulty}
                </span>
              </div>
              <p className="text-gray-600 mt-1">Topic: {q.topic}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionsList;
