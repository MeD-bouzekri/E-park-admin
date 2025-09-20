import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../src/db.js';
import Municipality from '../src/models/Municipality.js';
import Zone from '../src/models/Zone.js';
import Facility from '../src/models/Facility.js';
import Payment from '../src/models/Payment.js';
import Alert from '../src/models/Alert.js';

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/parkdz';

async function main() {
  await connectDB(MONGO);

  let muni = await Municipality.findOne({ slug: 'demo' });
  if (!muni) muni = await Municipality.create({ name: 'Demo City', slug: 'demo' });

  const z1 = await Zone.findOneAndUpdate(
    { municipalityId: muni._id, code: 'Z-1' },
    { $setOnInsert: { name: 'Center', capacity: 300, occupied: 64, revenueToday: 120000 } },
    { upsert: true, new: true }
  );

  await Facility.findOneAndUpdate(
    { municipalityId: muni._id, code: 'P-1' },
    {
      $setOnInsert: {
        zoneId: z1._id,
        name: 'Main Lot',
        location: { type: 'Point', coordinates: [3.06, 36.75] },
        capacity: 120,
        occupied: 64,
        pricePerHour: 150,
        sensorCount: 240,
        health: 'ok',
        isActive: true
      }
    },
    { upsert: true, new: true }
  );

  const start = new Date(); start.setHours(0,0,0,0);
  await Payment.deleteMany({ municipalityId: muni._id, createdAt: { $gte: start } });
  await Payment.insertMany([
    { municipalityId: muni._id, amount: 147.5, method: 'wallet', status: 'succeeded', minutes: 59, plate: '16-AB-3421' },
    { municipalityId: muni._id, amount: 64, method: 'card', status: 'succeeded', minutes: 32, plate: '16-CC-9012' }
  ]);

  await Alert.deleteMany({ municipalityId: muni._id });
  await Alert.insertMany([
    { municipalityId: muni._id, title: 'Camera offline – P-SOU-004 lane 2', category: 'sensor', severity: 'high', timeAgo: '2m ago' },
    { municipalityId: muni._id, title: 'Payment gateway retry spikes (3%)', category: 'payment', severity: 'med', timeAgo: '14m ago' },
    { municipalityId: muni._id, title: 'Expired session – plate 16-12345', category: 'enforcement', severity: 'low', timeAgo: '22m ago' }
  ]);

  console.log('Seeded demo data ✅');
}

main().catch(e=>{ console.error(e); process.exitCode=1; }).finally(async ()=>{ await mongoose.disconnect(); });
