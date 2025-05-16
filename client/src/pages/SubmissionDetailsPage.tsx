import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MonacoEditor from '@monaco-editor/react';

type Submission = {
  _id: string;
  code: string;
  language: string;
  status: string;
  createdAt: string;
};

const SubmissionDetailsPage: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!questionId) return;

    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/v1/submissions/${questionId}/mine`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setSubmissions(data.submissions);
          if (data.submissions.length > 0) setSelectedSubmission(data.submissions[0]);
        } else {
          alert(data.message || 'Failed to fetch submissions');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [questionId]);

  if (loading) return <p>Loading submissions...</p>;

  if (submissions.length === 0) return <p>No submissions found for this question.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-6">
      {/* Submissions List */}
      <div className="md:w-1/3 border rounded p-4 overflow-y-auto max-h-[80vh]">
        <h2 className="text-xl font-semibold mb-4">My Submissions</h2>
        <ul>
          {submissions.map((sub) => (
            <li
              key={sub._id}
              onClick={() => setSelectedSubmission(sub)}
              className={`cursor-pointer p-2 rounded mb-2 border ${
                selectedSubmission?._id === sub._id ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{new Date(sub.createdAt).toLocaleString()}</span>
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    sub.status === 'Accepted'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-red-200 text-red-800'
                  }`}
                >
                  {sub.status}
                </span>
              </div>
              <p className="text-xs mt-1">Language: {sub.language}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Code Viewer */}
      <div className="md:w-2/3 border rounded p-4 bg-white">
        <h2 className="text-xl font-semibold mb-4">Code</h2>
        {selectedSubmission && (
          <MonacoEditor
            height="600px"
            language={selectedSubmission.language}
            value={selectedSubmission.code}
            options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14 }}
            theme="vs-dark"
          />
        )}
      </div>
    </div>
  );
};

export default SubmissionDetailsPage;
