import express from 'express';
import cors from 'cors';
import { INITIAL_PRODUCTS } from '../src/data/products.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let productsCatalog = [...INITIAL_PRODUCTS];
let ordersDb = [];
let reviewsDb = [
  { id: 1, name: "Aanya Sharma", rating: 5, comment: "The fragrance is beautiful and the packaging feels so premium.", productName: "Vanilla Dream", date: "2026-09-20" }
];

// GET Products
app.get('/api/products', (req, res) => {
  const { category, search, mood } = req.query;
  let results = [...productsCatalog];

  if (category && category !== 'ALL CANDLES') {
    results = results.filter(p => p.category === category);
  }
  if (mood) {
    results = results.filter(p => p.moodCategory === mood);
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(p => p.name.toLowerCase().includes(q) || p.fragrance.toLowerCase().includes(q));
  }

  res.json({ success: true, count: results.length, data: results });
});

// GET Product by ID
app.get('/api/products/:id', (req, res) => {
  const product = productsCatalog.find(p => p.id === Number(req.params.id));
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

// POST New Product (Admin)
app.post('/api/products', (req, res) => {
  const newProduct = { id: Date.now(), ...req.body };
  productsCatalog.unshift(newProduct);
  res.status(201).json({ success: true, data: newProduct });
});

// POST Scent Finder Quiz Recommendation
app.post('/api/scent-finder', (req, res) => {
  const { mood, location, style } = req.body;
  let match = productsCatalog.find(p => p.moodCategory.toLowerCase() === (mood || '').toLowerCase());
  if (!match) match = productsCatalog[0];
  
  res.json({ 
    success: true, 
    match, 
    recommendationText: `Based on your selection of ${mood || 'cozy'} mood and ${style || 'sweet'} style, ${match.name} is your perfect ATHUS match.` 
  });
});

// POST AI Assistant Query
app.post('/api/ai-assistant', (req, res) => {
  const { query } = req.body;
  const q = (query || '').toLowerCase();
  
  let match = productsCatalog[0];
  let responseText = "ATHUS Vanilla Dream is our signature warm fragrance, perfect for any occasion!";

  if (q.includes('relax') || q.includes('bedroom') || q.includes('sleep')) {
    match = productsCatalog.find(p => p.id === 3);
    responseText = "Try ATHUS Lavender Calm. Its floral fragrance is suitable for creating a peaceful atmosphere.";
  } else if (q.includes('gift') && (q.includes('1000') || q.includes('under'))) {
    match = productsCatalog.find(p => p.id === 10);
    responseText = "Our ATHUS Premium Gift Box (₹999) features a luxury trio of mini candles, perfect for thoughtful gifting!";
  }

  res.json({ success: true, response: responseText, recommendedProduct: match });
});

// POST Create Order
app.post('/api/orders', (req, res) => {
  const { customer, items, total, paymentMethod } = req.body;
  const newOrder = {
    id: `ATHUS-${Math.floor(100000 + Math.random() * 900000)}`,
    customer,
    items,
    total,
    paymentMethod,
    status: 'Processing',
    createdAt: new Date().toISOString()
  };
  ordersDb.unshift(newOrder);
  res.status(201).json({ success: true, order: newOrder });
});

app.listen(PORT, () => {
  console.log(`ATHUS CANDLE Backend Server running on port ${PORT}`);
});
