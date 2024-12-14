const mongoose = require('mongoose');

const creditSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  usedCredit:{ type: Number, default: 1}, 
  action: { type: String, required: true },
  remainingCredit:{ type: Number},
  apiUsed: { type: Number}, 
  AddedAt: { type: Date, required: true },
  publishedAt: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('creditLogs', creditSchema);