// backend/routes/index.js
const express = require('express');
const userRouter = require("./user");
const questionrouter = require("./questions");
const submissionsrouter = require("./submissions");
const discussionRouter = require("./discussions");

const router = express.Router();
router.get('/', (req, res) => {
  res.send('ZCoder API is live!');
});
router.use("/user", userRouter);
router.use("/questions",questionrouter);
router.use("/submissions",submissionsrouter);
router.use("/discussions", discussionRouter);

module.exports = router;