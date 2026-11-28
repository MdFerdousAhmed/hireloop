// src/middleware/auth.js
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

let publicKey;
try {
  const keyPath = process.env.JWT_PUBLIC_KEY_PATH || path.join(__dirname, '..', 'keys', 'public.key');
  publicKey = fs.readFileSync(keyPath, 'utf8');
} catch (err) {
  console.error('Failed to load JWT public key for auth middleware:', err);
  publicKey = null;
}

function extractToken(req) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
}

function authenticate(req, res, next) {
  if (!publicKey) {
    return res.status(500).json({ success: false, message: 'Server misconfiguration: JWT public key not available.' });
  }

  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    req.user = {
      ...decoded,
      role: (decoded.role || 'CANDIDATE').toUpperCase(),
    };
    next();
  } catch (err) {
    const status = err.name === 'TokenExpiredError' ? 401 : 403;
    const msg = err.name === 'TokenExpiredError' ? 'Token expired.' : 'Invalid token.';
    return res.status(status).json({ success: false, message: msg });
  }
}

function optionalAuthenticate(req, res, next) {
  const token = extractToken(req);
  if (token && publicKey) {
    try {
      const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
      req.user = {
        ...decoded,
        role: (decoded.role || 'CANDIDATE').toUpperCase(),
      };
    } catch {
      // Ignore invalid optional token
    }
  }
  next();
}

module.exports = authenticate;
module.exports.authenticate = authenticate;
module.exports.optionalAuthenticate = optionalAuthenticate;
module.exports.publicKey = publicKey;
