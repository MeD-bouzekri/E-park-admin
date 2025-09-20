import { Schema, model, Types } from 'mongoose';
const PaymentSchema = new Schema({
  municipalityId: { type: Types.ObjectId, ref: 'Municipality' },
  facilityId: { type: Types.ObjectId, ref: 'Facility' },
  amount: Number, method: { type: String, default: 'Wallet' },
  status: { type: String, default: 'succeeded' },
  minutes: Number, plate: String
}, { timestamps: true });
export default model('Payment', PaymentSchema);
