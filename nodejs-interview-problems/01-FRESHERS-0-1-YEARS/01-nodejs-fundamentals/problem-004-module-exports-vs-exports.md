# Problem #004: module.exports vs exports

**Difficulty**: 🟢 Easy
**Category**: Node.js Fundamentals
**Experience Level**: 0-1 years
**Topic Tags**: `#modules` `#exports` `#commonjs`

---

## 📋 Problem

Explain the difference between `module.exports` and `exports`. Why doesn't `exports = {}` work?

---

## 💡 Solution

### The Truth About exports

```javascript
// At the beginning of every module, Node.js does this:
var module = { exports: {} };
var exports = module.exports; // exports is just a reference!

// What gets returned from require():
return module.exports; // NOT exports!
```

### Example 1: exports works (adding properties)

```javascript
// math.js
exports.add = (a, b) => a + b;
exports.subtract = (a, b) => a - b;
// Works because we're adding to the same object

// app.js
const math = require('./math');
console.log(math.add(5, 3)); // 8 ✅
```

### Example 2: exports fails (reassignment)

```javascript
// math.js
exports = { add: (a, b) => a + b }; // ❌ DOESN'T WORK!
// Why? We broke the reference! exports now points to new object
// but module.exports still points to original {}

// app.js
const math = require('./math');
console.log(math); // {} (empty object) ❌
```

### Example 3: module.exports works (reassignment)

```javascript
// math.js
module.exports = { add: (a, b) => a + b }; // ✅ WORKS!
// We directly set what will be returned

// app.js
const math = require('./math');
console.log(math.add(5, 3)); // 8 ✅
```

### Visual Representation

```
Initial State:
┌─────────┐      ┌──────────────┐
│ exports │─────>│ { }          │<──── module.exports
└─────────┘      └──────────────┘

After exports.add = fn:
┌─────────┐      ┌──────────────┐
│ exports │─────>│ { add: fn }  │<──── module.exports  ✅ Both point to same object
└─────────┘      └──────────────┘

After exports = {}:
┌─────────┐      ┌──────────────┐
│ exports │──X   │ { }          │<──── module.exports  ❌ Broken reference
└────┬────┘      └──────────────┘
     │
     └─> { } (new object, ignored)
```

### Complete Example

```javascript
// user.js - Different approaches

// Approach 1: Using exports (adding properties)
exports.createUser = (name) => ({ name });
exports.deleteUser = (id) => console.log(`Deleted ${id}`);

// Approach 2: Using module.exports (reassignment)
module.exports = {
  createUser: (name) => ({ name }),
  deleteUser: (id) => console.log(`Deleted ${id}`)
};

// Approach 3: Export a class
module.exports = class User {
  constructor(name) {
    this.name = name;
  }
};

// Approach 4: Export a single function
module.exports = function(name) {
  return { name };
};
```

---

## 🎯 Key Rules

| Pattern | Works? | Reason |
|---------|--------|--------|
| `exports.foo = bar` | ✅ Yes | Adding property to object |
| `module.exports.foo = bar` | ✅ Yes | Adding property to object |
| `module.exports = {...}` | ✅ Yes | Directly setting return value |
| `exports = {...}` | ❌ No | Breaking the reference |

---

## ❓ Interview Questions

**Q: What is the default value of module.exports?**
A: An empty object `{}`

**Q: Can you use both exports and module.exports in the same file?**
A: Technically yes, but confusing. If you use module.exports, it overrides anything set on exports.

**Q: What gets returned from require()?**
A: The value of `module.exports` (not `exports`)

---

## 🚫 Common Mistakes

```javascript
// ❌ WRONG
exports = { foo: 'bar' };

// ✅ CORRECT
module.exports = { foo: 'bar' };

// ✅ ALSO CORRECT
exports.foo = 'bar';
```

---

## ✅ Best Practice

**Use `module.exports` for clarity**. It's clearer about intent and works for all cases.

```javascript
// Recommended approach
module.exports = {
  foo,
  bar,
  baz
};
```

---

**Estimated Time**: 15 minutes
**Difficulty**: 🟢 Easy

*[← Previous](./problem-003-require-vs-import.md) | [Next →](./problem-005-global-objects.md)*
