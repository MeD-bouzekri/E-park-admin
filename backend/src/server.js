import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './db.js';
import Municipality from './models/Municipality.js';
import Zone from './models/Zone.js';
import Facility from './models/Facility.js';
import dashboard from './routes/dashboard.js';
import zones from './routes/zones.js';
import facilities from './routes/facilities.js';
import payments from './routes/payments.js';
import alerts from './routes/alerts.js';
import municipalities from './routes/municipalities.js';

const app = express();
const PORT = Number(process.env.PORT || 8080);
const allowOrigin = process.env.ALLOW_ORIGIN || 'http://localhost:5173';

app.use(helmet());
app.use(cors({ origin: allowOrigin }));
app.use(express.json());
app.use(morgan('dev'));

await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/parkdz');
app.get('/health', (_req,res)=>res.json({ ok:true }));

app.get('/ensure-demo', async (_req,res)=>{
  let muni = await Municipality.findOne({ slug:'demo' });
  if (!muni) {
    muni = await Municipality.create({ name:'Demo City', slug:'demo' });
    const z = await Zone.create({ municipalityId: muni._id, code:'Z-1', name:'Center', capacity:300, occupied:64, revenueToday:120000 });
    await Facility.create({ municipalityId: muni._id, zoneId: z._id, code:'P-1', name:'Main Lot',
      location:{ type:'Point', coordinates:[3.06,36.75] }, capacity:120, occupied:64, pricePerHour:150, sensorCount:240, health:'ok' });
  }
  res.json({ ok:true, id:String(muni._id) });
});

app.use('/api/dashboard', dashboard);
app.use('/api/zones', zones);
app.use('/api/facilities', facilities);
app.use('/api/payments', payments);
app.use('/api/alerts', alerts);
app.use('/api/municipalities', municipalities);

app.listen(PORT, ()=> console.log(`[server] http://localhost:${PORT}`));
