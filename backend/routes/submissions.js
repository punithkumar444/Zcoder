// routes/submissions.js
const express = require('express');
const router = express.Router();
const zod = require('zod');
const { Submission, Question } = require('../db');
const { authMiddleware } = require('../middleware');
const { runCode } = require('../utils/judge0');
const { languageMap } = require('../utils/languageMap');
// Define Zod schema
const submissionSchema = zod.object({
  code: zod.string().min(1, "Code is required"),
  language: zod.string().min(1, "Language is required")
});

router.post('/:questionId', authMiddleware, async (req, res) => {
  const parsed = submissionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid submission format', error: parsed.error.errors });
  }

  const { code, language } = parsed.data;

  const language_id = languageMap[language.toLowerCase()];
  if (!language_id) {
    return res.status(400).json({ message: 'Unsupported language provided' });
  }
  const { questionId } = req.params;

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    let passedAll = true;
    let results = [];

    // Run code against each test case
    for (const testCase of question.testCases) {
      const result = await runCode(code, language_id, testCase.input);

      const output = (result.stdout || "").trim();
      const expected = testCase.expectedOutput.trim();

      const isCorrect = output === expected;

      if (!isCorrect) passedAll = false;

      results.push({
        input: testCase.input,
        expectedOutput: expected,
        actualOutput: output,
        status: isCorrect ? "Passed" : "Wrong Answer"
      });
    }

    const submission = new Submission({
      userId: req.userId,
      questionId,
      code,
      language: language_id,
      status: passedAll ? "Accepted" : "Wrong Answer",
      output: JSON.stringify(results, null, 2)
    });

    await submission.save();

    res.status(200).json({
      message: passedAll ? "All test cases passed!" : "Some test cases failed",
      submissionId: submission._id,
      results
    });

  } catch (err) {
    console.error('Error while submitting solution:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Zod schema to validate ObjectId
const idSchema = zod.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid question ID');

router.get('/:questionId/mine', authMiddleware, async (req, res) => {
  const parsed = idSchema.safeParse(req.params.questionId);
  if (!parsed.success) {
    return res.status(400).json({
      message: 'Invalid question ID',
      error: parsed.error.errors,
    });
  }

  try {
    const submissions = await Submission.find({
      userId: req.userId,
      questionId: parsed.data,
    }).sort({ createdAt: -1 });

    res.json({ submissions });
  } catch (err) {
    console.error("Error fetching user submissions:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/:questionId/accepted', async (req, res) => {
  const parsed = idSchema.safeParse(req.params.questionId);
  if (!parsed.success) {
    return res.status(400).json({
      message: 'Invalid question ID',
      error: parsed.error.errors,
    });
  }

  try {
    const acceptedSubmissions = await Submission.find({
      questionId: parsed.data,
      status: 'Accepted'
    }).populate('userId', 'username').sort({ createdAt: -1 });

    res.json({ submissions: acceptedSubmissions });
  } catch (err) {
    console.error("Error fetching accepted submissions:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
