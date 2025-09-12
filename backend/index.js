const express = require('express');
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { Comment } = require('./db');
const rootRouter = require("./routes/index");

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // or restrict to your frontend origin
    methods: ["GET", "POST"]
  }
});
// added routes
// Socket logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", (questionId) => {
    socket.join(questionId);
    console.log(`User ${socket.id} joined room ${questionId}`);
  });

 socket.on("sendMessage", async ({ questionId, message, username }) => {
  const newComment = new Comment({ questionId, message, username });

  try {
    await newComment.save();
    io.to(questionId).emit("receiveMessage", {
      message,
      username,
      timestamp: newComment.timestamp,
    });
  } catch (err) {
    console.error("Failed to save comment:", err);
  }
});


  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/v1", rootRouter);

// Start server
server.listen(3000, () => {
  console.log("Backend is running on port 3000");
});
