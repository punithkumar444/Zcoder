// src/components/SubmissionList.tsx
import React from 'react';

type Submission = {
  _id: string;
  status: string;
  createdAt: string;
  user?: { username: string }; // for accepted submissions by all users
};

type SubmissionListProps = {
  submissions: Submission[];
  onSelect: (submissionId: string) => void;
  showUser?: boolean; // if true, show username (for accepted submissions)
};

const SubmissionList: React.FC<SubmissionListProps> = ({ submissions, onSelect, showUser = false }) => {
  return (
    <div className="space-y-4">
      {submissions.length === 0 && <p className="text-gray-500">No submissions found.</p>}

      {submissions.map((sub) => (
        <div
          key={sub._id}
          onClick={() => onSelect(sub._id)}
          className={`cursor-pointer p-4 rounded border 
            ${sub.status === 'Accepted' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}
            hover:shadow-lg transition`}
        >
          <div className="flex justify-between items-center">
            <span className="font-semibold">{sub.status}</span>
            <span className="text-xs text-gray-600">{new Date(sub.createdAt).toLocaleString()}</span>
          </div>
          {showUser && sub.user && (
            <div className="mt-1 text-sm text-gray-700">User: {sub.user.username}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SubmissionList;
