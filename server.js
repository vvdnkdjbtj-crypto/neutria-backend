import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '15mb' }));

app.get('/', (req, res) => {
  res.status(200).send('Neutria backend is live');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'neutria-backend' });
});

app.get('/api/list', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Use POST for this endpoint' });
});

app.post('/api/list', (req, res) => {
  console.log('POST /api/list hit');
  console.log(req.body);

  res.status(200).json({
    success: true,
    message: 'Backend is working. Shopify temporarily disabled.',
    received: req.body
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Running on port ${PORT}`);
});
