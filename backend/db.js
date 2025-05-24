// backend/db.js
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://punithkumar444:NAni.123@cluster0.a6mhwmx.mongodb.net/zcoder")

// Create a Schema for Users
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
});
const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  topic: { type: String, required: true },
  testCases: [testCaseSchema],
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy',
  },
  createdAt: { type: Date, default: Date.now },
});

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,  // store language_id from Judge0
    required: true,
  },
  status: {
    type: String,
    enum: ['Accepted', 'Wrong Answer'],
    required: true,
  },
  output: {
    type: String, // JSON stringified result object
    required: true,
  },
}, {
  timestamps: true  // adds createdAt and updatedAt automatically
});

const commentSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model('Comment', commentSchema);
const Question = mongoose.model('Question', questionSchema);
const User = mongoose.model('User', userSchema);
const Submission = mongoose.model('Submission', submissionSchema);

module.exports = {
	User,
  Question,
  Submission,
  Comment
};