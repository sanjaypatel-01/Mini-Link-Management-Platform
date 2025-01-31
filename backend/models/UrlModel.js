import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  originalLink: { type: String, required: true },
  shortLink: { type: String, required: true, unique: true },
  remarks: { type: String, required: true },
  expirationDate: { type: Date, index: { expires: '0' }, default: null },
  clicks: [{  
    ip: { type: String },  
    device: { type: String, enum: ["Mobile", "Desktop", "Tablet", "Unknown"], default: "Unknown" },  
    timestamp: { type: Date, default: Date.now }  
  }], 
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" } 
});

const Url = mongoose.model('Url', urlSchema);
export default Url;

