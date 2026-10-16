import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import lookupRouter from './routes/lookup.js';
import resultsRouter from './routes/results.js';
import addPollingUnitRouter from './routes/addPollingUnit.js';






dotenv.config();

const app = express();

const allowed = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);



app.use(cors({
    origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowed.length === 0) return cb(null, true);
    if (allowed.includes(origin)) return cb(null, true);
    return cb(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: false

}));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'bincom-election-api' });
});

app.use('/api', lookupRouter);
app.use('/api', resultsRouter);
app.use('/api', addPollingUnitRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});