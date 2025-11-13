# Lesson 1: Authentication & Authorization

## 🎯 Learning Objectives

- Implement JWT authentication
- Session-based authentication
- OAuth 2.0 integration
- Role-based access control (RBAC)
- Password hashing and security

---

## Password Hashing with bcrypt

```bash
npm install bcrypt
```

```javascript
const bcrypt = require('bcrypt');

// Hash password
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Verify password
const verifyPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

// In User model
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};
```

---

## JWT Authentication

```bash
npm install jsonwebtoken
```

```javascript
// utils/jwt.js
const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '30d'
    });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, generateRefreshToken, verifyToken };
```

```javascript
// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, generateRefreshToken } = require('../utils/jwt');

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // Create user
        const user = await User.create({ email, password, name });

        // Generate tokens
        const token = generateToken({ userId: user._id });
        const refreshToken = generateRefreshToken({ userId: user._id });

        res.status(201).json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            },
            token,
            refreshToken
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate tokens
        const token = generateToken({ userId: user._id, role: user.role });
        const refreshToken = generateRefreshToken({ userId: user._id });

        res.json({ token, refreshToken });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
```

---

## Authentication Middleware

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Attach user to request
        req.user = user;
        next();

    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authenticate;
```

---

## Role-Based Access Control

```javascript
// middleware/authorize.js
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Forbidden - Insufficient permissions'
            });
        }

        next();
    };
};

// Usage
router.get('/admin/users',
    authenticate,
    authorize('admin'),
    async (req, res) => {
        const users = await User.find();
        res.json(users);
    }
);

router.post('/posts',
    authenticate,
    authorize('admin', 'editor'),
    async (req, res) => {
        // Create post
    }
);
```

---

## Session-Based Authentication

```bash
npm install express-session connect-mongo
```

```javascript
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 14 * 24 * 60 * 60 // 14 days
    }),
    cookie: {
        maxAge: 14 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    }
}));

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && await user.comparePassword(password)) {
        req.session.userId = user._id;
        req.session.role = user.role;
        res.json({ message: 'Logged in successfully' });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Session middleware
const requireSession = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Please log in' });
    }
    next();
};
```

---

## OAuth 2.0 with Passport

```bash
npm install passport passport-google-oauth20
```

```javascript
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            user = await User.create({
                googleId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName
            });
        }

        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));

// Routes
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        const token = generateToken({ userId: req.user._id });
        res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
    }
);
```

---

## Refresh Token Implementation

```javascript
// Store refresh tokens in database
const refreshTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    token: String,
    expiresAt: Date,
    createdAt: { type: Date, default: Date.now }
});

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

// Refresh token route
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Check if token exists in database
        const storedToken = await RefreshToken.findOne({
            userId: decoded.userId,
            token: refreshToken
        });

        if (!storedToken) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        // Generate new access token
        const newToken = generateToken({ userId: decoded.userId });

        res.json({ token: newToken });
    } catch (err) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
});

// Logout - invalidate refresh token
router.post('/logout', authenticate, async (req, res) => {
    await RefreshToken.deleteMany({ userId: req.user._id });
    res.json({ message: 'Logged out successfully' });
});
```

---

## Two-Factor Authentication

```bash
npm install speakeasy qrcode
```

```javascript
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// Enable 2FA
router.post('/2fa/enable', authenticate, async (req, res) => {
    const secret = speakeasy.generateSecret({
        name: `MyApp (${req.user.email})`
    });

    req.user.twoFactorSecret = secret.base32;
    req.user.twoFactorEnabled = false;
    await req.user.save();

    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    res.json({ qrCode, secret: secret.base32 });
});

// Verify and activate 2FA
router.post('/2fa/verify', authenticate, async (req, res) => {
    const { token } = req.body;

    const verified = speakeasy.totp.verify({
        secret: req.user.twoFactorSecret,
        encoding: 'base32',
        token
    });

    if (verified) {
        req.user.twoFactorEnabled = true;
        await req.user.save();
        res.json({ message: '2FA enabled successfully' });
    } else {
        res.status(400).json({ error: 'Invalid token' });
    }
});
```

---

## Key Takeaways

✅ Always hash passwords with bcrypt
✅ Use JWT for stateless authentication
✅ Implement refresh tokens for long-lived sessions
✅ Use RBAC for authorization
✅ Support OAuth for social login
✅ Consider 2FA for sensitive applications

---

**Next:** [Lesson 2: Real-time Applications](./02-realtime-applications.md)
