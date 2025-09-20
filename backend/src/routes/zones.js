import express from 'express';
import Zone from '../models/Zone.js';
const router = express.Router();
router.get('/', async (req,res)=>{
  const { municipalityId } = req.query;
  const q = municipalityId ? { municipalityId } : {};
  res.json(await Zone.find(q).sort('name'));
});
export default router;
