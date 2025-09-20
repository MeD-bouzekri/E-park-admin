import express from 'express';
import Zone from '../models/Zone.js';
import Payment from '../models/Payment.js';
import mongoose from 'mongoose';
const router = express.Router();

router.get('/summary', async (req, res) => {
  try {
    const { municipalityId } = req.query;
    const q = municipalityId ? { municipalityId } : {};
    const zones = await Zone.find(q);
    const totalCapacity = zones.reduce((s,z)=> s + (z.capacity||0), 0);
    const activeSessions = zones.reduce((s,z)=> s + (z.occupied||0), 0);
    const occupancyPct = totalCapacity ? Math.round(activeSessions/totalCapacity*100) : 0;
    const start = new Date(); start.setHours(0,0,0,0);
    const match = { createdAt: { $gte: start }, status: 'succeeded' };
    if (municipalityId) match.municipalityId = new mongoose.Types.ObjectId(municipalityId);
    const payAgg = await Payment.aggregate([{ $match: match }, { $group: { _id:null, total: { $sum:'$amount' } } }]);
    res.json({ totalCapacity, activeSessions, occupancyPct, revenueToday: payAgg[0]?.total || 0, openAlerts: 3 });
  } catch (e) { res.status(500).json({ message: e.message }); }
});
export default router;
