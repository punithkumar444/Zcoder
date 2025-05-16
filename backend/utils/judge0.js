// utils/judge0.js
const axios = require("axios");

const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com/submissions";
const RAPID_API_KEY = "8da4725532msh7028d4b47cab1fbp1ef828jsn2c03c4cf1703"; // Replace with your key

const headers = {
  "content-type": "application/json",
  "X-RapidAPI-Key": RAPID_API_KEY,
  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
};

/**
 * Send code to Judge0 and get the result
 */
async function runCode(source_code, language_id, stdin) {
  const { data: { token } } = await axios.post(JUDGE0_URL + "?base64_encoded=false&wait=true", {
    source_code,
    language_id,
    stdin
  }, { headers });

  // Fetch result
  const { data: result } = await axios.get(`${JUDGE0_URL}/${token}?base64_encoded=false`, { headers });

  return result;
}

module.exports = { runCode };

