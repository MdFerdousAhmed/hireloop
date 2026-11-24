// src/middleware/auth.js
// Authentication middleware for HireLoop backend.
// Verifies JWTs signed with RSA private key (RS256) and attaches the decoded payload to req.user.
// Expects the token in the Authorization header as "Bearer <token>".
// Uses the PUBLIC key file path defined in env var JWT_PUBLIC_KEY_PATH.

const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// Load public key synchronously on module load (cached for all requests)
let publicKey;
try {
  const keyPath = process.env.JWT_PUBLIC_KEY_PATH || path.join(__dirname, '..', 'keys', 'public.key');
  publicKey = fs.readFileSync(keyPath, 'utf8');
} catch (err) {
  console.error('Failed to load JWT public key for auth middleware:', err);
  // In production this would crash the process; for development we allow startup to continue.
  publicKey = null;
}

/**
 * Express middleware to protect routes.
 * If verification fails, responds with 401 (missing/invalid) or 403 (invalid token).
 */
function authenticate(req, res, next) {
  if (!publicKey) {
    return res.status(500).json({ message: 'Server misconfiguration: JWT public key not available.' });
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    req.user = decoded; // Attach payload (e.g., id, role, email)
    next();
  } catch (err) {
    const status = err.name === 'TokenExpiredError' ? 401 : 403;
    const msg = err.name === 'TokenExpiredError' ? 'Token expired.' : 'Invalid token.';
    return res.status(status).json({ message: msg });
  }
}

module.exports = authenticate;
