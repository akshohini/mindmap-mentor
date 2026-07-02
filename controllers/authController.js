const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper: create & send JWT
function sendToken(user, statusCode, res) {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  // Set as HTTP-only cookie (more secure than localStorage)
  res.setHeader(
    'Set-Cookie',
    `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`
  );

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      profile: user.profile,
      analyzed: user.analyzed,
    },
  });
}

// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const user = await User.create({ name, email, password });
    sendToken(user, 201, res);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already in use.' });
    }
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors).map(e => e.message).join('. ');
      return res.status(400).json({ success: false, message: msg });
    }
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    // Explicitly select password (excluded by default in schema)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !user.correctPassword(password)) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
    }

    sendToken(user, 200, res);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// @route   POST /api/auth/logout
exports.logout = (req, res) => {
  res.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax');
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

// @route   GET /api/auth/me  (protected)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        analyzed: user.analyzed,
        planner: user.planner || [],
        journal: user.journal || '',
        dailyMotivation: user.dailyMotivation || '',
        dailySchedule: user.dailySchedule || [],
        weeklyReview: user.weeklyReview || '',
        planner: user.planner || [],
        journal: user.journal || '',
        dailyMotivation: user.dailyMotivation || '',
        dailySchedule: user.dailySchedule || [],
        weeklyReview: user.weeklyReview || '',
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @route   PUT /api/auth/profile  (protected)
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        profile: req.body.profile || {},
        analyzed: req.body.analyzed ?? false,
        planner: req.body.planner || [],
        journal: req.body.journal || '',
        dailyMotivation: req.body.dailyMotivation || '',
        dailySchedule: req.body.dailySchedule || [],
        weeklyReview: req.body.weeklyReview || '',
      },
      { new: true, runValidators: false }
    );
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        analyzed: user.analyzed,
        planner: user.planner || [],
        journal: user.journal || '',
        dailyMotivation: user.dailyMotivation || '',
        dailySchedule: user.dailySchedule || [],
        weeklyReview: user.weeklyReview || '',
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not update profile.' });
  }
};
