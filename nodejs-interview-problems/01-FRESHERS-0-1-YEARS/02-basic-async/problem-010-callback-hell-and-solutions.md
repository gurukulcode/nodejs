# Problem #010: Callback Hell and Solutions

**Difficulty**: 🟡 Medium
**Topic Tags**: `#callbacks` `#callback-hell` `#patterns` `#async`

---

## 📋 Problem Statement

Demonstrate the "Callback Hell" (Pyramid of Doom) problem and provide multiple solutions to avoid it.

**Requirements**:
1. Show example of callback hell
2. Refactor using named functions
3. Refactor using Promises
4. Refactor using async/await

---

## 💡 Solution

### Part 1: The Problem - Callback Hell

```javascript
// callback-hell-example.js - BAD CODE

const fs = require('fs');

function getUserData(userId) {
  fs.readFile(`users/${userId}.json`, 'utf8', (err, userData) => {
    if (err) return console.error(err);
    const user = JSON.parse(userData);

    fs.readFile(`posts/${user.postId}.json`, 'utf8', (err, postData) => {
      if (err) return console.error(err);
      const post = JSON.parse(postData);

      fs.readFile(`comments/${post.commentId}.json`, 'utf8', (err, commentData) => {
        if (err) return console.error(err);
        const comment = JSON.parse(commentData);

        fs.readFile(`likes/${comment.likeId}.json`, 'utf8', (err, likeData) => {
          if (err) return console.error(err);
          const likes = JSON.parse(likeData);
          console.log('Data:', { user, post, comment, likes });
        });
      });
    });
  });
}

// ❌ Hard to read, maintain, debug (Pyramid of Doom)
```

### Solution 1: Promises

```javascript
// solution-promises.js

const fs = require('fs').promises;

async function readJSON(file) {
  const data = await fs.readFile(file, 'utf8');
  return JSON.parse(data);
}

function getUserData(userId) {
  return readJSON(`users/${userId}.json`)
    .then(user => readJSON(`posts/${user.postId}.json`)
      .then(post => readJSON(`comments/${post.commentId}.json`)
        .then(comment => readJSON(`likes/${comment.likeId}.json`)
          .then(likes => ({ user, post, comment, likes }))
        )
      )
    );
}

// ✅ Better but still chainable
```

### Solution 2: Async/Await (BEST)

```javascript
// solution-async-await.js - RECOMMENDED

const fs = require('fs').promises;

async function readJSON(file) {
  const data = await fs.readFile(file, 'utf8');
  return JSON.parse(data);
}

async function getUserData(userId) {
  try {
    const user = await readJSON(`users/${userId}.json`);
    const post = await readJSON(`posts/${user.postId}.json`);
    const comment = await readJSON(`comments/${post.commentId}.json`);
    const likes = await readJSON(`likes/${comment.likeId}.json`);

    return { user, post, comment, likes };
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
}

// Usage
(async () => {
  const data = await getUserData('user123');
  console.log('All data:', data);
})();

// ✅ Clean, readable, looks synchronous!
```

---

## 🎯 Key Concepts

- Concept 1
- Concept 2
- Concept 3

---

## ❓ Interview Questions

**Q1**: Common interview question related to this topic?
```
A: Answer here
```

**Q2**: Another interview question?
```
A: Answer here
```

---

## 🚫 Common Mistakes

1. ❌ Mistake 1
2. ❌ Mistake 2
3. ❌ Mistake 3

---

## ✅ Best Practices

1. ✅ Best practice 1
2. ✅ Best practice 2
3. ✅ Best practice 3

---

## 🔗 Related Problems

- Problem #XXX: Related problem
- Problem #YYY: Related problem

---

## 📚 Further Reading

- [Official Documentation](https://nodejs.org)
- [MDN Web Docs](https://developer.mozilla.org)

---

**Estimated Time**: 20-30 minutes
**Difficulty**: 🟡 Medium

---

*Problem #010 - Callback Hell and Solutions*
