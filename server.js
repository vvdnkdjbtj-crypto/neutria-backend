import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '15mb' }));

const SHOP = process.env.SHOPIFY_STORE_NAME;
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

app.get('/', (req, res) => {
  res.send('Neutria backend is live');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/list', async (req, res) => {
  try {
    const { title, price, image } = req.body;

    const response = await fetch(
      `https://${SHOP}.myshopify.com/admin/api/2023-10/products.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: {
            title: title,
            variants: [{ price: price }],
            images: image ? [{ src: image }] : [],
          },
        }),
      }
    );

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Running on http://0.0.0.0:${PORT}`);
});
