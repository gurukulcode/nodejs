# Lesson 6: Validation and Error Handling

## 🎯 Learning Objectives

- Implement input validation
- Create custom error classes
- Build centralized error handling
- Handle async errors
- Logging best practices

---

## Input Validation with Joi

```bash
npm install joi
```

```javascript
const Joi = require('joi');

// Define schema
const userSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    age: Joi.number().integer().min(18).max(120),
    role: Joi.string().valid('user', 'admin').default('user'),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
    address: Joi.object({
        street: Joi.string(),
        city: Joi.string(),
        zip: Joi.string()
    })
});

// Validation middleware
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({ errors });
        }

        req.body = value;
        next();
    };
};

// Usage
router.post('/users', validate(userSchema), async (req, res) => {
    const user = await User.create(req.body);
    res.status(201).json(user);
});
```

---

## Custom Error Classes

```javascript
// errors/AppError.js
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}

class NotFoundError extends AppError {
    constructor(resource) {
        super(`${resource} not found`, 404);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}

module.exports = {
    AppError,
    ValidationError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError
};
```

---

## Centralized Error Handler

```javascript
// middleware/errorHandler.js
const { AppError } = require('../errors/AppError');

const errorHandler = (err, req, res, next) => {
    // Log error
    console.error('Error:', err);

    // Operational errors
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message
        });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors
        });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(409).json({
            status: 'error',
            message: `${field} already exists`
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid token'
        });
    }

    // Default error
    res.status(500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
```

---

## Async Error Wrapper

```javascript
// utils/asyncHandler.js
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Usage
router.get('/users/:id', asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        throw new NotFoundError('User');
    }

    res.json(user);
}));
```

---

## Logging

```bash
npm install winston
```

```javascript
// config/logger.js
const winston = require('winston');

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

module.exports = logger;

// Usage
logger.info('User created', { userId: user._id });
logger.error('Database error', { error: err.message });
```

---

## Complete Example

```javascript
const express = require('express');
const { asyncHandler } = require('./utils/asyncHandler');
const { NotFoundError, ValidationError } = require('./errors/AppError');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./config/logger');

const app = express();
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('user-agent')
    });
    next();
});

// Routes
app.get('/users/:id', asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        throw new NotFoundError('User');
    }

    res.json(user);
}));

app.post('/users', validate(userSchema), asyncHandler(async (req, res) => {
    const user = await User.create(req.body);
    logger.info('User created', { userId: user._id });
    res.status(201).json(user);
}));

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// Error handler
app.use(errorHandler);

app.listen(3000);
```

---

## Key Takeaways

✅ Validate all input data
✅ Use custom error classes
✅ Centralize error handling
✅ Handle async errors properly
✅ Implement logging
✅ Different errors for different environments

---

**Congratulations!** You've completed Level 2: Intermediate

**Continue to:** [Level 3: Advanced](../level-3-advanced/README.md)
