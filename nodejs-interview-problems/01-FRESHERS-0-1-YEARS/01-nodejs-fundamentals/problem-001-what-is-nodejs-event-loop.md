# Problem #001: What is Node.js and How Does the Event Loop Work?

**Difficulty**: 🟢 Easy
**Category**: Node.js Fundamentals
**Experience Level**: 0-1 years (Freshers)
**Topic Tags**: `#nodejs` `#event-loop` `#architecture` `#theory`

---

## 📋 Problem Statement

**Question 1**: What is Node.js? Explain its key features and why it's popular.

**Question 2**: Explain how the Event Loop works in Node.js with a diagram and example.

**Question 3**: Write code to demonstrate non-blocking behavior of Node.js.

---

## 🎯 Learning Objectives

After solving this problem, you will understand:
- ✅ What Node.js is and its core features
- ✅ How the Event Loop works
- ✅ Why Node.js is non-blocking
- ✅ When to use Node.js

---

## 💡 Solution

### Part 1: What is Node.js?

**Node.js** is a JavaScript runtime built on Chrome's V8 JavaScript engine that allows you to run JavaScript on the server-side.

#### Key Features:

1. **Asynchronous & Event-Driven**
   - All APIs are non-blocking
   - Server doesn't wait for data from APIs
   - Moves to next call after calling an API

2. **Single-Threaded but Highly Scalable**
   - Uses single-threaded model with event looping
   - Can handle more concurrent requests than traditional servers

3. **Fast Execution**
   - Built on V8 engine (written in C++)
   - Compiles JavaScript to machine code

4. **No Buffering**
   - Applications output data in chunks
   - Never buffers data

5. **Cross-Platform**
   - Runs on Windows, macOS, Linux

#### Why Node.js is Popular:

- ✅ JavaScript on both frontend and backend
- ✅ Large ecosystem (npm)
- ✅ Great for real-time applications
- ✅ Microservices architecture
- ✅ Active community

---

### Part 2: Event Loop Explanation

The Event Loop is what allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded.

#### Event Loop Phases:

```
   ┌───────────────────────────┐
┌─>│           timers          │  <-- Executes callbacks scheduled by setTimeout/setInterval
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │  <-- Executes I/O callbacks deferred to next iteration
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │  <-- Internal use only
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │  <-- Retrieve new I/O events
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │  <-- setImmediate() callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │  <-- e.g. socket.on('close', ...)
   └───────────────────────────┘
```

#### How It Works:

1. **Call Stack**: Executes synchronous code
2. **Event Queue**: Stores callbacks
3. **Event Loop**: Monitors call stack and event queue
   - If call stack is empty, it takes first event from queue and pushes to stack

---

### Part 3: Code Examples

#### Example 1: Basic Non-Blocking Behavior

```javascript
// non-blocking-demo.js
console.log('Start');

// This is non-blocking - doesn't wait for 2 seconds
setTimeout(() => {
  console.log('Timeout callback (2 seconds)');
}, 2000);

// This is non-blocking - doesn't wait for 1 second
setTimeout(() => {
  console.log('Timeout callback (1 second)');
}, 1000);

console.log('End');

// Output:
// Start
// End
// Timeout callback (1 second)
// Timeout callback (2 seconds)
```

**Explanation**: The code doesn't wait for setTimeout callbacks. It continues execution and callbacks are handled by the Event Loop.

---

#### Example 2: Event Loop with File System

```javascript
// event-loop-file-demo.js
const fs = require('fs');

console.log('1. Start of script');

// Asynchronous file read - non-blocking
fs.readFile('./sample.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  console.log('3. File content:', data);
});

console.log('2. End of script');

// Output:
// 1. Start of script
// 2. End of script
// 3. File content: [content of sample.txt]
```

**Explanation**:
- Synchronous code executes first (1, 2)
- File reading happens in background
- Callback executes when file is read (3)

---

#### Example 3: Blocking vs Non-Blocking Comparison

```javascript
// blocking-example.js
const fs = require('fs');

console.log('Start - Blocking Example');

// BLOCKING - waits until file is read
const dataSync = fs.readFileSync('./large-file.txt', 'utf8');
console.log('File read (sync)');

console.log('End - Blocking Example');

// Output:
// Start - Blocking Example
// (waits for file to be read)
// File read (sync)
// End - Blocking Example
```

```javascript
// non-blocking-example.js
const fs = require('fs');

console.log('Start - Non-Blocking Example');

// NON-BLOCKING - doesn't wait
fs.readFile('./large-file.txt', 'utf8', (err, data) => {
  console.log('File read (async)');
});

console.log('End - Non-Blocking Example');

// Output:
// Start - Non-Blocking Example
// End - Non-Blocking Example
// File read (async)
```

---

#### Example 4: Complete Event Loop Demo

```javascript
// complete-event-loop-demo.js

console.log('1. Synchronous code - Start');

// Microtask (Promise) - Higher priority
Promise.resolve().then(() => {
  console.log('4. Promise (microtask)');
});

// Macrotask (setTimeout)
setTimeout(() => {
  console.log('6. setTimeout 0ms');
}, 0);

// Macrotask (setImmediate) - Check phase
setImmediate(() => {
  console.log('7. setImmediate');
});

// Next tick - Highest priority
process.nextTick(() => {
  console.log('3. process.nextTick');
});

console.log('2. Synchronous code - End');

// Output:
// 1. Synchronous code - Start
// 2. Synchronous code - End
// 3. process.nextTick
// 4. Promise (microtask)
// 6. setTimeout 0ms
// 7. setImmediate
```

**Priority Order**:
1. Synchronous code
2. `process.nextTick()`
3. Microtasks (Promises)
4. Macrotasks (setTimeout, setInterval)
5. setImmediate

---

## 📊 Visual Representation

```
┌─────────────────────────────────────────────────┐
│         Node.js Application                      │
│                                                  │
│  ┌───────────┐         ┌──────────────┐        │
│  │  V8 Engine│         │   libuv      │        │
│  │           │         │ (Event Loop) │        │
│  │ JavaScript├────────>│              │        │
│  │  Execution│         │ Thread Pool  │        │
│  └───────────┘         └──────────────┘        │
│                              ↓                   │
│                     ┌────────────────┐          │
│                     │  Event Queue   │          │
│                     │  (Callbacks)   │          │
│                     └────────────────┘          │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Key Takeaways

| Concept | Description |
|---------|-------------|
| **Node.js** | JavaScript runtime for server-side development |
| **Event Loop** | Mechanism that handles async operations |
| **Non-Blocking** | Code execution doesn't wait for I/O operations |
| **Single-Threaded** | One main thread, but uses thread pool for I/O |
| **Callback Queue** | Stores callbacks waiting to be executed |

---

## ❓ Common Interview Questions

1. **Q: Is Node.js single-threaded?**
   - A: The event loop is single-threaded, but Node.js uses a thread pool (libuv) for I/O operations.

2. **Q: Why is Node.js faster for I/O operations?**
   - A: Non-blocking I/O means it doesn't wait for operations to complete, handling multiple requests concurrently.

3. **Q: What is the difference between process.nextTick() and setImmediate()?**
   - A: `process.nextTick()` executes before any other I/O events. `setImmediate()` executes in the check phase of the event loop.

4. **Q: Can Node.js handle CPU-intensive tasks?**
   - A: Not ideal for CPU-intensive tasks as it blocks the event loop. Better for I/O-heavy operations.

5. **Q: What is libuv?**
   - A: C library that provides the event loop and thread pool for Node.js.

---

## 🚫 Common Mistakes

1. ❌ Thinking Node.js is multi-threaded
2. ❌ Using blocking operations in production
3. ❌ Not understanding callback execution order
4. ❌ Confusing synchronous and asynchronous code
5. ❌ Blocking the event loop with heavy computations

---

## ✅ Best Practices

1. ✅ Always use asynchronous methods in production
2. ✅ Understand the event loop phases
3. ✅ Use `process.nextTick()` carefully (can starve I/O)
4. ✅ Prefer Promises/async-await over callbacks
5. ✅ Monitor event loop lag in production

---

## 🔗 Related Problems

- Problem #002: Blocking vs Non-blocking I/O
- Problem #014: setTimeout vs setImmediate vs process.nextTick
- Problem #069: Event Emitter Pattern (Advanced)

---

## 📚 Further Reading

- [Node.js Official Docs - Event Loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
- [libuv Documentation](http://docs.libuv.org/)
- [Understanding the Event Loop](https://blog.logrocket.com/a-complete-guide-to-the-node-js-event-loop/)

---

## 🎓 Interview Tips

**What Interviewers Look For**:
- Clear understanding of non-blocking I/O
- Knowledge of event loop phases
- Ability to explain with examples
- Understanding of when to use Node.js

**How to Answer**:
1. Start with a simple definition
2. Explain the event loop with a diagram
3. Give a practical code example
4. Discuss use cases
5. Mention limitations

---

## 💻 Practice Exercise

Create a file `event-loop-practice.js` and experiment:

```javascript
// Try this and predict the output before running
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
process.nextTick(() => console.log('D'));
console.log('E');

// What will be the output order?
```

---

**Estimated Time to Understand**: 30-45 minutes
**Difficulty**: 🟢 Easy (Theoretical) + 🟡 Medium (Deep understanding)

---

*Part of: Node.js Interview Problems - Freshers Level*
*[← Previous](../README.md) | [Next Problem →](./problem-002-blocking-vs-non-blocking.md)*
