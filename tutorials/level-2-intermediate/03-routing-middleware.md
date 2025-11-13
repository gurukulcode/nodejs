# Lesson 3: Advanced Routing and Middleware

## 🎯 Learning Objectives

- Master route organization patterns
- Create custom middleware chains
- Implement authentication and authorization
- Handle file uploads
- Request validation

---

## Router Patterns

### Nested Routers

```javascript
// routes/api/index.js
const express = require('express');
const router = express.Router();
const usersRouter = require('./users');
const postsRouter = require('./posts');

router.use('/users', usersRouter);
router.use('/posts', postsRouter);

module.exports = router;

// app.js
app.use('/api/v1', require('./routes/api'));
```

### Route Chaining

```javascript
router.route('/users/:id')
    .get((req, res) => {
        // Get user
    })
    .put((req, res) => {
        // Update user
    })
    .delete((req, res) => {
        // Delete user
    });
```

---

## Middleware Patterns

### Middleware Stack

```javascript
const validateUser = (req, res, next) => {
    if (!req.body.email) {
        return res.status(400).json({ error: 'Email required' });
    }
    next();
};

const checkDuplicate = async (req, res, next) => {
    const exists = await User.findOne({ email: req.body.email });
    if (exists) {
        return res.status(409).json({ error: 'Email exists' });
    }
    next();
};

app.post('/users', [validateUser, checkDuplicate], (req, res) => {
    // Create user
});
```

### Request Validation

```bash
npm install joi
```

```javascript
const Joi = require('joi');

const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        next();
    };
};

const userSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    age: Joi.number().integer().min(18)
});

app.post('/users', validateRequest(userSchema), (req, res) => {
    res.json({ success: true });
});
```

---

## File Uploads

```bash
npm install multer
```

```javascript
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only images allowed'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: fileFilter
});

// Single file
app.post('/upload', upload.single('avatar'), (req, res) => {
    res.json({ file: req.file });
});

// Multiple files
app.post('/upload-multiple', upload.array('photos', 5), (req, res) => {
    res.json({ files: req.files });
});
```

---

## Authentication Middleware

```javascript
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    };
};

app.get('/admin', [authenticate, authorize('admin')], (req, res) => {
    res.json({ message: 'Admin access granted' });
});
```

---

## Rate Limiting

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests'
});

app.use('/api/', limiter);
```

---

**Next:** [Lesson 4: Working with Databases](./04-databases.md)
