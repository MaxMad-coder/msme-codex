import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { seedDatabase } from './seed/seedData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

try {
  await seedDatabase();
} catch (error) {
  console.error('Database initialization failed:', error);
  process.exit(1);
}

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
}));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'MSME AI Copilot API running',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/ask', (_req, res) => {
  res.json({
    message: 'Endpoint not yet implemented. Build agents first.',
    status: 'pending',
  });
});

app.listen(PORT, () => {
  console.log(`MSME AI Copilot API running on http://localhost:${PORT}`);
});
