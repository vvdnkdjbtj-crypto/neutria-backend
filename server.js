import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProduct } from './services/shopify.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '15mb' }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

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
  try {
    const {
      title,
      description,
      price,
      category,
      tags,
      imageBase64,
      imageMimeType
    } = req.body;

    if (!title || price === undefined || price === null) {
      return res.status(400).json({
        error: 'title and price are required'
      });
    }

    const product = await createProduct({
      title,
      description,
      price,
      category,
      tags,
      imageBase64,
      imageMimeType
    });

    return res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('POST /api/list failed:', error);
    return res.status(500).json({
      error: error.message || 'Failed to create product'
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Running on http://0.0.0.0:${PORT}`);
});
