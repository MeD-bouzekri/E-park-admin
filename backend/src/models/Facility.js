import { Schema, model, Types } from 'mongoose';
const FacilitySchema = new Schema({
  municipalityId: { type: Types.ObjectId, ref: 'Municipality', index: true },
  zoneId: { type: Types.ObjectId, ref: 'Zone', index: true },
  code: String, name: String,
  location: { type: { type: String, default: 'Point' }, coordinates: [Number] },
  capacity: Number, occupied: { type: Number, default: 0 },
  pricePerHour: { type: Number, default: 100 },
  sensorCount: { type: Number, default: 0 },
  health: { type: String, enum: ['ok','warn','error'], default: 'ok' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
export default model('Facility', FacilitySchema);
