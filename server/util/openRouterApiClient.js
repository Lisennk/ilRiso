const { OpenAI } = require('openai');
const config = require('config');
const apiKey = config.get('apiKey');

// We are using OpenRouter API to access Llama model
module.exports = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: apiKey,
});