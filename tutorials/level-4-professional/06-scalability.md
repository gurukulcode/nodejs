# Lesson 6: Scalability and Load Balancing

## 🎯 Learning Objectives

- Horizontal vs Vertical scaling
- Load balancing strategies
- Clustering in Node.js
- Database scaling
- Caching at scale

---

## Node.js Clustering

```javascript
// server.js
const cluster = require('cluster');
const os = require('os');
const app = require('./app');

if (cluster.isMaster) {
    const cpus = os.cpus().length;

    console.log(`Master ${process.pid} is running`);
    console.log(`Forking ${cpus} workers...`);

    // Fork workers
    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        console.log('Starting a new worker');
        cluster.fork();
    });

} else {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started on port ${PORT}`);
    });
}
```

---

## Nginx Load Balancer

```nginx
http {
    upstream backend {
        least_conn;  # or ip_hash, round_robin

        server 10.0.1.1:3000 weight=3;
        server 10.0.1.2:3000 weight=2;
        server 10.0.1.3:3000 backup;

        keepalive 32;
    }

    server {
        listen 80;

        location / {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Connection "";
        }
    }
}
```

---

## Redis for Distributed Caching

```javascript
const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });

await client.connect();

// Cache middleware
const cache = (ttl = 300) => async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;

    try {
        const cached = await client.get(key);

        if (cached) {
            return res.json(JSON.parse(cached));
        }

        res.sendResponse = res.json;
        res.json = async (body) => {
            await client.setEx(key, ttl, JSON.stringify(body));
            res.sendResponse(body);
        };

        next();
    } catch (err) {
        next();
    }
};

// Cache invalidation
const invalidateCache = async (pattern) => {
    const keys = await client.keys(pattern);
    if (keys.length) {
        await client.del(keys);
    }
};
```

---

## Database Sharding

```javascript
// Horizontal sharding based on user ID
const getShardConnection = (userId) => {
    const shardNumber = userId % NUM_SHARDS;

    return shardConnections[shardNumber];
};

// Usage
const db = getShardConnection(user.id);
const userData = await db.collection('users').findOne({ _id: user.id });
```

---

## Database Read Replicas

```javascript
const mongoose = require('mongoose');

// Primary (write)
const primaryDB = mongoose.createConnection(process.env.PRIMARY_DB_URL);

// Replicas (read)
const replicaDB = mongoose.createConnection(process.env.REPLICA_DB_URL);

// Use primary for writes
const User = primaryDB.model('User', userSchema);

// Use replica for reads
const UserRead = replicaDB.model('User', userSchema);

// Write operation
await User.create({ name: 'John' });

// Read operation
const users = await UserRead.find();
```

---

## Auto-scaling with Kubernetes

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: username/myapp:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: myapp-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

---

## CDN for Static Assets

```javascript
// Serve from CDN in production
const getAssetURL = (path) => {
    if (process.env.NODE_ENV === 'production') {
        return `${process.env.CDN_URL}${path}`;
    }
    return path;
};

// In templates
<img src="<%= getAssetURL('/images/logo.png') %>" />
```

---

## Queue Processing

```javascript
const Bull = require('bull');

const emailQueue = new Bull('emails', {
    redis: process.env.REDIS_URL
});

// Add job
await emailQueue.add({
    to: user.email,
    subject: 'Welcome',
    body: 'Hello!'
});

// Process jobs
emailQueue.process(async (job) => {
    await sendEmail(job.data);
});

// Scale workers
for (let i = 0; i < 5; i++) {
    emailQueue.process(async (job) => {
        await sendEmail(job.data);
    });
}
```

---

## Key Takeaways

✅ Use clustering for multi-core utilization
✅ Implement caching at multiple levels
✅ Use load balancers for distribution
✅ Scale database with replicas and sharding
✅ Leverage CDN for static content
✅ Use message queues for async processing

---

**Congratulations! 🎉**

You've completed all levels of the Node.js tutorial course!

You now have the skills to build production-ready Node.js applications from basic scripts to scalable microservices.

---

## What's Next?

- Build real-world projects
- Contribute to open-source
- Join Node.js communities
- Stay updated with Node.js releases
- Explore advanced topics (GraphQL, gRPC, Deno)

**Happy coding!** 🚀
