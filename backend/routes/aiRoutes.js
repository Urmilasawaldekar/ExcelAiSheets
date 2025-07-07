import express from 'express';
import { CohereClient } from 'cohere-ai';
import { IsUser as auth } from '../middleware/verifyToken.js'; // Use IsUser middleware for authentication
import dotenv from 'dotenv';
dotenv.config();

// ✅ Use the new syntax from v5
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

const router = express.Router();

router.post('/summary', auth, async (req, res) => {
  try {
    const excelData = req.body.data;

    if (!excelData || !Array.isArray(excelData)) {
      return res.status(400).json({ error: 'Invalid or missing data array' });
    }

    const prompt = `Summarize the following tabular JSON data:\n${JSON.stringify(
      excelData.slice(0, 10)
    )}`;

    const response = await cohere.generate({
      model: 'command',
      prompt: prompt,
      maxTokens: 200,
      temperature: 0.5,
    });

    res.json({ summary: response.generations[0].text.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cohere summary failed' });
  }
});

// New chat endpoint
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, contextData } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing message' });
    }

    // Prepare prompt with context data and user message
    let prompt = 'You are an AI assistant helping to analyze tabular data.\n';
    if (contextData && Array.isArray(contextData)) {
      prompt += `Here is some data:\n${JSON.stringify(contextData.slice(0, 10))}\n`;
    }
    prompt += `User: ${message}\nAI:`;

    const response = await cohere.generate({
      model: 'command',
      prompt: prompt,
      maxTokens: 150,
      temperature: 0.7,
      stopSequences: ['User:', 'AI:'],
    });

    const aiResponse = response.generations[0].text.trim();

    res.json({ response: aiResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cohere chat failed' });
  }
});

export default router;
