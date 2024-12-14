const mongoose = require('mongoose');

const SubSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  plan: { type: String, enum: ['free', 'Pro', 'Entreprise'], default: 'free' },
  subscribedAt: { type: Date },
  usage: { type: Number, default: 0 },
  credits: { type: Number, default: 2 },
  creditsExpireAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Subscriptions', SubSchema);
