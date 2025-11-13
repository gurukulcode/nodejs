# Lesson 1: Microservices Architecture

## 🎯 Learning Objectives

- Understand microservices architecture
- Service communication patterns
- API Gateway implementation
- Service discovery
- Event-driven architecture

---

## Microservices Principles

1. **Single Responsibility** - One service, one business capability
2. **Autonomous** - Independently deployable
3. **Decentralized** - Own their own data
4. **Resilient** - Fail independently
5. **Observable** - Monitoring and logging

---

## Service Structure

```
services/
├── api-gateway/
│   ├── server.js
│   └── routes/
├── user-service/
│   ├── server.js
│   ├── models/
│   └── routes/
├── product-service/
│   ├── server.js
│   ├── models/
│   └── routes/
└── order-service/
    ├── server.js
    ├── models/
    └── routes/
```

---

## API Gateway

```javascript
// api-gateway/server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Route to services
app.use('/api/users', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true
}));

app.use('/api/products', createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true
}));

app.use('/api/orders', createProxyMiddleware({
    target: 'http://localhost:3003',
    changeOrigin: true
}));

app.listen(3000, () => {
    console.log('API Gateway running on port 3000');
});
```

---

## Service Communication - HTTP

```javascript
// user-service
const axios = require('axios');

router.post('/orders', async (req, res) => {
    try {
        // Call product service
        const product = await axios.get(
            `http://product-service:3002/api/products/${req.body.productId}`
        );

        // Create order
        const order = await Order.create({
            userId: req.user.id,
            productId: product.data.id,
            price: product.data.price
        });

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
```

---

## Message Queue - RabbitMQ

```bash
npm install amqplib
```

```javascript
// utils/messageQueue.js
const amqp = require('amqplib');

class MessageQueue {
    async connect() {
        this.connection = await amqp.connect(process.env.RABBITMQ_URL);
        this.channel = await this.connection.createChannel();
    }

    async publish(queue, message) {
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
            persistent: true
        });
    }

    async subscribe(queue, callback) {
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.consume(queue, (msg) => {
            const content = JSON.parse(msg.content.toString());
            callback(content);
            this.channel.ack(msg);
        });
    }
}

module.exports = new MessageQueue();

// Usage in order-service
const mq = require('./utils/messageQueue');

router.post('/orders', async (req, res) => {
    const order = await Order.create(req.body);

    // Publish event
    await mq.publish('order.created', {
        orderId: order.id,
        userId: order.userId,
        total: order.total
    });

    res.status(201).json(order);
});

// Usage in notification-service
await mq.subscribe('order.created', async (data) => {
    await sendEmail(data.userId, 'Order Confirmation', emailTemplate);
});
```

---

## Service Discovery with Consul

```javascript
const Consul = require('consul');

const consul = new Consul({
    host: 'consul',
    port: 8500
});

// Register service
const registerService = async () => {
    await consul.agent.service.register({
        name: 'user-service',
        address: process.env.SERVICE_HOST,
        port: parseInt(process.env.SERVICE_PORT),
        check: {
            http: `http://${process.env.SERVICE_HOST}:${process.env.SERVICE_PORT}/health`,
            interval: '10s'
        }
    });
};

// Discover service
const discoverService = async (serviceName) => {
    const result = await consul.health.service({
        service: serviceName,
        passing: true
    });

    return result[0].Service;
};
```

---

## Circuit Breaker Pattern

```bash
npm install opossum
```

```javascript
const CircuitBreaker = require('opossum');

const options = {
    timeout: 3000,
    errorThresholdPercentage: 50,
    resetTimeout: 30000
};

const breaker = new CircuitBreaker(async (productId) => {
    return await axios.get(`http://product-service/api/products/${productId}`);
}, options);

breaker.on('open', () => {
    console.log('Circuit breaker opened');
});

// Usage
router.get('/products/:id', async (req, res) => {
    try {
        const product = await breaker.fire(req.params.id);
        res.json(product.data);
    } catch (err) {
        res.status(503).json({ error: 'Service unavailable' });
    }
});
```

---

## Saga Pattern for Distributed Transactions

```javascript
// Order saga
class OrderSaga {
    async execute(orderData) {
        try {
            // Step 1: Reserve inventory
            const reservation = await this.reserveInventory(orderData);

            try {
                // Step 2: Process payment
                const payment = await this.processPayment(orderData);

                try {
                    // Step 3: Create order
                    const order = await this.createOrder(orderData);
                    return order;

                } catch (err) {
                    // Compensate: Refund payment
                    await this.refundPayment(payment.id);
                    throw err;
                }
            } catch (err) {
                // Compensate: Release inventory
                await this.releaseInventory(reservation.id);
                throw err;
            }
        } catch (err) {
            throw new Error('Order failed');
        }
    }
}
```

---

**Next:** [Lesson 2: Docker & Containerization](./02-docker.md)
