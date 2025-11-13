#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Complete 210 problems data
const allProblems = [
  // MID-LEVEL (2-4 years) - Problems #066-105
  ...Array.from({ length: 8 }, (_, i) => ({
    num: 66 + i, folder: '03-MID-LEVEL-2-4-YEARS', category: '01-advanced-async-patterns',
    title: ['Retry Mechanism with Exponential Backoff', 'Async Queue with Concurrency Limit', 'Custom Event Emitter Implementation',
            'Handle uncaughtException and unhandledRejection', 'Worker Threads for CPU Tasks', 'Child Processes - spawn fork exec',
            'Debounce and Throttle Functions', 'Async Iterators and Generators'][i],
    difficulty: 'Medium', tags: '#async #advanced #patterns'
  })),

  ...Array.from({ length: 8 }, (_, i) => ({
    num: 74 + i, folder: '03-MID-LEVEL-2-4-YEARS', category: '02-authentication-authorization',
    title: ['JWT Authentication from Scratch', 'Refresh Token Mechanism', 'Password Hashing with Bcrypt',
            'Session-based Authentication', 'OAuth 2.0 Integration', 'Role-Based Access Control (RBAC)',
            'Protect Routes with Auth Middleware', 'Password Reset Functionality'][i],
    difficulty: 'Medium', tags: '#auth #security #jwt'
  })),

  ...Array.from({ length: 7 }, (_, i) => ({
    num: 82 + i, folder: '03-MID-LEVEL-2-4-YEARS', category: '03-security',
    title: ['Prevent SQL Injection', 'Prevent XSS Attacks', 'Prevent CSRF Attacks', 'Rate Limiting Implementation',
            'Input Validation Deep Dive', 'Secure Password Storage', 'API Key Management'][i],
    difficulty: 'Medium', tags: '#security #owasp #protection'
  })),

  ...Array.from({ length: 9 }, (_, i) => ({
    num: 89 + i, folder: '03-MID-LEVEL-2-4-YEARS', category: '04-database-advanced',
    title: ['Database Connection Pooling', 'Transactions in PostgreSQL', 'Transactions in MongoDB',
            'Database Indexing Strategies', 'Mongoose Populate and Virtuals', 'Aggregate Queries in MongoDB',
            'SQL JOIN Operations', 'Database Migrations', 'Soft Delete Implementation'][i],
    difficulty: 'Medium', tags: '#database #advanced #optimization'
  })),

  ...Array.from({ length: 8 }, (_, i) => ({
    num: 98 + i, folder: '03-MID-LEVEL-2-4-YEARS', category: '05-caching-performance',
    title: ['Redis Caching Layer', 'Cache Invalidation Strategies', 'Memory Caching with node-cache',
            'HTTP Caching Headers', 'Compression Middleware (gzip)', 'Query Optimization',
            'Pagination Implementation', 'Image Optimization'][i],
    difficulty: 'Medium', tags: '#caching #performance #redis'
  })),

  // SENIOR (4-7 years) - Problems #106-145
  ...Array.from({ length: 9 }, (_, i) => ({
    num: 106 + i, folder: '04-SENIOR-4-7-YEARS', category: '01-performance-optimization',
    title: ['Clustering for Multi-Core', 'Load Balancing with PM2', 'Memory Leak Detection',
            'CPU Profiling', 'Stream Processing for Large Data', 'Event Loop Optimization',
            'Connection Pooling Best Practices', 'Circuit Breaker Pattern', 'Garbage Collection Tuning'][i],
    difficulty: 'Hard', tags: '#performance #optimization #scaling'
  })),

  ...Array.from({ length: 8 }, (_, i) => ({
    num: 115 + i, folder: '04-SENIOR-4-7-YEARS', category: '02-testing',
    title: ['Unit Testing with Jest', 'Mock Functions and Modules', 'Integration Testing with Supertest',
            'Test Express Middleware', 'Test Database Operations', 'Test Async Code',
            'Code Coverage with Istanbul', 'Test-Driven Development (TDD)'][i],
    difficulty: 'Medium', tags: '#testing #jest #tdd'
  })),

  ...Array.from({ length: 9 }, (_, i) => ({
    num: 123 + i, folder: '04-SENIOR-4-7-YEARS', category: '03-api-design-architecture',
    title: ['RESTful API Best Practices', 'API Versioning Strategies', 'GraphQL API Implementation',
            'HATEOAS in REST API', 'API Documentation with Swagger', 'Pagination and Filtering',
            'Search Functionality', 'Batch API Requests', 'Webhook Implementation'][i],
    difficulty: 'Hard', tags: '#api #rest #graphql #architecture'
  })),

  ...Array.from({ length: 7 }, (_, i) => ({
    num: 132 + i, folder: '04-SENIOR-4-7-YEARS', category: '04-realtime-websockets',
    title: ['WebSocket Basics with ws', 'Socket.io Real-time Communication', 'Real-time Chat Application',
            'Real-time Notifications System', 'WebSocket Authentication', 'Scale WebSocket Connections',
            'Server-Sent Events (SSE)'][i],
    difficulty: 'Hard', tags: '#websockets #realtime #socket-io'
  })),

  ...Array.from({ length: 7 }, (_, i) => ({
    num: 139 + i, folder: '04-SENIOR-4-7-YEARS', category: '05-error-handling-logging',
    title: ['Centralized Error Handling', 'Custom Error Classes', 'Structured Logging with Winston',
            'Log Aggregation Strategies', 'Error Monitoring with Sentry', 'Graceful Shutdown',
            'Health Check Endpoints'][i],
    difficulty: 'Medium', tags: '#errors #logging #monitoring'
  })),

  // EXPERT (7-10 years) - Problems #146-180
  ...Array.from({ length: 9 }, (_, i) => ({
    num: 146 + i, folder: '05-EXPERT-7-10-YEARS', category: '01-microservices-architecture',
    title: ['Design Microservices Architecture', 'Service Communication (REST vs gRPC)', 'API Gateway Pattern',
            'Service Discovery', 'Distributed Tracing', 'Saga Pattern for Transactions',
            'Event-Driven Architecture', 'CQRS Pattern', 'Service Mesh Basics'][i],
    difficulty: 'Expert', tags: '#microservices #architecture #distributed'
  })),

  ...Array.from({ length: 7 }, (_, i) => ({
    num: 155 + i, folder: '05-EXPERT-7-10-YEARS', category: '02-message-queues-events',
    title: ['RabbitMQ Producer/Consumer', 'Kafka Pub/Sub Pattern', 'Message Acknowledgment',
            'Dead Letter Queue', 'Event Sourcing Pattern', 'Bull Queue for Jobs',
            'Priority Queues'][i],
    difficulty: 'Expert', tags: '#queues #kafka #rabbitmq #events'
  })),

  ...Array.from({ length: 9 }, (_, i) => ({
    num: 162 + i, folder: '05-EXPERT-7-10-YEARS', category: '03-advanced-security-devops',
    title: ['OAuth 2.0 Server Implementation', 'Multi-Factor Authentication', 'Secrets Management',
            'Container Security', 'Audit Logging', 'Zero-Trust Security',
            'OWASP Top 10 Mitigation', 'Penetration Testing', 'Security Headers Deep Dive'][i],
    difficulty: 'Expert', tags: '#security #oauth #devops #owasp'
  })),

  ...Array.from({ length: 6 }, (_, i) => ({
    num: 171 + i, folder: '05-EXPERT-7-10-YEARS', category: '04-advanced-database-data',
    title: ['Database Sharding', 'Read Replicas', 'Multi-Tenancy Design',
            'Time-Series Data', 'Elasticsearch Integration', 'Data Synchronization'][i],
    difficulty: 'Expert', tags: '#database #sharding #elasticsearch'
  })),

  ...Array.from({ length: 4 }, (_, i) => ({
    num: 177 + i, folder: '05-EXPERT-7-10-YEARS', category: '05-monitoring-observability',
    title: ['APM Implementation', 'Prometheus Metrics', 'Distributed Logging', 'Custom Dashboards'][i],
    difficulty: 'Expert', tags: '#monitoring #prometheus #observability'
  })),

  // EXPERT+ (10+ years) - Problems #181-210
  ...Array.from({ length: 10 }, (_, i) => ({
    num: 181 + i, folder: '06-EXPERT-PLUS-10-YEARS', category: '01-system-design',
    title: ['Design URL Shortener', 'Design Real-time Chat System', 'Design Distributed Cache',
            'Design Rate Limiting System', 'Design File Storage System', 'Design Notification System',
            'Design Payment System', 'Design Video Streaming Platform', 'Design Social Feed',
            'Design Search Engine'][i],
    difficulty: 'Expert', tags: '#system-design #architecture #scalability'
  })),

  ...Array.from({ length: 8 }, (_, i) => ({
    num: 191 + i, folder: '06-EXPERT-PLUS-10-YEARS', category: '02-advanced-architecture-patterns',
    title: ['Custom ORM/Query Builder', 'Plugin Architecture System', 'Multi-Tenancy at Scale',
            'Event Sourcing with Snapshots', 'Custom Serialization Protocol', 'Idempotent API Operations',
            'Distributed Locks', 'Eventual Consistency Patterns'][i],
    difficulty: 'Expert', tags: '#architecture #patterns #advanced'
  })),

  ...Array.from({ length: 7 }, (_, i) => ({
    num: 199 + i, folder: '06-EXPERT-PLUS-10-YEARS', category: '03-performance-at-scale',
    title: ['Horizontal Scaling Strategies', 'Database Partitioning at Scale', 'CDN Integration',
            'Custom Load Balancer', 'Zero-Downtime Deployment', 'Blue-Green Deployment',
            'Canary Deployment'][i],
    difficulty: 'Expert', tags: '#scaling #deployment #performance'
  })),

  ...Array.from({ length: 5 }, (_, i) => ({
    num: 206 + i, folder: '06-EXPERT-PLUS-10-YEARS', category: '04-advanced-topics',
    title: ['Custom Node.js Addon (C++)', 'Memory Management Deep Dive', 'Build HTTP Server from Scratch',
            'Custom Stream Types', 'Open Source Contribution Best Practices'][i],
    difficulty: 'Expert', tags: '#advanced #cpp #internals'
  })),
];

function generateProblemFile(problem) {
  const { num, folder, category, title, difficulty, tags } = problem;
  const paddedNum = String(num).padStart(3, '0');
  const fileName = `problem-${paddedNum}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
  const filePath = path.join(__dirname, folder, category, fileName);

  const difficultyEmoji = difficulty === 'Easy' ? '🟢' : difficulty === 'Medium' ? '🟡' : difficulty === 'Hard' ? '🟠' : '🔴';

  const content = `# Problem #${paddedNum}: ${title}

**Difficulty**: ${difficultyEmoji} ${difficulty}
**Topic Tags**: \`${tags}\`

---

## 📋 Problem Statement

**${title}**

Implement a solution for: **${title}**

**Requirements**:
1. Understand the concept thoroughly
2. Implement working code solution
3. Handle edge cases and errors
4. Follow best practices

---

## 💡 Solution

### Approach

[Detailed approach and explanation for ${title}]

### Code Implementation

\`\`\`javascript
// solution-${paddedNum}.js
// ${title}

// TODO: Implementation

console.log('Problem #${paddedNum}: ${title}');
\`\`\`

### Example Usage

\`\`\`javascript
// example-${paddedNum}.js
// Example demonstrating ${title}
\`\`\`

---

## 🎯 Key Concepts

- Concept 1 related to ${title}
- Concept 2 related to ${title}
- Concept 3 related to ${title}

---

## ❓ Interview Questions

**Q1**: What is the main concept behind ${title}?
\`\`\`
A: [Answer here]
\`\`\`

**Q2**: When should you use this approach?
\`\`\`
A: [Answer here]
\`\`\`

**Q3**: What are the trade-offs?
\`\`\`
A: [Answer here]
\`\`\`

---

## 🚫 Common Mistakes

1. ❌ Common mistake 1
2. ❌ Common mistake 2
3. ❌ Common mistake 3

---

## ✅ Best Practices

1. ✅ Best practice 1
2. ✅ Best practice 2
3. ✅ Best practice 3

---

## 📊 Performance Considerations

- Performance aspect 1
- Performance aspect 2
- Time/Space complexity notes

---

## 🔗 Related Problems

- Related problem 1
- Related problem 2

---

## 📚 Further Reading

- [Node.js Official Docs](https://nodejs.org/docs/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Relevant article or tutorial]

---

**Estimated Time**: 30-45 minutes
**Difficulty**: ${difficultyEmoji} ${difficulty}

---

*Problem #${paddedNum} of 210 - Node.js Interview Problems*
`;

  return { filePath, content, fileName };
}

// Generate all problems
console.log('🚀 Generating all 210 Node.js Interview Problems...\n');

let created = 0;
let skipped = 0;

allProblems.forEach(problem => {
  const { filePath, content, fileName } = generateProblemFile(problem);

  if (fs.existsSync(filePath)) {
    skipped++;
    return;
  }

  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content, 'utf8');
    created++;
    if (created % 10 === 0) {
      console.log(`✅ Created ${created} problems...`);
    }
  } catch (err) {
    console.error(`❌ Error creating ${fileName}:`, err.message);
  }
});

console.log(`\n🎉 Generation Complete!`);
console.log(`✅ Created: ${created} problems`);
console.log(`⏭️  Skipped: ${skipped} problems (already exist)`);
console.log(`📊 Total: ${created + skipped} / 210 problems`);
