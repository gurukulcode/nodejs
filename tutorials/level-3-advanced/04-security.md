# Lesson 4: Security Best Practices

## 🎯 Learning Objectives

- OWASP Top 10 for Node.js
- Input validation and sanitization
- SQL injection and NoSQL injection prevention
- XSS and CSRF protection
- Security headers with Helmet

---

## Security Headers with Helmet

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');

app.use(helmet());

// Or configure individually
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:']
    }
}));
```

---

## Input Validation

```javascript
const Joi = require('joi');
const validator = require('validator');

// Sanitize inputs
const sanitizeInput = (input) => {
    return validator.escape(input.trim());
};

// Validate and sanitize
const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    website: Joi.string().uri()
});
```

---

## Preventing NoSQL Injection

```javascript
// ❌ VULNERABLE
const user = await User.findOne({
    email: req.body.email,
    password: req.body.password
});

// ✅ SAFE - Use proper validation
const { email, password } = req.body;

if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid input' });
}

const user = await User.findOne({ email });
if (user && await user.comparePassword(password)) {
    // Login successful
}

// Use mongoose-sanitize
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());
```

---

## XSS Protection

```bash
npm install xss-clean
```

```javascript
const xss = require('xss-clean');

app.use(xss());

// Manual sanitization
const xss = require('xss');
const clean = xss(userInput);
```

---

## Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests',
    standardHeaders: true,
    legacyHeaders: false
});

app.use('/api/', limiter);

// Stricter limit for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true
});

app.use('/api/auth/', authLimiter);
```

---

## CSRF Protection

```bash
npm install csurf
```

```javascript
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.get('/form', csrfProtection, (req, res) => {
    res.render('form', { csrfToken: req.csrfToken() });
});

app.post('/submit', csrfProtection, (req, res) => {
    // Process form
});
```

---

## Secure Password Storage

```javascript
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Password hashing
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 12);
};

// Password reset token
const generateResetToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

const hashResetToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};
```

---

## Environment Variables

```javascript
// ❌ WRONG
const apiKey = 'hardcoded-api-key';

// ✅ CORRECT
require('dotenv').config();
const apiKey = process.env.API_KEY;

// Validate environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'API_KEY'];

requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
    }
});
```

---

## Secure HTTP Headers

```javascript
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});
```

---

## File Upload Security

```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});
```

---

## Key Takeaways

✅ Use Helmet for security headers
✅ Validate and sanitize all inputs
✅ Implement rate limiting
✅ Prevent injection attacks
✅ Use HTTPS in production
✅ Keep dependencies updated

---

**Next:** [Lesson 5: Performance Optimization](./05-performance.md)
