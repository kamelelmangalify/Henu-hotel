const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

// In-memory Fallback Store for Standalone Testing & DB Interface
const inMemoryUsers = [];
const rolesMap = { 1: 'admin', 2: 'hotel_owner', 3: 'guest' };

async function register(req, res) {
  try {
    const { full_name, email, password, phone, role_id } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Full name, email, and password are required.' });
    }

    const emailClean = email.toLowerCase().trim();
    const existing = inMemoryUsers.find(u => u.email === emailClean);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email address already registered.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const assignedRoleId = role_id || 3; // Default: guest
    const roleName = rolesMap[assignedRoleId] || 'guest';

    const newUser = {
      id: 'usr_' + Date.now(),
      full_name,
      email: emailClean,
      password_hash,
      phone: phone || '',
      role_id: assignedRoleId,
      role: roleName,
      created_at: new Date().toISOString()
    };

    inMemoryUsers.push(newUser);

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role, fullName: newUser.full_name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        userId: newUser.id,
        fullName: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
        token
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const emailClean = email.toLowerCase().trim();
    const user = inMemoryUsers.find(u => u.email === emailClean);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, fullName: user.full_name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      message: 'Login successful.',
      data: {
        userId: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        token
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getProfile(req, res) {
  const user = inMemoryUsers.find(u => u.id === req.user.userId);
  if (!user) {
    return res.json({ success: true, data: req.user });
  }
  return res.json({
    success: true,
    data: {
      userId: user.id,
      fullName: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      created_at: user.created_at
    }
  });
}

module.exports = {
  register,
  login,
  getProfile
};
