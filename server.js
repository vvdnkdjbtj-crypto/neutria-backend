import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '15mb' }));

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'neutria-backend',
    message: 'Root route working'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'neutria-backend'
  });
});

app.get('/api/list', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Use POST for this endpoint'
  });
});

app.post('/api/list', async (req, res) => {
  console.log('POST /api/list hit');
  console.log(req.body);

  return res.status(200).json({
    success: true,
    message: 'Backend is working. Shopify is temporarily disabled.',
    received: req.body
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Running on http://0.0.0.0:${PORT}`);
});
