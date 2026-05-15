import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.get('/', (req, res) => res.json({ status: 'ok', service: 'neutria-backend', version: '3.0' }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.post('/api/scan', async (req, res) => {
  const { imageBase64, imageMimeType = 'image/jpeg', userTitle, userNotes } = req.body;
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: 'No ANTHROPIC_API_KEY' });
  if (!imageBase64) return res.status(400).json({ error: 'No image' });
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-haiku-4-5', max_tokens: 1500,
        system: 'You are Neutria AI. Analyse this product photo. Return ONLY valid JSON: {"title":"string","brand":"string or null","model":"string or null","category":"string","condition":"string","condition_notes":"string","colour":"string","description":"string","suggested_price":number,"retail_price":number,"price_rationale":"string","tags":[],"shipping_estimate":"string","weight_kg":number,"luxury":false,"demand":"High|Medium|Low","confidence":number}. CRITICAL: Price accurately. A £4500 sofa is £4500 not £20.',
        messages: [{ role: 'user', content: [{ type: 'image', source: { type: 'base64', media_type: imageMimeType, data: imageBase64 } }, { type: 'text', text: 'Scan this item.' + (userTitle ? ' User says: ' + userTitle : '') }] }] })
    });
    const d = await r.json();
    if (!r.ok) return res.status(500).json({ error: d.error?.message });
    let raw = d.content[0].text.trim().replace(/```json|```/g, '').trim();
    res.json(JSON.parse(raw));
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/list', async (req, res) => {
  const { title, description, price, retail_price, category, tags, imageBase64, condition, brand, status = 'draft' } = req.body;
  const domain = process.env.SHOPIFY_DOMAIN;
  const token = process.env.SHOPIFY_TOKEN || process.env.SHOPIFY_ACCESS_TOKEN;
  if (!domain || !token) return res.status(500).json({ error: 'Missing Shopify credentials' });
  if (!title || price == null) return res.status(400).json({ error: 'title and price required' });
  try {
    const r = await fetch(`https://${domain}/admin/api/2025-01/products.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ product: { title, body_html: `<p>${description||title}</p><ul><li>Condition: ${condition||'Good'}</li><li>Listed by Neutria</li></ul>`, product_type: category||'Secondhand', vendor: 'Neutria LTD', tags: [...(tags||[]), 'neutria'].join(', '), status, variants: [{ price: String(price), compare_at_price: retail_price ? String(retail_price) : '', inventory_management: 'shopify', inventory_quantity: 1 }], images: imageBase64 ? [{ attachment: imageBase64, filename: `neutria-${Date.now()}.jpg`, alt: title }] : [] } })
    });
    const d = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: d.errors });
    res.json({ success: true, product_id: d.product.id, title: d.product.title, admin_url: `https://${domain}/admin/products/${d.product.id}` });
  } catch(e) { res.status(500).json({ error: e.message }); }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Neutria Backend v3.0 running on port ${PORT}`));
