# Lesson 6: Asynchronous JavaScript

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Master callbacks and understand callback hell
- Work with Promises effectively
- Use async/await for cleaner asynchronous code
- Handle errors in asynchronous operations
- Understand Promise combinators
- Manage concurrent operations

---

## Why Asynchronous Programming?

JavaScript is **single-threaded**, but Node.js achieves concurrency through:

1. **Event Loop** - Manages execution of callbacks
2. **Non-blocking I/O** - Doesn't wait for operations to complete
3. **Callbacks/Promises** - Handle asynchronous results

### Synchronous vs Asynchronous

```javascript
// ❌ SYNCHRONOUS (Blocking)
const fs = require('fs');

console.log('Start');
const data = fs.readFileSync('file.txt', 'utf8'); // Blocks here
console.log(data);
console.log('End');

// ✅ ASYNCHRONOUS (Non-blocking)
console.log('Start');
fs.readFile('file.txt', 'utf8', (err, data) => {
    console.log(data); // Executes later
});
console.log('End'); // Runs immediately

// Output:
// Start
// End
// [file contents]
```

---

## Callbacks

A callback is a function passed as an argument to be executed later.

### Basic Callback Pattern

```javascript
// Simple callback
function fetchData(callback) {
    setTimeout(() => {
        const data = { id: 1, name: 'John' };
        callback(data);
    }, 1000);
}

fetchData((result) => {
    console.log('Received:', result);
});
```

### Error-First Callbacks (Node.js Convention)

```javascript
// error-first-callback.js
const fs = require('fs');

function readFileCallback(filePath, callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, data);
    });
}

// Usage
readFileCallback('example.txt', (err, data) => {
    if (err) {
        console.error('Error:', err.message);
        return;
    }
    console.log('Data:', data);
});
```

### Callback Hell (Pyramid of Doom)

```javascript
// ❌ CALLBACK HELL
fs.readFile('file1.txt', 'utf8', (err, data1) => {
    if (err) throw err;

    fs.readFile('file2.txt', 'utf8', (err, data2) => {
        if (err) throw err;

        fs.readFile('file3.txt', 'utf8', (err, data3) => {
            if (err) throw err;

            fs.writeFile('output.txt', data1 + data2 + data3, (err) => {
                if (err) throw err;
                console.log('Done!');
            });
        });
    });
});
```

**Problems:**
- Hard to read and maintain
- Error handling is repetitive
- Difficult to debug

---

## Promises

Promises represent the eventual completion (or failure) of an asynchronous operation.

### Promise States

```
┌──────────┐
│ Pending  │ → Initial state
└────┬─────┘
     │
     ├─→ ┌────────────┐
     │   │ Fulfilled  │ → Operation completed successfully
     │   └────────────┘
     │
     └─→ ┌────────────┐
         │ Rejected   │ → Operation failed
         └────────────┘
```

### Creating Promises

```javascript
// create-promise.js
function delay(ms) {
    return new Promise((resolve, reject) => {
        if (ms < 0) {
            reject(new Error('Delay cannot be negative'));
        } else {
            setTimeout(() => {
                resolve(`Waited for ${ms}ms`);
            }, ms);
        }
    });
}

// Usage
delay(1000)
    .then(result => console.log(result))
    .catch(error => console.error(error));
```

### Consuming Promises

```javascript
// Using .then() and .catch()
const fs = require('fs').promises;

fs.readFile('example.txt', 'utf8')
    .then(data => {
        console.log('File contents:', data);
        return data.toUpperCase();
    })
    .then(upperData => {
        console.log('Uppercase:', upperData);
    })
    .catch(err => {
        console.error('Error:', err.message);
    })
    .finally(() => {
        console.log('Operation complete');
    });
```

### Promise Chaining

```javascript
// promise-chain.js
const fs = require('fs').promises;

fs.readFile('file1.txt', 'utf8')
    .then(data1 => {
        console.log('Read file1');
        return fs.readFile('file2.txt', 'utf8')
            .then(data2 => data1 + data2);
    })
    .then(combined => {
        console.log('Read file2');
        return fs.writeFile('output.txt', combined);
    })
    .then(() => {
        console.log('Files combined successfully!');
    })
    .catch(err => {
        console.error('Error:', err.message);
    });
```

---

## Async/Await

Async/await makes asynchronous code look and behave like synchronous code.

### Basic async/await

```javascript
// async-await-basic.js
const fs = require('fs').promises;

async function readFiles() {
    try {
        const data1 = await fs.readFile('file1.txt', 'utf8');
        console.log('Read file1');

        const data2 = await fs.readFile('file2.txt', 'utf8');
        console.log('Read file2');

        const combined = data1 + data2;
        await fs.writeFile('output.txt', combined);

        console.log('Files combined successfully!');
    } catch (err) {
        console.error('Error:', err.message);
    }
}

readFiles();
```

### Rules of async/await

1. **`async` functions always return a Promise**
```javascript
async function example() {
    return 'Hello';
}

example().then(result => console.log(result)); // "Hello"
```

2. **`await` can only be used inside `async` functions**
```javascript
// ❌ WRONG
function wrong() {
    await someAsyncOperation(); // SyntaxError
}

// ✅ CORRECT
async function correct() {
    await someAsyncOperation();
}
```

3. **`await` pauses execution until Promise resolves**
```javascript
async function example() {
    console.log('Before');
    await delay(1000);
    console.log('After 1 second');
}
```

---

## Error Handling

### Try-Catch with async/await

```javascript
// error-handling.js
async function fetchUserData(userId) {
    try {
        const response = await fetch(`https://api.example.com/users/${userId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (err) {
        console.error('Failed to fetch user:', err.message);
        throw err; // Re-throw if you want caller to handle it
    }
}
```

### Multiple Error Handlers

```javascript
// multiple-errors.js
async function processData() {
    try {
        const data = await fetchData();

        try {
            await saveToDatabase(data);
        } catch (dbError) {
            console.error('Database error:', dbError);
            // Handle database error specifically
        }

    } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        // Handle fetch error specifically
    }
}
```

### Custom Error Classes

```javascript
// custom-errors.js
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

class DatabaseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DatabaseError';
    }
}

async function createUser(userData) {
    try {
        if (!userData.email) {
            throw new ValidationError('Email is required');
        }

        // Simulate database operation
        const success = await saveToDatabase(userData);

        if (!success) {
            throw new DatabaseError('Failed to save user');
        }

        return { success: true };

    } catch (err) {
        if (err instanceof ValidationError) {
            console.error('Validation failed:', err.message);
        } else if (err instanceof DatabaseError) {
            console.error('Database operation failed:', err.message);
        } else {
            console.error('Unexpected error:', err);
        }
        throw err;
    }
}
```

---

## Promise Combinators

### Promise.all() - Wait for all

```javascript
// promise-all.js
async function fetchMultipleUsers() {
    const userIds = [1, 2, 3, 4, 5];

    const promises = userIds.map(id =>
        fetch(`https://api.example.com/users/${id}`)
    );

    try {
        // Wait for ALL promises to resolve
        const responses = await Promise.all(promises);
        const users = await Promise.all(responses.map(r => r.json()));

        console.log('All users fetched:', users);
        return users;

    } catch (err) {
        console.error('One or more requests failed:', err);
        // If ANY promise rejects, Promise.all rejects
    }
}
```

### Promise.allSettled() - Wait for all, regardless of result

```javascript
// promise-allsettled.js
async function fetchWithFallback() {
    const promises = [
        fetch('https://api1.example.com/data'),
        fetch('https://api2.example.com/data'),
        fetch('https://api3.example.com/data')
    ];

    const results = await Promise.allSettled(promises);

    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            console.log(`API ${index + 1} succeeded:`, result.value);
        } else {
            console.log(`API ${index + 1} failed:`, result.reason);
        }
    });

    // Get all successful results
    const successful = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);

    return successful;
}
```

### Promise.race() - First to complete

```javascript
// promise-race.js
async function fetchWithTimeout(url, timeout = 5000) {
    const fetchPromise = fetch(url);

    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeout);
    });

    try {
        // Returns whichever completes first
        const response = await Promise.race([fetchPromise, timeoutPromise]);
        return await response.json();

    } catch (err) {
        console.error('Request failed or timed out:', err.message);
        throw err;
    }
}
```

### Promise.any() - First to fulfill

```javascript
// promise-any.js
async function fetchFromFastestServer() {
    const servers = [
        fetch('https://server1.example.com/data'),
        fetch('https://server2.example.com/data'),
        fetch('https://server3.example.com/data')
    ];

    try {
        // Returns first fulfilled promise
        // Rejects only if ALL promises reject
        const response = await Promise.any(servers);
        const data = await response.json();

        console.log('Got data from fastest server:', data);
        return data;

    } catch (err) {
        console.error('All servers failed:', err);
    }
}
```

---

## Parallel vs Sequential Execution

### Sequential (one after another)

```javascript
// sequential.js
async function sequential() {
    console.time('sequential');

    const result1 = await delay(1000);
    const result2 = await delay(1000);
    const result3 = await delay(1000);

    console.timeEnd('sequential'); // ~3000ms

    return [result1, result2, result3];
}
```

### Parallel (all at once)

```javascript
// parallel.js
async function parallel() {
    console.time('parallel');

    const [result1, result2, result3] = await Promise.all([
        delay(1000),
        delay(1000),
        delay(1000)
    ]);

    console.timeEnd('parallel'); // ~1000ms

    return [result1, result2, result3];
}
```

### Mixed (some parallel, some sequential)

```javascript
// mixed.js
async function mixed() {
    // Parallel execution
    const [user, posts] = await Promise.all([
        fetchUser(userId),
        fetchPosts(userId)
    ]);

    // Sequential (depends on previous results)
    const comments = await fetchComments(posts[0].id);

    return { user, posts, comments };
}
```

---

## Real-World Example: API Client

```javascript
// api-client.js
class APIClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();

        } catch (err) {
            console.error(`Request failed: ${endpoint}`, err.message);
            throw err;
        }
    }

    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // Retry logic
    async requestWithRetry(endpoint, options = {}, maxRetries = 3) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await this.request(endpoint, options);
            } catch (err) {
                if (attempt === maxRetries) throw err;

                console.log(`Attempt ${attempt} failed, retrying...`);
                await this.delay(1000 * attempt); // Exponential backoff
            }
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Usage
(async () => {
    const api = new APIClient('https://jsonplaceholder.typicode.com');

    try {
        // Fetch user and posts in parallel
        const [user, posts] = await Promise.all([
            api.get('/users/1'),
            api.get('/posts?userId=1')
        ]);

        console.log('User:', user.name);
        console.log('Posts:', posts.length);

        // Create new post
        const newPost = await api.post('/posts', {
            title: 'My New Post',
            body: 'This is the content',
            userId: 1
        });

        console.log('Created post:', newPost);

    } catch (err) {
        console.error('API error:', err.message);
    }
})();
```

---

## Best Practices

✅ **Use async/await** for cleaner code
✅ **Always handle errors** with try-catch
✅ **Use Promise.all()** for parallel operations
✅ **Don't mix callbacks and promises**
✅ **Don't forget to await** promises
✅ **Use Promise.allSettled()** when you need all results
✅ **Implement timeout logic** for network requests
✅ **Use async IIFE** for top-level await in Node < 14

---

## Common Mistakes

❌ Forgetting to await
```javascript
// ❌ WRONG
async function wrong() {
    const data = fetchData(); // Returns Promise, not data!
    console.log(data); // Promise object
}

// ✅ CORRECT
async function correct() {
    const data = await fetchData();
    console.log(data); // Actual data
}
```

❌ Sequential when parallel is possible
```javascript
// ❌ SLOW
const user = await fetchUser();
const posts = await fetchPosts(); // Waits for user first

// ✅ FAST
const [user, posts] = await Promise.all([
    fetchUser(),
    fetchPosts()
]);
```

❌ Not handling rejections
```javascript
// ❌ WRONG - Unhandled rejection
async function wrong() {
    await riskyOperation(); // No try-catch!
}

// ✅ CORRECT
async function correct() {
    try {
        await riskyOperation();
    } catch (err) {
        console.error(err);
    }
}
```

---

## Key Takeaways

✅ Callbacks are the foundation of async JavaScript
✅ Promises provide better control flow than callbacks
✅ async/await makes async code readable and maintainable
✅ Always handle errors in async operations
✅ Use Promise combinators for concurrent operations
✅ Understand when to use parallel vs sequential execution

---

## Congratulations! 🎉

You've completed Level 1: Beginner! You now understand:
- Node.js fundamentals
- Module system
- NPM package management
- File system operations
- Asynchronous programming

**Ready for the next challenge?**

**Continue to:** [Level 2: Intermediate](../level-2-intermediate/README.md)

---

## Additional Resources

- [MDN: Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN: async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [JavaScript.info: Async/await](https://javascript.info/async-await)
