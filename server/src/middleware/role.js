// src/middleware/role.js
/**
 * Role‑check middleware.
 * Usage: roleCheck(['ADMIN'])
 */
const roleCheck = (allowedRoles) => (req, res, next) => {
  const { role } = req.user || {};
  if (!role) {
    return res.status(401).json({ success: false, message: 'Unauthenticated' });
  }
  if (!allowedRoles.includes(role)) {
    return res.status(403).json({ success: false, message: 'Forbidden – insufficient role' });
  }
  next();
};

module.exports = roleCheck;
