// backend/routes/index.js
const express = require('express');
const userRouter = require("./user");
const questionrouter = require("./questions");
const submissionsrouter = require("./submissions");
// const accountRouter = require("./account");

const router = express.Router();
router.get('/', (req, res) => {
  res.send('ZCoder API is live!');
});
router.use("/user", userRouter);
router.use("/questions",questionrouter);
router.use("/submissions",submissionsrouter);
// router.use("/account", accountRouter);

module.exports = router;