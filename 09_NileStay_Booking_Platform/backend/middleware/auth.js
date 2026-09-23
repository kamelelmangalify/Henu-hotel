const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'nilestay_secret_jwt_key_2026_super_secure';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. Authorization token required.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
    req.user = user;
    next();
  });
}

function requireRole(...roles) {
  const allowed = Array.isArray(roles[0]) ? roles[0] : roles;
  return (req, res, next) => {
    if (!req.user || !allowed.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied. Insufficient privileges.' });
    }
    next();
  };
}

module.exports = {
  authenticate: authenticateToken,
  authenticateToken,
  requireRole,
  JWT_SECRET
};
