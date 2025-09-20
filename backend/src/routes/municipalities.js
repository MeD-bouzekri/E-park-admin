import express from 'express';
import Municipality from '../models/Municipality.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const { slug } = req.query;
  if (!slug) return res.status(400).json({ error: 'Missing slug' });
  const muni = await Municipality.findOne({ slug });
  if (!muni) return res.status(404).json({ error: 'Municipality not found' });
  res.json(muni);
});

export default router;
