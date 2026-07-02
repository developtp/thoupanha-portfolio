const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  techStack: { type: [String], default: [] }, // Array of keys: ["react", "mongodb", "express"]
  category: { type: String, default: 'Full Stack Project' }, // Editable label shown on the card
  imageUrl: String,  // Holds base64 string or simple web link
  link: String,      // Live Demo URL
  repoLink: String   // GitHub Repo URL
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
