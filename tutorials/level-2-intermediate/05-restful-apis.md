# Lesson 5: Building RESTful APIs

## 🎯 Learning Objectives

- Understand REST principles
- Design RESTful endpoints
- Implement HATEOAS
- API versioning strategies
- Documentation with Swagger

---

## REST Principles

1. **Stateless** - Each request contains all needed information
2. **Client-Server** - Separation of concerns
3. **Cacheable** - Responses explicitly state cacheability
4. **Uniform Interface** - Standard HTTP methods
5. **Layered System** - Client doesn't know if connected directly

---

## RESTful Endpoint Design

```javascript
// Resource-based URLs
GET    /api/users          // Get all users
GET    /api/users/:id      // Get specific user
POST   /api/users          // Create user
PUT    /api/users/:id      // Update user (full)
PATCH  /api/users/:id      // Update user (partial)
DELETE /api/users/:id      // Delete user

// Nested resources
GET    /api/users/:id/posts       // Get user's posts
POST   /api/users/:id/posts       // Create post for user
GET    /api/posts/:id/comments    // Get post's comments
```

---

## Complete REST API Example

```javascript
const express = require('express');
const router = express.Router();

// GET /api/resources?page=1&limit=10&sort=name
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sort = req.query.sort || 'createdAt';

        const resources = await Resource.find()
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const total = await Resource.countDocuments();

        res.json({
            data: resources,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/resources/:id
router.get('/:id', async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({
                error: 'Resource not found'
            });
        }

        res.json({ data: resource });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/resources
router.post('/', async (req, res) => {
    try {
        const resource = new Resource(req.body);
        await resource.save();

        res.status(201)
            .location(`/api/resources/${resource._id}`)
            .json({ data: resource });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/resources/:id
router.put('/:id', async (req, res) => {
    try {
        const resource = await Resource.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true, overwrite: true }
        );

        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        res.json({ data: resource });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PATCH /api/resources/:id
router.patch('/:id', async (req, res) => {
    try {
        const resource = await Resource.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        res.json({ data: resource });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /api/resources/:id
router.delete('/:id', async (req, res) => {
    try {
        const resource = await Resource.findByIdAndDelete(req.params.id);

        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
```

---

## API Versioning

### URL Versioning
```javascript
app.use('/api/v1/users', usersV1Router);
app.use('/api/v2/users', usersV2Router);
```

### Header Versioning
```javascript
app.use((req, res, next) => {
    const version = req.headers['api-version'] || 'v1';
    req.apiVersion = version;
    next();
});
```

---

## Pagination and Filtering

```javascript
router.get('/products', async (req, res) => {
    const {
        page = 1,
        limit = 10,
        sort = '-createdAt',
        category,
        minPrice,
        maxPrice,
        search
    } = req.query;

    // Build query
    const query = {};

    if (category) query.category = category;
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    const products = await Product.find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
        data: products,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / limit)
        }
    });
});
```

---

## Error Handling

```javascript
class APIError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

const errorHandler = (err, req, res, next) => {
    if (err instanceof APIError) {
        return res.status(err.statusCode).json({
            error: err.message
        });
    }

    console.error(err);
    res.status(500).json({
        error: 'Internal server error'
    });
};

app.use(errorHandler);
```

---

**Next:** [Lesson 6: Validation and Error Handling](./06-validation-errors.md)
