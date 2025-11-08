# Lesson 6: Debugging and Profiling

## 🎯 Learning Objectives

- Debug Node.js applications
- Memory leak detection
- CPU profiling
- Logging with Winston
- Monitoring tools

---

## Node.js Debugger

```bash
# Start with inspector
node --inspect app.js

# Break on first line
node --inspect-brk app.js

# Chrome DevTools
# Open chrome://inspect
```

```javascript
// Add breakpoint in code
debugger;

// Or use VS Code launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Debug App",
  "program": "${workspaceFolder}/app.js"
}
```

---

## Logging with Winston

```bash
npm install winston
```

```javascript
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

logger.info('Application started');
logger.error('Error occurred', { error: err });
```

---

## Memory Profiling

```bash
node --inspect --expose-gc app.js
```

```javascript
// Check memory usage
const used = process.memoryUsage();
console.log({
    rss: `${Math.round(used.rss / 1024 / 1024)} MB`,
    heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)} MB`,
    external: `${Math.round(used.external / 1024 / 1024)} MB`
});

// Detect memory leaks
const memwatch = require('@airbnb/node-memwatch');

memwatch.on('leak', (info) => {
    console.error('Memory leak detected:', info);
});
```

---

**Congratulations!** Level 3 complete.

**Next:** [Level 4: Professional](../level-4-professional/README.md)
