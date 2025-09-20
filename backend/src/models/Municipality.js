import { Schema, model } from 'mongoose';
const MunicipalitySchema = new Schema({ name: String, slug: { type: String, unique: true } }, { timestamps: true });
export default model('Municipality', MunicipalitySchema);
