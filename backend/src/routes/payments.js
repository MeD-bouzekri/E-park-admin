import express from 'express';
import Payment from '../models/Payment.js';
import Facility from '../models/Facility.js';
const router = express.Router();
router.get('/recent', async (req,res)=>{
  const { municipalityId, limit=10 } = req.query;
  const q = municipalityId ? { municipalityId } : {};
  const items = await Payment.find(q).sort('-createdAt').limit(Number(limit))
    .populate({ path:'facilityId', model: Facility, select:'name' });
  res.json({ items: items.map(x=>({ ...x.toObject(), facility: x.facilityId ? { name: x.facilityId.name } : null })) });
});
export default router;
