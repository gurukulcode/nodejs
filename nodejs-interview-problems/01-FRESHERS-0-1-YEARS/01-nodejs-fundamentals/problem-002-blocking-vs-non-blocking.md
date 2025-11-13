# Problem #002: Blocking vs Non-Blocking I/O

**Difficulty**: 🟢 Easy
**Category**: Node.js Fundamentals
**Experience Level**: 0-1 years (Freshers)
**Topic Tags**: `#io` `#blocking` `#non-blocking` `#performance`

---

## 📋 Problem Statement

**Question 1**: Explain the difference between blocking and non-blocking I/O operations in Node.js.

**Question 2**: Write code examples demonstrating both blocking and non-blocking file operations.

**Question 3**: When should you use blocking vs non-blocking operations?

---

## 💡 Solution

### Part 1: Blocking vs Non-Blocking - Theory

#### Blocking I/O (Synchronous)

- **Waits** for the operation to complete before moving to next line
- **Blocks** the execution of code
- **Stops** other operations from running
- **Simpler** code but poor performance

```
Code Flow (Blocking):
────────────────────────────────
Line 1: console.log('Start')
Line 2: data = readFileSync()  ← WAITS HERE until file is read
Line 3: console.log(data)
Line 4: console.log('End')
```

#### Non-Blocking I/O (Asynchronous)

- **Doesn't wait** for operation to complete
- **Continues** execution immediately
- **Callbacks** handle results later
- **Better performance** but more complex

```
Code Flow (Non-Blocking):
────────────────────────────────
Line 1: console.log('Start')
Line 2: readFile(callback)     ← Registers callback, continues immediately
Line 3: console.log('End')
... later when file is ready ...
Callback: console.log(data)
```

---

### Part 2: Code Examples

#### Example 1: Blocking (Synchronous) File Read

```javascript
// blocking-example.js
const fs = require('fs');

console.log('Start reading file (BLOCKING)...');

// BLOCKING - Program waits here
try {
  const data = fs.readFileSync('sample.txt', 'utf8');
  console.log('File Content:', data);
} catch (err) {
  console.error('Error:', err.message);
}

console.log('File reading complete');
console.log('Program continues...');

/* OUTPUT:
Start reading file (BLOCKING)...
File Content: [content of sample.txt]
File reading complete
Program continues...
*/
```

**Characteristics**:
- ✅ Simple, easy to understand
- ✅ Predictable execution order
- ❌ Blocks the entire program
- ❌ Poor performance for I/O operations

---

#### Example 2: Non-Blocking (Asynchronous) File Read

```javascript
// non-blocking-example.js
const fs = require('fs');

console.log('Start reading file (NON-BLOCKING)...');

// NON-BLOCKING - Program continues immediately
fs.readFile('sample.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error:', err.message);
    return;
  }
  console.log('File Content:', data);
});

console.log('File reading initiated');
console.log('Program continues...');

/* OUTPUT:
Start reading file (NON-BLOCKING)...
File reading initiated
Program continues...
File Content: [content of sample.txt]
*/
```

**Characteristics**:
- ✅ Non-blocking, high performance
- ✅ Can handle multiple operations
- ❌ More complex (callbacks)
- ❌ Order not guaranteed

---

#### Example 3: Performance Comparison

```javascript
// performance-comparison.js
const fs = require('fs');

console.time('Blocking Time');
console.time('Non-Blocking Time');

// ============= BLOCKING VERSION =============
console.log('\n--- BLOCKING VERSION ---');
console.time('Total Blocking');

const file1Sync = fs.readFileSync('file1.txt', 'utf8');
console.log('File 1 read (blocking)');

const file2Sync = fs.readFileSync('file2.txt', 'utf8');
console.log('File 2 read (blocking)');

const file3Sync = fs.readFileSync('file3.txt', 'utf8');
console.log('File 3 read (blocking)');

console.timeEnd('Total Blocking');

// ============= NON-BLOCKING VERSION =============
console.log('\n--- NON-BLOCKING VERSION ---');
console.time('Total Non-Blocking');

let filesRead = 0;

fs.readFile('file1.txt', 'utf8', (err, data) => {
  console.log('File 1 read (non-blocking)');
  filesRead++;
  if (filesRead === 3) console.timeEnd('Total Non-Blocking');
});

fs.readFile('file2.txt', 'utf8', (err, data) => {
  console.log('File 2 read (non-blocking)');
  filesRead++;
  if (filesRead === 3) console.timeEnd('Total Non-Blocking');
});

fs.readFile('file3.txt', 'utf8', (err, data) => {
  console.log('File 3 read (non-blocking)');
  filesRead++;
  if (filesRead === 3) console.timeEnd('Total Non-Blocking');
});

/* OUTPUT (example times):
--- BLOCKING VERSION ---
File 1 read (blocking)
File 2 read (blocking)
File 3 read (blocking)
Total Blocking: 150ms

--- NON-BLOCKING VERSION ---
File 1 read (non-blocking)
File 2 read (non-blocking)
File 3 read (non-blocking)
Total Non-Blocking: 55ms
*/
```

**Result**: Non-blocking is typically **2-3x faster** for multiple I/O operations!

---

#### Example 4: Real-World Web Server Comparison

```javascript
// blocking-server.js (BAD - Don't use in production)
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  // BLOCKING - Server can't handle other requests while reading
  const data = fs.readFileSync('large-file.html', 'utf8');
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(data);
});

server.listen(3000);
console.log('Blocking server on port 3000');
// Problem: If 100 users request simultaneously, they wait in queue!
```

```javascript
// non-blocking-server.js (GOOD - Production ready)
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  // NON-BLOCKING - Server handles other requests while reading
  fs.readFile('large-file.html', 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error reading file');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

server.listen(3000);
console.log('Non-blocking server on port 3000');
// Better: Can handle 100 concurrent users efficiently!
```

---

### Part 3: When to Use Each

#### Use BLOCKING when:
- ✅ One-time setup tasks (configuration loading at startup)
- ✅ CLI tools (where blocking is acceptable)
- ✅ Scripts that run once
- ✅ Simplicity is more important than performance
- ✅ No concurrent users

#### Use NON-BLOCKING when:
- ✅ Web servers (multiple concurrent users)
- ✅ Production applications
- ✅ High-performance requirements
- ✅ Real-time applications
- ✅ Any I/O-heavy operations

---

## 📊 Comparison Table

| Aspect | Blocking (Sync) | Non-Blocking (Async) |
|--------|----------------|---------------------|
| **Execution** | Waits for completion | Continues immediately |
| **Performance** | Slower for I/O | Faster for I/O |
| **Complexity** | Simple | More complex |
| **Use Case** | Scripts, CLI | Servers, production |
| **Method Example** | `readFileSync()` | `readFile()` |
| **Error Handling** | try-catch | Callback/Promise |
| **Concurrency** | Poor | Excellent |

---

## 💻 Practical Code - Complete Example

```javascript
// complete-blocking-vs-non-blocking.js
const fs = require('fs');

// Create test files first
function setupTestFiles() {
  fs.writeFileSync('test1.txt', 'Content of file 1');
  fs.writeFileSync('test2.txt', 'Content of file 2');
  fs.writeFileSync('test3.txt', 'Content of file 3');
}

// BLOCKING VERSION
function blockingApproach() {
  console.log('\n========== BLOCKING APPROACH ==========');
  console.log('Start');

  console.time('Blocking Total Time');

  const data1 = fs.readFileSync('test1.txt', 'utf8');
  console.log('Read file 1:', data1);

  const data2 = fs.readFileSync('test2.txt', 'utf8');
  console.log('Read file 2:', data2);

  const data3 = fs.readFileSync('test3.txt', 'utf8');
  console.log('Read file 3:', data3);

  console.timeEnd('Blocking Total Time');
  console.log('End');
}

// NON-BLOCKING VERSION
function nonBlockingApproach() {
  console.log('\n========== NON-BLOCKING APPROACH ==========');
  console.log('Start');

  console.time('Non-Blocking Total Time');
  let count = 0;

  fs.readFile('test1.txt', 'utf8', (err, data) => {
    console.log('Read file 1:', data);
    if (++count === 3) {
      console.timeEnd('Non-Blocking Total Time');
      console.log('End');
    }
  });

  fs.readFile('test2.txt', 'utf8', (err, data) => {
    console.log('Read file 2:', data);
    if (++count === 3) {
      console.timeEnd('Non-Blocking Total Time');
      console.log('End');
    }
  });

  fs.readFile('test3.txt', 'utf8', (err, data) => {
    console.log('Read file 3:', data);
    if (++count === 3) {
      console.timeEnd('Non-Blocking Total Time');
      console.log('End');
    }
  });

  console.log('All file reads initiated (non-blocking)');
}

// Run examples
setupTestFiles();
blockingApproach();

setTimeout(() => {
  nonBlockingApproach();
}, 1000);
```

---

## 🎯 Key Takeaways

1. **Blocking** = Synchronous = Waits = Poor performance for I/O
2. **Non-Blocking** = Asynchronous = Doesn't wait = Better performance
3. **Production apps** should use non-blocking operations
4. **Event Loop** enables non-blocking in single-threaded Node.js
5. **Callbacks/Promises** handle async results

---

## ❓ Interview Questions

**Q1: Why is non-blocking I/O important in Node.js?**
```
A: Because Node.js is single-threaded. If we use blocking operations,
the entire application waits, and no other requests can be handled.
Non-blocking allows handling thousands of concurrent connections.
```

**Q2: Give an example of when blocking is acceptable?**
```
A: Loading configuration files at application startup, CLI tools,
or one-time scripts where there are no concurrent users.
```

**Q3: How does Node.js handle non-blocking operations?**
```
A: Using the Event Loop and libuv library. I/O operations are
delegated to the system, and callbacks are executed when ready.
```

---

## 🚫 Common Mistakes

1. ❌ Using `*Sync` methods in production servers
2. ❌ Not understanding performance impact
3. ❌ Mixing blocking and non-blocking without reason
4. ❌ Not handling errors in async operations
5. ❌ Thinking async is always better (it's not for CPU-bound tasks)

---

## ✅ Best Practices

1. ✅ Use async methods in production
2. ✅ Use sync methods only for startup/initialization
3. ✅ Always handle errors in async operations
4. ✅ Understand when each approach is appropriate
5. ✅ Use Promises/async-await instead of callbacks when possible

---

## 🔗 Related Problems

- Problem #001: Event Loop
- Problem #009: Callback Functions
- Problem #011: Promises Basics
- Problem #013: Async/Await

---

## 📚 Further Reading

- [Node.js Blocking vs Non-Blocking](https://nodejs.org/en/docs/guides/blocking-vs-non-blocking/)
- [Understanding Async I/O](https://nodejs.dev/learn/the-nodejs-event-loop)

---

**Estimated Time**: 20-30 minutes
**Difficulty**: 🟢 Easy

---

*[← Previous](./problem-001-what-is-nodejs-event-loop.md) | [Next →](./problem-003-require-vs-import.md)*
