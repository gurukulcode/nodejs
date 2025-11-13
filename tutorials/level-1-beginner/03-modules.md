# Lesson 3: Working with Modules

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Understand the module system in Node.js
- Work with CommonJS modules (require/exports)
- Use ES6 modules (import/export)
- Create and organize your own modules
- Understand module resolution and caching

---

## Why Modules?

Modules help you:
- **Organize code** into reusable pieces
- **Avoid global namespace pollution**
- **Manage dependencies** between files
- **Enable code reusability** across projects
- **Improve maintainability** of large applications

---

## CommonJS Modules (require/module.exports)

CommonJS is the traditional module system in Node.js.

### Exporting from a Module

```javascript
// math-utils.js

// Method 1: Attach to exports object
exports.add = function(a, b) {
    return a + b;
};

exports.subtract = function(a, b) {
    return a - b;
};

exports.PI = 3.14159;
```

```javascript
// calculator.js

// Method 2: Assign to module.exports
module.exports = {
    multiply: function(a, b) {
        return a * b;
    },
    divide: function(a, b) {
        if (b === 0) throw new Error('Division by zero');
        return a / b;
    }
};
```

```javascript
// circle.js

// Method 3: Export a single function/class
class Circle {
    constructor(radius) {
        this.radius = radius;
    }

    area() {
        return Math.PI * this.radius ** 2;
    }

    circumference() {
        return 2 * Math.PI * this.radius;
    }
}

module.exports = Circle;
```

### Importing Modules

```javascript
// app.js

// Import entire module
const mathUtils = require('./math-utils');
console.log(mathUtils.add(5, 3)); // 8

// Import with destructuring
const { multiply, divide } = require('./calculator');
console.log(multiply(4, 5)); // 20

// Import single export
const Circle = require('./circle');
const myCircle = new Circle(5);
console.log(myCircle.area()); // 78.53...
```

---

## exports vs module.exports

Understanding the difference is crucial:

```javascript
// ❌ WRONG - This breaks the reference
exports = function() {
    console.log('This won\'t work!');
};

// ✅ CORRECT - Use module.exports for single export
module.exports = function() {
    console.log('This works!');
};

// ✅ CORRECT - Add properties to exports
exports.myFunction = function() {
    console.log('This also works!');
};
```

**Rule of thumb:**
- Use `exports.something` when exporting multiple things
- Use `module.exports` when exporting a single thing (function, class, object)

---

## ES6 Modules (import/export)

Modern JavaScript supports ES6 modules. To use them in Node.js:

### Enable ES6 Modules

**Option 1:** Use `.mjs` file extension
```javascript
// math.mjs
export const add = (a, b) => a + b;
```

**Option 2:** Add `"type": "module"` to package.json
```json
{
    "name": "my-app",
    "type": "module"
}
```

### Named Exports

```javascript
// utils.js
export const VERSION = '1.0.0';

export function greet(name) {
    return `Hello, ${name}!`;
}

export class User {
    constructor(name) {
        this.name = name;
    }
}

// Alternative syntax
const helper1 = () => {};
const helper2 = () => {};

export { helper1, helper2 };
```

### Default Export

```javascript
// logger.js
export default class Logger {
    constructor(name) {
        this.name = name;
    }

    log(message) {
        console.log(`[${this.name}] ${message}`);
    }
}

// Or
class Logger {
    // ...
}

export default Logger;
```

### Importing ES6 Modules

```javascript
// app.js

// Import default export
import Logger from './logger.js';

// Import named exports
import { greet, User, VERSION } from './utils.js';

// Import default and named together
import Logger, { VERSION } from './logger.js';

// Import everything
import * as Utils from './utils.js';

// Import with alias
import { greet as sayHello } from './utils.js';

// Import for side effects only
import './config.js';
```

---

## Built-in Node.js Modules

Node.js provides many built-in modules:

### File System (fs)

```javascript
// fs-demo.js
const fs = require('fs');

// Read file synchronously
const data = fs.readFileSync('file.txt', 'utf8');
console.log(data);

// Read file asynchronously (better!)
fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
});

// Write file
fs.writeFile('output.txt', 'Hello, World!', (err) => {
    if (err) throw err;
    console.log('File written successfully');
});
```

### Path Module

```javascript
// path-demo.js
const path = require('path');

// Join paths
const fullPath = path.join(__dirname, 'files', 'data.txt');
console.log(fullPath);

// Parse path
const parsed = path.parse('/home/user/file.txt');
console.log(parsed);
// {
//   root: '/',
//   dir: '/home/user',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file'
// }

// Get extension
console.log(path.extname('file.txt')); // .txt

// Get filename
console.log(path.basename('/home/user/file.txt')); // file.txt

// Get directory
console.log(path.dirname('/home/user/file.txt')); // /home/user
```

### OS Module

```javascript
// os-demo.js
const os = require('os');

console.log('Platform:', os.platform());
console.log('CPU Architecture:', os.arch());
console.log('CPU Info:', os.cpus());
console.log('Free Memory:', os.freemem());
console.log('Total Memory:', os.totalmem());
console.log('Home Directory:', os.homedir());
console.log('Temp Directory:', os.tmpdir());
console.log('Hostname:', os.hostname());
console.log('Network Interfaces:', os.networkInterfaces());
```

### URL Module

```javascript
// url-demo.js
const url = require('url');

const myUrl = new URL('https://example.com:8080/path/name?q=search&page=2#section');

console.log('Protocol:', myUrl.protocol);     // https:
console.log('Host:', myUrl.host);             // example.com:8080
console.log('Hostname:', myUrl.hostname);     // example.com
console.log('Port:', myUrl.port);             // 8080
console.log('Pathname:', myUrl.pathname);     // /path/name
console.log('Search:', myUrl.search);         // ?q=search&page=2
console.log('Hash:', myUrl.hash);             // #section

// URLSearchParams
const params = myUrl.searchParams;
console.log('Query param q:', params.get('q')); // search
console.log('Query param page:', params.get('page')); // 2
```

---

## Creating a Multi-File Project

Let's build a complete user management system:

### Project Structure:
```
user-management/
├── models/
│   └── User.js
├── utils/
│   ├── validator.js
│   └── logger.js
├── services/
│   └── userService.js
└── app.js
```

### models/User.js
```javascript
// models/User.js
class User {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.createdAt = new Date();
    }

    getInfo() {
        return `${this.name} (${this.email})`;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            createdAt: this.createdAt
        };
    }
}

module.exports = User;
```

### utils/validator.js
```javascript
// utils/validator.js
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validateName = (name) => {
    return name && name.length >= 2 && name.length <= 50;
};

module.exports = {
    validateEmail,
    validateName
};
```

### utils/logger.js
```javascript
// utils/logger.js
class Logger {
    static info(message) {
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
    }

    static error(message) {
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
    }

    static warn(message) {
        console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
    }
}

module.exports = Logger;
```

### services/userService.js
```javascript
// services/userService.js
const User = require('../models/User');
const { validateEmail, validateName } = require('../utils/validator');
const Logger = require('../utils/logger');

class UserService {
    constructor() {
        this.users = [];
        this.nextId = 1;
    }

    createUser(name, email) {
        if (!validateName(name)) {
            Logger.error('Invalid name');
            throw new Error('Invalid name');
        }

        if (!validateEmail(email)) {
            Logger.error('Invalid email');
            throw new Error('Invalid email');
        }

        const user = new User(this.nextId++, name, email);
        this.users.push(user);
        Logger.info(`User created: ${user.getInfo()}`);
        return user;
    }

    getUserById(id) {
        const user = this.users.find(u => u.id === id);
        if (!user) {
            Logger.warn(`User not found: ${id}`);
        }
        return user;
    }

    getAllUsers() {
        return this.users;
    }

    deleteUser(id) {
        const index = this.users.findIndex(u => u.id === id);
        if (index === -1) {
            Logger.error(`Cannot delete - User not found: ${id}`);
            return false;
        }
        this.users.splice(index, 1);
        Logger.info(`User deleted: ${id}`);
        return true;
    }
}

module.exports = UserService;
```

### app.js
```javascript
// app.js
const UserService = require('./services/userService');
const Logger = require('./utils/logger');

const userService = new UserService();

try {
    // Create users
    const user1 = userService.createUser('John Doe', 'john@example.com');
    const user2 = userService.createUser('Jane Smith', 'jane@example.com');
    const user3 = userService.createUser('Bob Johnson', 'bob@example.com');

    // Get all users
    console.log('\n=== All Users ===');
    userService.getAllUsers().forEach(user => {
        console.log(user.getInfo());
    });

    // Get user by ID
    console.log('\n=== Get User by ID ===');
    const found = userService.getUserById(2);
    if (found) {
        console.log(found.toJSON());
    }

    // Delete user
    console.log('\n=== Delete User ===');
    userService.deleteUser(1);

    // List remaining users
    console.log('\n=== Remaining Users ===');
    userService.getAllUsers().forEach(user => {
        console.log(user.getInfo());
    });

} catch (error) {
    Logger.error(error.message);
}
```

---

## Module Resolution

When you `require()` a module, Node.js follows these steps:

1. **Core modules** - Check if it's a built-in module (fs, path, etc.)
2. **File modules** - If starts with './', '../', or '/'
   - Try exact filename
   - Try adding `.js`
   - Try adding `.json`
   - Try adding `.node`
3. **Folder modules** - If path is a directory
   - Look for `package.json` and check "main" field
   - Try `index.js`
   - Try `index.json`
4. **node_modules** - Search up directory tree

```javascript
// Different ways to require
require('fs');                    // Core module
require('./myModule');            // Relative path
require('./myModule.js');         // With extension
require('../utils/helper');       // Parent directory
require('/absolute/path/module'); // Absolute path
require('lodash');                // node_modules
```

---

## Module Caching

Modules are cached after first load:

```javascript
// counter.js
let count = 0;

module.exports = {
    increment: () => ++count,
    getCount: () => count
};
```

```javascript
// app.js
const counter1 = require('./counter');
const counter2 = require('./counter');

counter1.increment();
console.log(counter1.getCount()); // 1
console.log(counter2.getCount()); // 1 (same instance!)

// Clear cache (rarely needed)
delete require.cache[require.resolve('./counter')];
```

---

## Circular Dependencies

Be careful with circular dependencies:

```javascript
// a.js
const b = require('./b');
console.log('In a.js, b.done =', b.done);
exports.done = true;

// b.js
const a = require('./a');
console.log('In b.js, a.done =', a.done);
exports.done = true;

// app.js
const a = require('./a');
const b = require('./b');
console.log('In app.js, a.done =', a.done, ', b.done =', b.done);

// Output:
// In b.js, a.done = undefined
// In a.js, b.done = true
// In app.js, a.done = true , b.done = true
```

**Best practice:** Avoid circular dependencies by restructuring code.

---

## Practical Exercises

### Exercise 1: String Utilities Module

Create a module with string manipulation functions:

```javascript
// string-utils.js
exports.capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

exports.reverse = (str) => {
    return str.split('').reverse().join('');
};

exports.truncate = (str, maxLength) => {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + '...';
};

exports.wordCount = (str) => {
    return str.trim().split(/\s+/).length;
};
```

### Exercise 2: Config Module

```javascript
// config.js
const config = {
    development: {
        port: 3000,
        dbUrl: 'mongodb://localhost:27017/myapp_dev'
    },
    production: {
        port: process.env.PORT || 8080,
        dbUrl: process.env.DB_URL
    },
    test: {
        port: 3001,
        dbUrl: 'mongodb://localhost:27017/myapp_test'
    }
};

const env = process.env.NODE_ENV || 'development';

module.exports = config[env];
```

---

## Key Takeaways

✅ Use CommonJS (`require`/`module.exports`) or ES6 modules (`import`/`export`)
✅ `exports` is a reference to `module.exports`
✅ Built-in modules provide essential functionality
✅ Organize code into logical modules and folders
✅ Modules are cached after first load
✅ Avoid circular dependencies

---

## What's Next?

In the next lesson, we'll learn about NPM and how to manage packages in your projects.

**Next:** [Lesson 4: NPM Package Management](./04-npm.md)

---

## Additional Resources

- [Node.js Modules Documentation](https://nodejs.org/api/modules.html)
- [ES6 Modules in Node.js](https://nodejs.org/api/esm.html)
- [Module Resolution Algorithm](https://nodejs.org/api/modules.html#modules_all_together)
