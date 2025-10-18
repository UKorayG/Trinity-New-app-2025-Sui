// Gerekli kütüphaneleri projemize dahil ediyoruz.
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

// Bu satır .env dosyasındaki bilgileri okumamızı sağlar.
require('dotenv').config();

// Express uygulamasını başlatıyoruz.
const app = express();
const port = 3000;

// Sunucu ayarları
app.use(cors());
app.use(express.json());

// --- DeepSeek API Ayarları ---
// Anahtarı .env dosyasından alıyoruz ve baseURL'i DeepSeek için ayarlıyoruz.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
  baseURL: "https://api.deepseek.com/v1" 
});

// --- API endpoint'i (uç noktası) oluşturuyoruz ---
app.post('/generate-story', async (req, res) => {
  const { words } = req.body;
  
  if (!words || words.length !== 3) {
    return res.status(400).json({ error: 'Please enter exactly 3 words.' });
  }

  // Yapay zekaya göndereceğimiz yeni ve detaylı komut (prompt).
  const userPrompt = `
    You are a master cyberpunk storyteller.
    Your task is to write a very short, coherent, and cool cyberpunk story in English.
    The story must be no more than three sentences.
    The story must take place in a futuristic, dystopian city.
    The story must incorporate the following three keywords: ${words.join(', ')}.
    Your response must contain ONLY the story text. Do not add any extra explanations, titles, or comments.
    
    Example:
    Input: "drone, neon, alley"
    Output: The drone's red eye blinked in the neon glow of the alley. A shadow moved, and the street went dark. Another cyber-day was over.
    
    Now, write a story using these three words: ${words.join(', ')}
    `;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "deepseek-chat", 
      messages: [{ role: "user", content: userPrompt }],
    });
    
    const story = chatCompletion.choices[0].message.content;
    res.json({ story });

  } catch (error) {
    console.error('ERROR: API request failed.', error);
    res.status(500).json({ error: 'Story generation failed. Please try again.' });
  }
});

// --- Sunucuyu başlatıyoruz ---
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}...`);
});