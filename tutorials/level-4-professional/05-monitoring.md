# Lesson 5: Monitoring and Logging

## 🎯 Learning Objectives

- Application monitoring with Prometheus
- Centralized logging with ELK Stack
- Error tracking with Sentry
- Performance monitoring
- Alerting and notifications

---

## Prometheus Metrics

```bash
npm install prom-client
```

```javascript
const client = require('prom-client');
const express = require('express');

const app = express();

// Create a Registry
const register = new client.Registry();

// Add default metrics
client.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);

// Middleware to track metrics
app.use((req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;

        httpRequestDuration
            .labels(req.method, req.route?.path || req.path, res.statusCode)
            .observe(duration);

        httpRequestTotal
            .labels(req.method, req.route?.path || req.path, res.statusCode)
            .inc();
    });

    next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});
```

---

## Winston Logger

```javascript
const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: {
        service: 'myapp',
        environment: process.env.NODE_ENV
    },
    transports: [
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),
        new winston.transports.File({
            filename: 'logs/combined.log'
        }),
        new ElasticsearchTransport({
            level: 'info',
            clientOpts: { node: process.env.ELASTICSEARCH_URL }
        })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

module.exports = logger;
```

---

## Sentry Error Tracking

```bash
npm install @sentry/node
```

```javascript
const Sentry = require('@sentry/node');

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0
});

// Request handler (first middleware)
app.use(Sentry.Handlers.requestHandler());

// All your routes here

// Error handler (last middleware)
app.use(Sentry.Handlers.errorHandler());

app.use((err, req, res, next) => {
    Sentry.captureException(err);
    res.status(500).json({ error: 'Internal server error' });
});
```

---

## Application Performance Monitoring

```bash
npm install newrelic
```

```javascript
// newrelic.js
exports.config = {
    app_name: ['My Application'],
    license_key: process.env.NEW_RELIC_LICENSE_KEY,
    distributed_tracing: {
        enabled: true
    },
    logging: {
        level: 'info'
    }
};

// index.js (must be first import)
require('newrelic');
const express = require('express');
// ...
```

---

## Custom Dashboard with Grafana

```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana

volumes:
  prometheus-data:
  grafana-data:
```

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'nodejs-app'
    static_configs:
      - targets: ['app:3000']
```

---

## Alerting

```javascript
// utils/alerts.js
const axios = require('axios');

const sendSlackAlert = async (message) => {
    await axios.post(process.env.SLACK_WEBHOOK_URL, {
        text: message,
        username: 'App Monitor',
        icon_emoji: ':warning:'
    });
};

const checkHealthAndAlert = async () => {
    try {
        await axios.get('http://localhost:3000/health');
    } catch (err) {
        await sendSlackAlert(`🚨 Health check failed: ${err.message}`);
    }
};

setInterval(checkHealthAndAlert, 60000); // Every minute
```

---

**Next:** [Lesson 6: Scalability](./06-scalability.md)
