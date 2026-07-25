import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import askRouter from './routes/ask.js';
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
  // Allow the configured FRONTEND_URL or fall back to allowing all origins for demo convenience
  origin: process.env.FRONTEND_URL || '*',
}));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'MSME AI Copilot API running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', askRouter);

app.listen(PORT, () => {
  console.log(`MSME AI Copilot API running on http://localhost:${PORT}`);
});
