const express = require('express');
const router = express.Router();
const { Comment } = require('../db');
const zod = require('zod');
const { authMiddleware } = require('../middleware');

router.get("/:questionId", async (req, res) => {
  try {
    const comments = await Comment.find({ questionId: req.params.questionId }).sort({ timestamp: 1 });
    res.json({ comments });
  } catch (err) {
    res.status(500).json({ message: "Error fetching comments" });
  }
});

module.exports = router;