const express = require('express');
const Groq = require('groq-sdk');
const auth = require('../middleware/auth');

const router = express.Router();
const titleRequests = new Map();
const RATE_LIMIT_MS = 60 * 1000;
const MAX_TITLE_LENGTH = 160;
const REQUEST_TIMEOUT_MS = 10 * 1000;
const fallbackDescription = 'Add a clear next step, expected outcome, and any useful deadline or context.';
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

function normalizeTitle(title) {
  return title.trim().replace(/\s+/g, ' ').toLowerCase();
}

function cleanupRateLimits(now = Date.now()) {
  for (const [key, timestamp] of titleRequests) {
    if (now - timestamp >= RATE_LIMIT_MS) titleRequests.delete(key);
  }
}

function getProviderError(error) {
  const status = error?.status || error?.statusCode;
  if (status === 401 || status === 403) {
    return { status: 502, message: 'The AI service rejected the backend API key. Check GROQ_API_KEY.' };
  }
  if (status === 429) {
    return { status: 429, message: 'The AI service quota or rate limit has been reached. Please try again later.' };
  }
  return { status: 503, message: 'The AI service is temporarily unavailable. You can write the description manually.' };
}

async function generateDescription(title) {
  if (!groq) throw Object.assign(new Error('Groq API key is not configured'), { code: 'MISSING_CONFIG' });

  const completion = groq.chat.completions.create({
    model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
    messages: [
      {
        role: 'system',
        content: 'Write one short, useful task description in one or two sentences. Return only the description, without a heading or quotation marks.',
      },
      { role: 'user', content: `Task title: ${title}` },
    ],
  });
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Groq request timed out')), REQUEST_TIMEOUT_MS);
  });

  const response = await Promise.race([completion, timeout]).finally(() => clearTimeout(timeoutId));
  const description = response?.choices?.[0]?.message?.content?.trim();
  if (!description) throw new Error('Groq returned no description');
  return description;
}

router.post('/generate-description', auth, async (req, res) => {
  const { title } = req.body || {};

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'A non-empty task title is required.' });
  }
  if (title.trim().length > MAX_TITLE_LENGTH) {
    return res.status(400).json({ error: `Task title must be ${MAX_TITLE_LENGTH} characters or fewer.` });
  }

  const normalizedTitle = normalizeTitle(title);
  const now = Date.now();
  cleanupRateLimits(now);
  const previousRequest = titleRequests.get(normalizedTitle);
  if (previousRequest && now - previousRequest < RATE_LIMIT_MS) {
    return res.status(429).json({ error: 'Please wait one minute before generating another description for this title.' });
  }
  titleRequests.set(normalizedTitle, now);

  try {
    const description = await generateDescription(title.trim());
    return res.status(200).json({ description, fallback: false });
  } catch (error) {
    const providerError = error.code === 'MISSING_CONFIG'
      ? { status: 503, message: 'AI description generation is not configured. You can write the description manually.' }
      : getProviderError(error);
    console.error('AI description generation unavailable:', providerError.message);
    return res.status(providerError.status).json({
      description: fallbackDescription,
      fallback: true,
      error: providerError.message,
    });
  }
});

module.exports = router;
