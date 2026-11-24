// src/modules/auth/auth.routes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../../db'); // drizzle db instance
const router = express.Router();

// Load RSA private key for signing JWTs
let privateKey;
try {
  const fs = require('fs');
  const path = require('path');
  const keyPath = process.env.JWT_PRIVATE_KEY_PATH || path.join(__dirname, '..', '..', 'keys', 'private.key');
  privateKey = fs.readFileSync(keyPath, 'utf8');
} catch (err) {
  console.error('Failed to load JWT private key:', err);
  privateKey = null;
}

// Helper to generate JWT
function generateToken(payload) {
  if (!privateKey) throw new Error('Missing private key for JWT');
  return jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '7d' });
}

// Register new user
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  try {
    // Check if email exists
    const existing = await db.select().from('users').where(eq => eq.email.equals(email));
    // Using raw query because drizzle schema not defined; fallback to raw query
    // We'll use db.execute for simplicity
    const { rows } = await db.execute('SELECT id FROM users WHERE email = $1', [email]);
    if (rows.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await db.execute(
      `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, is_active, created_at`,
      [name, email, passwordHash, role || 'CANDIDATE']
    );
    const user = result.rows[0];
    const token = generateToken({ id: user.id, role: user.role, email: user.email });
    res.json({ success: true, data: { token, user } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login existing user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Missing email or password' });
  }
  try {
    const { rows } = await db.execute('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = generateToken({ id: user.id, role: user.role, email: user.email });
    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role, is_active: user.is_active };
    res.json({ success: true, data: { token, user: safeUser } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get current user (protected)
const authenticate = require('../../middleware/auth');
router.get('/me', authenticate, async (req, res) => {
  const userId = req.user.id;
  try {
    const { rows } = await db.execute('SELECT id, name, email, role, is_active, created_at FROM users WHERE id = $1', [userId]);
    const user = rows[0];
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    console.error('Me endpoint error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
