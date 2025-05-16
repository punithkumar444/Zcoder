// src/components/SubmissionDetails.tsx
import React from 'react';

type TestResult = {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  status: string;
};

type SubmissionDetailsProps = {
  code: string;
  results: TestResult[];
};

const SubmissionDetails: React.FC<SubmissionDetailsProps> = ({ code, results }) => {
  return (
    <div className="mt-4 p-4 border rounded bg-white shadow">
      <h3 className="font-semibold mb-2">Code:</h3>
      <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-48">{code}</pre>

      <h3 className="font-semibold mt-4 mb-2">Test Case Results:</h3>
      <div className="space-y-2 max-h-64 overflow-auto">
        {results.map((test, index) => (
          <div
            key={index}
            className={`p-2 rounded border ${
              test.status === 'Passed' ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'
            }`}
          >
            <p><strong>Input:</strong> {test.input}</p>
            <p><strong>Expected:</strong> {test.expectedOutput}</p>
            <p><strong>Output:</strong> {test.actualOutput}</p>
            <p><strong>Status:</strong> {test.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmissionDetails;
