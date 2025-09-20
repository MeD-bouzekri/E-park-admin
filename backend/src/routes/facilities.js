import express from 'express';
import Facility from '../models/Facility.js';
import Zone from '../models/Zone.js';
const router = express.Router();
router.get('/', async (req,res)=>{
  const { municipalityId } = req.query;
  const q = municipalityId ? { municipalityId } : {};
  const items = await Facility.find(q).populate({ path:'zoneId', model: Zone, select:'name code' });
  res.json(items.map(it=>({ ...it.toObject(), zone: it.zoneId ? { name: it.zoneId.name, code: it.zoneId.code } : null })));
});
export default router;
