require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post('/api/generate', async (req, res) => {
  const { count = 5 } = req.body;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `You are a world-class marketing strategist and motion designer.

Generate ${count} kinetic typography video scripts for global business owners.

STRICT JSON FORMAT — no markdown, no explanation, only raw JSON array:

[
  {
    "id": 1,
    "term": "SINGLE MARKETING TERM IN CAPS",
    "reframe": "one phrase that violently reframes the term (max 5 words)",
    "truth": "brutal business truth (max 7 words)",
    "data": "shocking statistic or number (just the number/% with context word)",
    "verdict": "ONE WORD that haunts them after scrolling",
    "color": "hex color for accent (use only: #FF0000, #FFFFFF, #FFD700, #00FF00)"
  }
]

Rules:
- Each term must be a different emotional register
- No generic definitions — every line is a psychological strike
- Data must be real marketing statistics
- Verdict must be unexpected and heavy
- Never repeat terms across videos`
        }
      ]
    });

    const raw = message.content[0].text.trim();
    const scripts = JSON.parse(raw);

    res.json({ success: true, scripts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
