const express = require('express');
const router = express.Router();
const { Question } = require('../db'); 
const zod = require('zod');
const { authMiddleware } = require('../middleware');
// Zod schema for validating query parameters
const querySchema = zod.object({
  topic: zod.string().optional(),
});

// Zod schema for validating MongoDB ObjectID format
const idSchema = zod.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid question ID');

// GET /questions?topic=XYZ
router.get('/', async (req, res) => {
  const parsed = querySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      message: 'Invalid query parameters',
      error: parsed.error.errors,
    });
  }

  try {
    const { topic } = parsed.data;
    const questions = topic
      ? await Question.find({ topic })
      : await Question.find({});
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /questions/:id
router.get('/:id', async (req, res) => {
  const parsedId = idSchema.safeParse(req.params.id);

  if (!parsedId.success) {
    return res.status(400).json({
      message: 'Invalid question ID',
      error: parsedId.error.errors,
    });
  }

  try {
    const question = await Question.findById(parsedId.data);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({ question });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Zod schema for a new question
const questionSchema = zod.object({
  title: zod.string(),
  description: zod.string(),
  topic: zod.string(),
  difficulty: zod.enum(["Easy", "Medium", "Hard"]),
  testCases: zod.array(
    zod.object({
      input: zod.string(),
      expectedOutput: zod.string()
    })
  )
});

// POST /questions - Create new question
router.post('/', authMiddleware, async (req, res) => {
  const parsed = questionSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: 'Invalid question format',
      error: parsed.error.errors
    });
  }

  try {
    const newQuestion = new Question(parsed.data);
    await newQuestion.save();

    res.status(201).json({
      message: 'Question created successfully',
      question: newQuestion
    });
  } catch (err) {
    console.error("Error while creating question:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
