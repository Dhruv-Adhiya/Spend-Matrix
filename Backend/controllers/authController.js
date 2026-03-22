const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { createDefaultSettings } = require('../services/settingsService');
const { forgotPassword, resetPassword } = require('../services/authService');
const { sendWelcomeEmail } = require('../services/emailService');
const { checkAndHandleDevice } = require('../services/deviceService');

const register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      'INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING id, full_name, email, created_at',
      [full_name, email, hashedPassword]
    );

    await createDefaultSettings(newUser.rows[0].id);

    try {
      await sendWelcomeEmail(email, full_name);
    } catch (err) {
      console.error('Welcome email failed:', err.message);
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.rows[0].id, email: user.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user.rows[0];

    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Fire-and-forget — must not block login
    checkAndHandleDevice(user.rows[0].id, user.rows[0].email, userAgent, ip).catch(
      (err) => console.error('Device check failed:', err.message)
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const forgotPasswordHandler = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    await forgotPassword(email);
    res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const resetPasswordHandler = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: 'Token and new password are required' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

    await resetPassword(token, newPassword);
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    if (error.message === 'INVALID_TOKEN' || error.message === 'TOKEN_USED') {
      return res.status(400).json({ error: 'Invalid or already used reset token' });
    }
    if (error.message === 'TOKEN_EXPIRED') {
      return res.status(400).json({ error: 'Reset token has expired' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { register, login, forgotPasswordHandler, resetPasswordHandler };
