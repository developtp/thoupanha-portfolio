const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');

const Project     = require('./models/Project');
const Message     = require('./models/Message');
const Skill       = require('./models/Skill');
const SocialLinks = require('./models/SocialLinks');
const Fact        = require('./models/Fact');
const Profile     = require('./models/Profile');

const app  = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_ORIGIN || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

const corsOptions = allowedOrigins.length > 0
  ? {
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
      },
    }
  : undefined;

// Express middleware.
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB.
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Admin PIN security helpers.
const ADMIN_PIN = process.env.ADMIN_PIN || '123456';

function generateToken() {
  const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // Token expires in 2 hours
  const payload = JSON.stringify({ admin: true, expiresAt });
  const hmac = crypto.createHmac('sha256', ADMIN_PIN);
  hmac.update(payload);
  const signature = hmac.digest('hex');
  return Buffer.from(JSON.stringify({ payload, signature })).toString('base64');
}

function verifyToken(token) {
  if (!token) return false;
  try {
    const raw = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    const hmac = crypto.createHmac('sha256', ADMIN_PIN);
    hmac.update(raw.payload);
    const expectedSignature = hmac.digest('hex');
    if (crypto.timingSafeEqual(Buffer.from(raw.signature), Buffer.from(expectedSignature))) {
      const payload = JSON.parse(raw.payload);
      if (payload.admin && payload.expiresAt > Date.now()) {
        return true;
      }
    }
  } catch (err) {
    // Ignore and fail
  }
  return false;
}

// Auth guard for protected routes.
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  if (!verifyToken(token)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

// Admin login endpoint.
app.post('/api/admin/login', (req, res) => {
  const { pin } = req.body;
  if (pin === ADMIN_PIN) {
    const token = generateToken();
    res.json({ success: true, token });
  } else {
    res.status(400).json({ success: false, message: 'Invalid PIN' });
  }
});


// Project routes.

app.get('/api/projects', async (req, res) => {
  try {
    res.json(await Project.find().sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/projects', requireAuth, async (req, res) => {
  try {
    const saved = await new Project(req.body).save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/projects/:id', requireAuth, async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Project not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/projects/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Skill routes.

app.get('/api/skills', async (req, res) => {
  try {
    res.json(await Skill.find().sort({ createdAt: 1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/skills', requireAuth, async (req, res) => {
  try {
    const saved = await new Skill(req.body).save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/skills/:id', requireAuth, async (req, res) => {
  try {
    const updated = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Skill not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/skills/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await Skill.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Skill not found' });
    res.json({ message: 'Skill deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Fact routes.

app.get('/api/facts', async (req, res) => {
  try {
    res.json(await Fact.find().sort({ order: 1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/facts', requireAuth, async (req, res) => {
  try {
    const count = await Fact.countDocuments();
    const fact = new Fact({ ...req.body, order: count });
    const saved = await fact.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/facts/reorder', requireAuth, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ message: 'ids must be an array' });
    }
    for (let i = 0; i < ids.length; i++) {
      await Fact.findByIdAndUpdate(ids[i], { order: i });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/facts/:id', requireAuth, async (req, res) => {
  try {
    const updated = await Fact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Fact not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/facts/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await Fact.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Fact not found' });

    // Shift the order of remaining facts to keep it compact
    const remaining = await Fact.find().sort({ order: 1 });
    for (let i = 0; i < remaining.length; i++) {
      remaining[i].order = i;
      await remaining[i].save();
    }

    res.json({ message: 'Fact deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Message routes.

app.post('/api/messages', async (req, res) => {
  try {
    const saved = await new Message(req.body).save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/messages', requireAuth, async (req, res) => {
  try {
    res.json(await Message.find().sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Social link routes.

// GET — returns the single social links document (or empty defaults)
app.get('/api/social', async (req, res) => {
  try {
    const doc = await SocialLinks.findOne();
    res.json(doc || { github: '', linkedin: '', instagram: '' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT — upsert: creates the document on first save, updates it thereafter
app.put('/api/social', requireAuth, async (req, res) => {
  try {
    const updated = await SocialLinks.findOneAndUpdate(
      {},                                       // match the single doc (any)
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Profile routes.

app.get('/api/profile', async (req, res) => {
  try {
    const doc = await Profile.findOne();
    res.json(doc || {
      heroTitle: "Hi, I'm <span class=\"highlight\">Thou Panha</span>",
      heroSubtitle: "A Software Engineering Student & Full-Stack Developer",
      bioIntro: "I am passionate about building modern, responsive, and scalable web applications. My core stack includes React, Node.js, Express, and MongoDB."
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/profile', requireAuth, async (req, res) => {
  try {
    const updated = await Profile.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Start the server.
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
