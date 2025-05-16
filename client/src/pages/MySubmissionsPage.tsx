import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Question = {
  _id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
};

const MySubmissionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyQuestions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/v1/submissions/mine', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setQuestions(data.questions);
        } else {
          alert(data.message || 'Failed to fetch submissions');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyQuestions();
  }, []);

  const handleClick = (questionId: string) => {
    navigate(`/my-submissions/${questionId}`);
  };

  if (loading) return <p>Loading your submissions...</p>;

  if (questions.length === 0) return <p>You haven't submitted any solutions yet.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Submitted Questions</h1>
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
    </div>
  );
};

export default MySubmissionsPage;
