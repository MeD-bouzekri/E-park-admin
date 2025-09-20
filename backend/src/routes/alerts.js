import express from 'express';
import Alert from '../models/Alert.js';
const router = express.Router();
router.get('/', async (req,res)=>{
  const { municipalityId, limit=20 } = req.query;
  const q = municipalityId ? { municipalityId } : {};
  res.json({ items: await Alert.find(q).sort('-createdAt').limit(Number(limit)) });
});
export default router;
