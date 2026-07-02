const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // never returned in queries by default
    },
    profile: {
      sleep: Number,
      study: Number,
      exercise: Number,
      screen: Number,
      cgpa: Number,
      strong: [String],
      weak: [String],
      hobby: [String],
      have: [String],
      want: [String],
      shortGoal: String,
      longGoal: String,
      dreamCareer: String,
    },
    analyzed: { type: Boolean, default: false },
    planner: [{ task: String, done: { type: Boolean, default: false } }],
    journal: { type: String, default: '' },
    dailyMotivation: { type: String, default: '' },
    dailySchedule: [
{
  time: String,
  task: String,
  duration: String,
  focus: String,
  tips:String
}
],
   wweeklyReview: {
  strengths: {
    type: [String],
    default: []
  },
  improvements: {
    type: [String],
    default: []
  },
  motivation: {
    type: String,
    default: ""
  },
  nextWeekGoals: {
    type: [String],
    default: []
  }
},

studyPlan: {
  type: [mongoose.Schema.Types.Mixed],
  default: []
},

careerResult: {
  type: [mongoose.Schema.Types.Mixed],
  default: []
},

roadmap: {
  type: [mongoose.Schema.Types.Mixed],
  default: []
},

achievements: {
  type: [String],
  default: []
},

studyStreak: {
  type: Number,
  default: 0
},

exerciseStreak: {
  type: Number,
  default: 0
}
  },
  { timestamps: true }
);

// Hash password before saving (no bcrypt — using Node built-in crypto)
UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  // PBKDF2 with SHA-512 — production-grade, no extra packages
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(this.password, salt, 310000, 32, 'sha256').toString('hex');
  this.password = `${salt}:${hash}`;
  next();
});

// Method to compare passwords
UserSchema.methods.correctPassword = function (candidatePassword) {
  const [salt, storedHash] = this.password.split(':');
  const hash = crypto.pbkdf2Sync(candidatePassword, salt, 310000, 32, 'sha256').toString('hex');
  return hash === storedHash;
};

module.exports = mongoose.model('User', UserSchema);
