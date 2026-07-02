const mongoose = require('mongoose');

// Stores a single document with all social link URLs.
// Use findOne() / findOneAndUpdate() with upsert to treat it as a singleton config.
const SocialLinksSchema = new mongoose.Schema({
  github:    { type: String, default: '' },
  linkedin:  { type: String, default: '' },
  instagram: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('SocialLinks', SocialLinksSchema);
