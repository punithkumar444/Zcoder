import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const socket = io("http://localhost:3000"); // ✅ Update to your backend if deployed

type Comment = {
  username: string;
  message: string;
  timestamp: string;
};

type Props = {
  questionId: string;
  username: string; // you can pass user from context or prop
};

const DiscussionSection: React.FC<Props> = ({ questionId, username }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [message, setMessage] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/v1/discussions/${questionId}`);
      const data = await res.json();
      setComments(data.comments); // Assuming response shape: { comments: [...] }
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  fetchComments();

  socket.emit("joinRoom", questionId);

  socket.on("receiveMessage", (data: Comment) => {
    setComments((prev) => [...prev, data]);
  });

  return () => {
    socket.off("receiveMessage");
  };
}, [questionId]);


  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("sendMessage", { questionId, message, username });
    setMessage("");
  };

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [comments]);

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-lg font-semibold mb-2">💬 Discussion</h3>

      <div
        ref={chatRef}
        className="max-h-64 overflow-y-auto bg-gray-100 p-4 rounded mb-4"
      >
        {comments.map((c, i) => {
  const isOwn = c.username === username;
  return (
    <div
      key={i}
      className={`mb-2 flex ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-xs p-2 rounded-lg ${
            isOwn
                ? 'bg-blue-500 text-white text-right'
                : 'bg-gray-200 text-black text-left'
              }`}
              >
                <div className="font-bold">{c.username}</div>
                <div>{c.message}</div>
                <div className="text-xs mt-1 opacity-70">
                  {new Date(c.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}

      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border p-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your comment..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default DiscussionSection;
