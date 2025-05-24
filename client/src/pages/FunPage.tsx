// src/pages/ZCoderFunPage.tsx
import React, { useState, useEffect } from 'react';

const jokes = [
  "Why do programmers hate nature? It has too many bugs! 🐞",
  "How many programmers does it take to change a light bulb? None. It's a hardware problem. 💡",
  "Why do Java developers wear glasses? Because they don't C#! 🤓",
  "I told my computer I needed a break, and it said: 'Did you mean coffee?' ☕",
  "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?' 🍻"
];

const asciiBot = `
      [^_^]
     <(   )>
     /|   |\\
     /_| |_\\
  The ZCoder Bot!
`;

const FunPage: React.FC = () => {
  const [joke, setJoke] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * jokes.length);
    setJoke(jokes[randomIndex]);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8 text-center bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl shadow-lg">
      <h1 className="text-5xl font-black mb-6 text-purple-700 animate-pulse">
        🎉 Welcome to ZCoder! 🎉
      </h1>

      <p className="text-xl text-gray-800 mb-4">
        Here's a coding joke to brighten your brain:
      </p>

      <blockquote className="bg-white border-l-4 border-purple-400 text-gray-700 p-4 rounded mb-6 shadow-md">
        <q className="text-lg italic">{joke}</q>
      </blockquote>

      <div className="flex justify-center mb-6">
        <pre className="bg-black text-green-400 p-4 rounded font-mono text-left whitespace-pre">
             {asciiBot}
        </pre>
      </div>
      <blockquote className="italic text-gray-500 mb-6">
        <q>Why do programmers prefer dark mode?<br />
        Because light attracts bugs! 🐛</q>
      </blockquote>


      <p className="text-lg text-gray-800">
        Keep hacking, keep laughing. May your code compile on the first try! 💻🚀
      </p>
    </div>
  );
};

export default FunPage;
