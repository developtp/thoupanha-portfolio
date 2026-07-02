const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  heroTitle: { type: String, default: "Hi, I'm <span class=\"highlight\">Thou Panha</span>" },
  heroSubtitle: { type: String, default: "A Software Engineering Student & Full-Stack Developer" },
  bioIntro: { type: String, default: "I am passionate about building modern, responsive, and scalable web applications. My core stack includes React, Node.js, Express, and MongoDB." }
});

module.exports = mongoose.model('Profile', ProfileSchema);
