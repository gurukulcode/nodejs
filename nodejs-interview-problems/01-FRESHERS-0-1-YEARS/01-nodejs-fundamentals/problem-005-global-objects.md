# Problem #005: Global Objects in Node.js

**Difficulty**: 🟢 Easy | **Experience**: 0-1 years | **Tags**: `#globals` `#process` `#__dirname`

---

## 📋 Problem

List and explain the most important global objects in Node.js. Demonstrate their usage with code examples.

---

## 💡 Solution

### Important Global Objects

```javascript
// 1. __dirname - Current directory path
console.log(__dirname);
// Output: /Users/john/projects/myapp

// 2. __filename - Current file path with filename
console.log(__filename);
// Output: /Users/john/projects/myapp/index.js

// 3. process - Information about current Node.js process
console.log(process.version);     // v18.12.0
console.log(process.platform);    // darwin, linux, win32
console.log(process.pid);          // 12345
console.log(process.cwd());        // Current working directory
console.log(process.env.NODE_ENV); // Environment variables

// 4. console - Logging (same as browser)
console.log('Log message');
console.error('Error message');
console.warn('Warning message');
console.table([{name: 'John', age: 30}]);

// 5. setTimeout, setInterval, setImmediate
setTimeout(() => console.log('After 1s'), 1000);
setInterval(() => console.log('Every 2s'), 2000);
setImmediate(() => console.log('Immediate'));

// 6. Buffer - Handle binary data
const buf = Buffer.from('Hello');
console.log(buf); // <Buffer 48 65 6c 6c 6f>

// 7. global - Global namespace (like window in browser)
global.myVar = 'Hello';
console.log(global.myVar); // Hello
// Note: Not recommended, use modules instead!

// 8. exports, require, module (covered in previous problems)
```

### process Object - Deep Dive

```javascript
// process-demo.js

// 1. Command line arguments
console.log(process.argv);
// Run: node app.js arg1 arg2
// Output: ['/usr/bin/node', '/path/to/app.js', 'arg1', 'arg2']

// 2. Environment variables
console.log(process.env.NODE_ENV);
console.log(process.env.PORT);

// 3. Exit process
if (errorCondition) {
  process.exit(1); // Exit with error code
}

// 4. Process events
process.on('exit', (code) => {
  console.log(`Exiting with code: ${code}`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// 5. Memory usage
console.log(process.memoryUsage());
// { rss: 123, heapTotal: 456, heapUsed: 789, external: 12 }

// 6. Uptime
console.log(`Uptime: ${process.uptime()} seconds`);
```

### __dirname vs process.cwd()

```javascript
// project/src/app.js

console.log('__dirname:', __dirname);
// Output: /Users/john/project/src

console.log('process.cwd():', process.cwd());
// Output: /Users/john/project (where you ran 'node' from)

// __dirname = directory of the current file
// process.cwd() = directory where Node.js process was started
```

### Practical Examples

```javascript
// Example 1: Build file paths
const path = require('path');
const configPath = path.join(__dirname, 'config', 'database.json');

// Example 2: Read environment-specific config
const env = process.env.NODE_ENV || 'development';
const config = require(`./config/${env}.json`);

// Example 3: Command-line tool
const args = process.argv.slice(2); // Remove 'node' and 'script.js'
if (args[0] === 'start') {
  startServer();
} else if (args[0] === 'stop') {
  stopServer();
}

// Example 4: Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
```

---

## 🎯 Key Globals Comparison

| Global | Description | Example |
|--------|-------------|---------|
| `__dirname` | Current directory | `/Users/john/app` |
| `__filename` | Current file with path | `/Users/john/app/index.js` |
| `process.cwd()` | Working directory | Where node was run from |
| `process.env` | Environment variables | `NODE_ENV`, `PORT` |
| `process.argv` | Command arguments | `['node', 'app.js', 'arg']` |
| `console` | Logging | `console.log()`, `console.error()` |
| `Buffer` | Binary data | `Buffer.from('text')` |
| `global` | Global scope | Avoid using! |

---

## ❓ Interview Questions

**Q: What's the difference between __dirname and process.cwd()?**
```
A: __dirname is the directory of the current file (static).
   process.cwd() is where Node.js was started from (dynamic).
```

**Q: Is there a 'window' object in Node.js?**
```
A: No. In Node.js, the global scope is 'global', not 'window'.
```

**Q: How do you access environment variables?**
```
A: process.env.VARIABLE_NAME
```

---

## ✅ Best Practices

```javascript
// ✅ Use __dirname for file paths
const filePath = path.join(__dirname, 'data', 'users.json');

// ✅ Use environment variables for config
const port = process.env.PORT || 3000;

// ✅ Handle process events
process.on('uncaughtException', handleError);

// ❌ Don't pollute global scope
global.config = {}; // Bad!
module.exports = config; // Good!
```

---

**Time**: 20 mins | **Difficulty**: 🟢 Easy

*[← Prev](./problem-004-module-exports-vs-exports.md) | [Next →](./problem-006-package-json-basics.md)*
