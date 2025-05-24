// src/pages/ZCoderFunPage.tsx
import React from 'react';

const FunPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      <h1 className="text-4xl font-extrabold mb-4 text-purple-600">Welcome to ZCoder! 🎉</h1>
      <p className="text-lg mb-6 text-gray-700">
        Ready to sharpen your coding skills? Here’s a fun coding joke to kickstart your day:
      </p>
      <blockquote className="italic text-gray-500 mb-6">
        <q>Why do programmers prefer dark mode?<br />
        Because light attracts bugs! 🐛</q>
      </blockquote>
      <p className="text-lg text-gray-700">
        Keep coding, keep debugging, and remember: every bug is just a hidden feature! 🚀
      </p>
    </div>
  );
};

export default FunPage;
