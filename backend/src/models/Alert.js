import { Schema, model, Types } from 'mongoose';
const AlertSchema = new Schema({
  municipalityId: { type: Types.ObjectId, ref: 'Municipality' },
  title: String, category: String,
  severity: { type: String, enum: ['low','med','high'], default: 'low' },
  timeAgo: String
}, { timestamps: true });
export default model('Alert', AlertSchema);
