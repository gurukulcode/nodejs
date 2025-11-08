# Lesson 5: Performance Optimization

## 🎯 Learning Objectives

- Caching strategies with Redis
- Database query optimization
- Compression and minification
- Load testing
- Memory management

---

## Redis Caching

```bash
npm install redis
```

```javascript
const redis = require('redis');
const client = redis.createClient({
    url: process.env.REDIS_URL
});

await client.connect();

// Caching middleware
const cache = (duration) => async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;

    try {
        const cached = await client.get(key);

        if (cached) {
            return res.json(JSON.parse(cached));
        }

        res.sendResponse = res.json;
        res.json = async (body) => {
            await client.setEx(key, duration, JSON.stringify(body));
            res.sendResponse(body);
        };

        next();
    } catch (err) {
        next();
    }
};

// Usage
router.get('/users', cache(300), async (req, res) => {
    const users = await User.find();
    res.json(users);
});
```

---

## Database Optimization

```javascript
// Indexing
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ name: 'text' });

// Compound index
postSchema.index({ userId: 1, createdAt: -1 });

// Select only needed fields
const users = await User.find().select('name email');

// Pagination
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;

const users = await User.find()
    .limit(limit)
    .skip((page - 1) * limit)
    .lean(); // Return plain JS objects

// Avoid N+1 queries
const posts = await Post.find().populate('author');
```

---

## Response Compression

```bash
npm install compression
```

```javascript
const compression = require('compression');

app.use(compression({
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    },
    level: 6
}));
```

---

## Load Testing

```bash
npm install --save-dev artillery
```

```yaml
# load-test.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: Warm up
    - duration: 120
      arrivalRate: 50
      name: Sustained load

scenarios:
  - name: 'Get users'
    flow:
      - get:
          url: '/api/users'
```

```bash
artillery run load-test.yml
```

---

## Cluster Mode

```javascript
// server.js
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
    const cpus = os.cpus().length;

    console.log(`Master process ${process.pid} is running`);
    console.log(`Forking ${cpus} workers...`);

    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    const app = require('./app');
    app.listen(3000, () => {
        console.log(`Worker ${process.pid} started`);
    });
}
```

---

**Next:** [Lesson 6: Debugging and Profiling](./06-debugging.md)
