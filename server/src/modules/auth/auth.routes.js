// src/modules/auth/auth.routes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { pool } = require('../../db');
const authenticate = require('../../middleware/auth');

const router = express.Router();

let privateKey;
let publicKey;
try {
  const privPath = process.env.JWT_PRIVATE_KEY_PATH || path.join(__dirname, '..', '..', 'keys', 'private.key');
  const pubPath = process.env.JWT_PUBLIC_KEY_PATH || path.join(__dirname, '..', '..', 'keys', 'public.key');
  privateKey = fs.readFileSync(privPath, 'utf8');
  publicKey = fs.readFileSync(pubPath, 'utf8');
} catch (err) {
  console.error('Failed to load JWT RSA keys:', err);
  privateKey = null;
  publicKey = null;
}

function generateAccessToken(user) {
  if (!privateKey) throw new Error('Missing private key for JWT');
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email, type: 'access' },
    privateKey,
    { algorithm: 'RS256', expiresIn: '2h' }
  );
}

function generateRefreshToken(user) {
  if (!privateKey) throw new Error('Missing private key for JWT');
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email, type: 'refresh' },
    privateKey,
    { algorithm: 'RS256', expiresIn: '7d' }
  );
}

function setRefreshCookie(res, refreshToken) {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function mapUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: (row.role || 'CANDIDATE').toUpperCase(),
    isActive: row.is_active !== false,
    headline: row.headline || '',
    location: row.location || '',
    bio: row.bio || '',
    skills: Array.isArray(row.skills) ? row.skills : (typeof row.skills === 'string' ? JSON.parse(row.skills || '[]') : []),
    phone: row.phone || '',
    portfolio: row.portfolio || '',
    resumeName: row.resume_name || '',
    companyName: row.company_name || '',
    companyId: row.company_id || null,
    createdAt: row.created_at,
  };
}

// POST /api/v1/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, role, companyName, companyWebsite } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const requestedRole = String(role || 'CANDIDATE').trim().toUpperCase();
  const safeRole = requestedRole === 'EMPLOYER' ? 'EMPLOYER' : 'CANDIDATE';

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const existing = await client.query('SELECT id FROM users WHERE LOWER(email) = $1', [normalizedEmail]);
    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const trimmedCompany = companyName ? String(companyName).trim() : null;

    const userRes = await client.query(
      `INSERT INTO users (name, email, password_hash, role, company_name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [String(name).trim(), normalizedEmail, passwordHash, safeRole, trimmedCompany]
    );
    let user = userRes.rows[0];

    if (safeRole === 'EMPLOYER' && trimmedCompany) {
      const existingComp = await client.query(
        'SELECT id, name FROM companies WHERE LOWER(name) = LOWER($1) LIMIT 1',
        [trimmedCompany]
      );
      let companyId;
      if (existingComp.rows.length > 0) {
        companyId = existingComp.rows[0].id;
      } else {
        const compRes = await client.query(
          `INSERT INTO companies (name, website, verification_status, owner_id)
           VALUES ($1, $2, 'PENDING', $3)
           RETURNING id`,
          [trimmedCompany, companyWebsite ? String(companyWebsite).trim() : null, user.id]
        );
        companyId = compRes.rows[0].id;
      }

      const updatedUserRes = await client.query(
        'UPDATE users SET company_id = $1 WHERE id = $2 RETURNING *',
        [companyId, user.id]
      );
      user = updatedUserRes.rows[0];
    }

    await client.query('COMMIT');

    const safeUser = mapUser(user);
    const token = generateAccessToken(safeUser);
    const refreshToken = generateRefreshToken(safeUser);
    setRefreshCookie(res, refreshToken);

    res.status(201).json({ success: true, data: { token, user: safeUser } });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Failed to register account.' });
  } finally {
    client.release();
  }
});

// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE LOWER(email) = $1', [normalizedEmail]);
    const user = rows[0];
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    if (user.is_active === false) {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact support.' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const safeUser = mapUser(user);
    const token = generateAccessToken(safeUser);
    const refreshToken = generateRefreshToken(safeUser);
    setRefreshCookie(res, refreshToken);

    res.json({ success: true, data: { token, user: safeUser } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during sign in.' });
  }
});

// POST /api/v1/auth/refresh
router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken || !publicKey) {
    return res.status(401).json({ success: false, message: 'No refresh token provided.' });
  }

  try {
    const decoded = jwt.verify(refreshToken, publicKey, { algorithms: ['RS256'] });
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ success: false, message: 'Invalid refresh token.' });
    }

    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    const user = rows[0];
    if (!user || user.is_active === false) {
      return res.status(401).json({ success: false, message: 'User session is no longer active.' });
    }

    const safeUser = mapUser(user);
    const newAccessToken = generateAccessToken(safeUser);
    const newRefreshToken = generateRefreshToken(safeUser);
    setRefreshCookie(res, newRefreshToken);

    res.json({ success: true, data: { token: newAccessToken, user: safeUser } });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Refresh token expired or invalid.' });
  }
});

// POST /api/v1/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
  res.json({ success: true, message: 'Logged out successfully.' });
});

// GET /api/v1/auth/me
router.get('/me', authenticate, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = rows[0];
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    if (user.is_active === false) {
      return res.status(403).json({ success: false, message: 'Account suspended.' });
    }
    res.json({ success: true, data: mapUser(user) });
  } catch (err) {
    console.error('Me endpoint error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PUT /api/v1/auth/profile
router.put('/profile', authenticate, async (req, res) => {
  const { name, headline, location, bio, skills, phone, portfolio, resumeName, companyName } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE users
       SET
         name = COALESCE($1, name),
         headline = COALESCE($2, headline),
         location = COALESCE($3, location),
         bio = COALESCE($4, bio),
         skills = COALESCE($5::jsonb, skills),
         phone = COALESCE($6, phone),
         portfolio = COALESCE($7, portfolio),
         resume_name = COALESCE($8, resume_name),
         company_name = COALESCE($9, company_name),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [
        name !== undefined ? String(name).trim() : null,
        headline !== undefined ? String(headline).trim() : null,
        location !== undefined ? String(location).trim() : null,
        bio !== undefined ? String(bio) : null,
        skills !== undefined ? JSON.stringify(Array.isArray(skills) ? skills : []) : null,
        phone !== undefined ? String(phone).trim() : null,
        portfolio !== undefined ? String(portfolio).trim() : null,
        resumeName !== undefined ? String(resumeName).trim() : null,
        companyName !== undefined ? String(companyName).trim() : null,
        req.user.id,
      ]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, data: mapUser(rows[0]) });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
});

module.exports = router;
