import { Schema, model, Types } from 'mongoose';
const ZoneSchema = new Schema({
  municipalityId: { type: Types.ObjectId, ref: 'Municipality', index: true },
  code: String, name: String, capacity: Number,
  occupied: { type: Number, default: 0 },
  revenueToday: { type: Number, default: 0 }
}, { timestamps: true });
export default model('Zone', ZoneSchema);
