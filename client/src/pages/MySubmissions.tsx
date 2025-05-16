import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Submission {
  _id: string;
  status: string;
  code: string;
  createdAt: string;
}

const MySubmissions: React.FC = () => {
  const { questionId } = useParams();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch(`/api/v1/submissions/${questionId}/mine`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setSubmissions(data.submissions);
        } else {
          alert(data.message || "Failed to fetch submissions");
        }
      } catch (err) {
        console.error(err);
        alert("Error fetching submissions");
      }
    };

    fetchSubmissions();
  }, [questionId]);

  return (
    <div className="max-w-3xl mx-auto mt-6 p-4">
      <h2 className="text-2xl font-semibold mb-4">My Submissions</h2>
      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        submissions.map((sub) => (
          <div
            key={sub._id}
            onClick={() => setSelectedCode(sub.code)}
            className="border p-4 rounded mb-3 cursor-pointer hover:bg-gray-100"
          >
            <p>Status: <strong>{sub.status}</strong></p>
            <p className="text-sm text-gray-500">
              Submitted on: {new Date(sub.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}

      {selectedCode && (
        <div className="mt-6 p-4 bg-gray-100 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Submitted Code</h3>
          <pre className="whitespace-pre-wrap bg-white p-3 rounded border">
            {selectedCode}
          </pre>
          <button
            className="mt-2 text-blue-600 underline"
            onClick={() => setSelectedCode(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default MySubmissions;
