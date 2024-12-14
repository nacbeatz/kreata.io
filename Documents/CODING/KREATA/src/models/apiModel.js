const mongoose = require('mongoose');

const ApiSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  api: { type: String, required: true },
  apiKey: { type: String, required: true },
  email: { type: String },
  usage: { type: Number, default: 0 }, 
  usage: { type: Number, default: 0 },
  publishedAt: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Apis', ApiSchema);