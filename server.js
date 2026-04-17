import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProduct } from './services/shopify.js';

dotenv.config();

const app = express();

// VERY IMPORTANT FOR RAILWAY
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '15mb' }));

// 🔥 SUPER SIMPLE ROOT (this keeps Railway alive)
app.get('/', (req, res) => {
  res.send('Neutria backend is live 🚀');
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 🔥 MAIN ENDPOINT (this is what your scanner uses)
app.post('/api/list', async (req, res) => {
  try {
    console.log('📦 Incoming product:', req.body);

    const product = await createProduct(req.body);

    res.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('❌ ERROR:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 🔥 CRITICAL LINE (Railway needs this exact format)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Running on port ${PORT}`);
});
