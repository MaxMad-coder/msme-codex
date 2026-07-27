import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { answerNaturalLanguageQuery } from '../agents/nlQueryAgent.js';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

router.post('/nl-query', async (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query is required and must be a string.' });
  }

  try {
    const answer = await answerNaturalLanguageQuery({ queryText: query });
    res.json({ answer });
  } catch (error) {
    console.error('NL query failed:', error);
    res.status(500).json({ error: 'Unable to process natural language query.' });
  }
});

export default router;
