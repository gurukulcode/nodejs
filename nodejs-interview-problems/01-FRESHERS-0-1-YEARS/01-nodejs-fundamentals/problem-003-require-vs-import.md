# Problem #003: require() vs import - Module Systems

**Difficulty**: 🟢 Easy
**Category**: Node.js Fundamentals
**Experience Level**: 0-1 years (Freshers)
**Topic Tags**: `#modules` `#commonjs` `#es6` `#import` `#require`

---

## 📋 Problem Statement

**Question 1**: What is the difference between `require()` and `import` in Node.js?

**Question 2**: Write examples demonstrating both CommonJS and ES6 module syntax.

**Question 3**: When should you use each module system?

---

## 💡 Solution

### Part 1: Module Systems Overview

#### CommonJS (require/module.exports)
- **Original** Node.js module system
- **Synchronous** loading
- **Dynamic** imports possible
- **Runtime** evaluation
- Default in Node.js until v12

#### ES6 Modules (import/export)
- **Modern** JavaScript standard
- **Asynchronous** loading (static analysis)
- **Static** imports only
- **Compile-time** evaluation
- Supported in Node.js v12+ with `.mjs` or `"type": "module"`

---

### Part 2: CommonJS - require() and module.exports

#### Example 1: Basic CommonJS Export

```javascript
// math.js - CommonJS module
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;

// Export multiple functions
module.exports = {
  add,
  subtract,
  multiply
};

// OR export individually
// module.exports.add = add;
// module.exports.subtract = subtract;
```

```javascript
// app.js - Using CommonJS require
const math = require('./math');

console.log(math.add(5, 3));      // 8
console.log(math.subtract(5, 3)); // 2
console.log(math.multiply(5, 3)); // 15

// Destructuring
const { add, multiply } = require('./math');
console.log(add(10, 5));      // 15
console.log(multiply(10, 5)); // 50
```

#### Example 2: Different Export Patterns

```javascript
// user.js - Export a single function
module.exports = function createUser(name) {
  return { name, createdAt: new Date() };
};

// usage.js
const createUser = require('./user');
const user = createUser('John');
```

```javascript
// database.js - Export a class
class Database {
  constructor(url) {
    this.url = url;
  }

  connect() {
    console.log(`Connected to ${this.url}`);
  }
}

module.exports = Database;

// usage.js
const Database = require('./database');
const db = new Database('mongodb://localhost');
db.connect();
```

---

### Part 3: ES6 Modules - import and export

#### Example 1: Basic ES6 Export

```javascript
// math.mjs - ES6 module (or use package.json with "type": "module")
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;

// Default export
export default function divide(a, b) {
  return a / b;
}
```

```javascript
// app.mjs - Using ES6 import
import divide, { add, subtract, multiply } from './math.mjs';

console.log(add(5, 3));      // 8
console.log(subtract(5, 3)); // 2
console.log(multiply(5, 3)); // 15
console.log(divide(6, 2));   // 3

// Import all
import * as math from './math.mjs';
console.log(math.add(5, 3)); // 8
```

#### Example 2: Named vs Default Exports

```javascript
// user.mjs
// Named exports
export const createUser = (name) => ({ name, id: Date.now() });
export const deleteUser = (id) => console.log(`Deleted user ${id}`);

// Default export
export default class User {
  constructor(name) {
    this.name = name;
  }
}
```

```javascript
// app.mjs
import User, { createUser, deleteUser } from './user.mjs';

const user1 = new User('Alice');
const user2 = createUser('Bob');
deleteUser(123);
```

---

### Part 4: Key Differences

| Feature | require() (CommonJS) | import (ES6 Modules) |
|---------|---------------------|---------------------|
| **Loading** | Synchronous | Asynchronous |
| **Nature** | Dynamic | Static |
| **When Loaded** | Runtime | Parse time |
| **Conditional** | ✅ Yes | ❌ No (must be top-level) |
| **File Extension** | .js (default) | .mjs or "type": "module" |
| **Tree Shaking** | ❌ No | ✅ Yes |
| **Browser Support** | ❌ No | ✅ Yes |
| **Default in Node** | ✅ Yes (< v12) | Opt-in |

---

### Part 5: Dynamic vs Static Imports

#### CommonJS - Dynamic (Runtime)

```javascript
// ✅ WORKS - Dynamic require
let moduleName = 'fs';
const module = require(moduleName);

// ✅ WORKS - Conditional require
if (process.env.NODE_ENV === 'development') {
  const devTools = require('./dev-tools');
  devTools.enable();
}

// ✅ WORKS - Require inside function
function loadModule() {
  const data = require('./data');
  return data;
}
```

#### ES6 - Static (Compile Time)

```javascript
// ❌ ERROR - Cannot use variable
let moduleName = 'fs';
import module from moduleName; // SyntaxError

// ❌ ERROR - Cannot use conditionally
if (condition) {
  import module from './module.mjs'; // SyntaxError
}

// ✅ WORKS - Dynamic import (Promise-based)
if (condition) {
  const module = await import('./module.mjs');
  module.doSomething();
}

// ✅ WORKS - Top-level only
import fs from 'fs';
```

---

### Part 6: Enabling ES6 Modules in Node.js

#### Method 1: Use .mjs Extension

```javascript
// math.mjs
export const add = (a, b) => a + b;

// app.mjs
import { add } from './math.mjs';
```

#### Method 2: package.json with "type": "module"

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js"
}
```

```javascript
// Now .js files use ES6 modules
// math.js
export const add = (a, b) => a + b;

// app.js
import { add } from './math.js';
```

#### Method 3: Use .cjs for CommonJS when "type": "module"

```json
{
  "type": "module"
}
```

```javascript
// config.cjs - CommonJS in ES6 project
module.exports = {
  port: 3000,
  db: 'mongodb://localhost'
};

// app.js (ES6)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const config = require('./config.cjs');
```

---

### Part 7: Complete Working Example

#### Project Structure:
```
my-project/
├── package.json
├── utils/
│   ├── math-commonjs.js
│   └── math-es6.mjs
├── app-commonjs.js
└── app-es6.mjs
```

#### math-commonjs.js (CommonJS):
```javascript
// utils/math-commonjs.js
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = { add, subtract };
```

#### app-commonjs.js:
```javascript
// app-commonjs.js
const { add, subtract } = require('./utils/math-commonjs');

console.log('CommonJS Example:');
console.log('5 + 3 =', add(5, 3));
console.log('5 - 3 =', subtract(5, 3));
```

#### math-es6.mjs (ES6):
```javascript
// utils/math-es6.mjs
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export default function multiply(a, b) {
  return a * b;
}
```

#### app-es6.mjs:
```javascript
// app-es6.mjs
import multiply, { add, subtract } from './utils/math-es6.mjs';

console.log('ES6 Module Example:');
console.log('5 + 3 =', add(5, 3));
console.log('5 - 3 =', subtract(5, 3));
console.log('5 * 3 =', multiply(5, 3));
```

#### Run:
```bash
node app-commonjs.js  # CommonJS
node app-es6.mjs      # ES6
```

---

### Part 8: When to Use Each

#### Use CommonJS (require) when:
- ✅ Working with older Node.js versions
- ✅ Need dynamic imports
- ✅ Most npm packages use it
- ✅ Quick scripts
- ✅ Backward compatibility needed

#### Use ES6 Modules (import) when:
- ✅ Modern Node.js projects (v12+)
- ✅ Want tree-shaking (remove unused code)
- ✅ Browser compatibility needed
- ✅ TypeScript projects
- ✅ Future-proof code

---

## 🎯 Key Takeaways

1. **require()** = CommonJS = Synchronous = Dynamic = Default Node.js
2. **import** = ES6 = Asynchronous = Static = Modern standard
3. Both can coexist in a project (with proper configuration)
4. ES6 modules are the future but CommonJS still widely used
5. Use `.mjs` or `"type": "module"` for ES6 in Node.js

---

## ❓ Interview Questions

**Q1: Can you use require() and import in the same file?**
```
A: No, you cannot mix them in the same file. A file is either
CommonJS or ES6 module. However, you can use createRequire()
in ES6 modules to load CommonJS modules.
```

**Q2: What is tree shaking and which module system supports it?**
```
A: Tree shaking removes unused code during bundling. Only ES6
modules support it because imports are static and can be
analyzed at compile time.
```

**Q3: Why can't you conditionally import ES6 modules?**
```
A: ES6 imports are static and resolved at parse time, before
code execution. Use dynamic import() for conditional loading.
```

---

## 🚫 Common Mistakes

1. ❌ Mixing require and import in same file
2. ❌ Forgetting `.mjs` extension or package.json configuration
3. ❌ Using variables in import statements
4. ❌ Conditional imports with static import
5. ❌ Not understanding default vs named exports

---

## ✅ Best Practices

1. ✅ Stick to one module system per project if possible
2. ✅ Use ES6 modules for new projects
3. ✅ Use named exports for better refactoring
4. ✅ Document which module system you're using
5. ✅ Use dynamic import() for code splitting

---

## 📚 Further Reading

- [Node.js Modules Documentation](https://nodejs.org/api/modules.html)
- [ES6 Modules Specification](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

---

**Estimated Time**: 25-35 minutes
**Difficulty**: 🟢 Easy

---

*[← Previous](./problem-002-blocking-vs-non-blocking.md) | [Next →](./problem-004-module-exports-vs-exports.md)*
