// backend/models/ShortLink.js
import mongoose from 'mongoose';

const ShortLinkSchema = new mongoose.Schema({
  originalLink: { type: String, required: true },
  shortLink: { type: String, required: true, unique: true },
  remarks: { type: String, required: true },
  expirationDate: { type: Date, required: false },
  clicks: { type: Number, default: 0 },
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now },
});

const ShortLink = mongoose.model('ShortLink', ShortLinkSchema);

export default ShortLink;
