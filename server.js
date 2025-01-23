// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

// Bible API Configuration
const BIBLE_API = 'https://bible-api.com';

// OpenAI Configuration
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Get Daily Passage
app.get('/api/passage', async (req, res) => {
  try {
    // For simplicity, use random passage. Replace with your daily logic
    const response = await axios.get(`${BIBLE_API}/john+3:16`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch passage' });
  }
});

// Generate Insights
app.post('/api/insights', async (req, res) => {
  const { passage } = req.body;
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `Provide theological insights for this Bible passage: "${passage}". 
        Include historical context, key themes, and practical applications.`
      }]
    });
    res.json({ insights: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'AI failed to generate insights' });
  }
});

// Chat with Passage
app.post('/api/chat', async (req, res) => {
  const { passage, message } = req.body;
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `Based on this Bible passage: "${passage}", answer this question: "${message}". 
        Keep responses under 200 words.`
      }]
    });
    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'AI failed to respond' });
  }
});

// Generate Prayer Points
app.post('/api/prayer', async (req, res) => {
  const { passage } = req.body;
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `Generate 3 prayer points based on this Bible passage: "${passage}". 
        Use bullet points and focus on application.`
      }]
    });
    res.json({ prayer: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate prayer' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
