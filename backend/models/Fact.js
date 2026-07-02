const mongoose = require('mongoose');

const FactSchema = new mongoose.Schema({
  icon: { type: String, trim: true, default: '' },
  headline: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Fact', FactSchema);
