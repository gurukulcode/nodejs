# Lesson 2: Introduction to Express.js

## 🎯 Learning Objectives

- Install and set up Express.js
- Create routes and handle requests
- Use middleware functions
- Serve static files
- Template rendering with EJS/Pug

---

## What is Express.js?

Express is a minimal and flexible Node.js web application framework that provides:
- Robust routing
- HTTP helpers
- Middleware support
- Template engine integration
- Content negotiation

---

## Installation and Setup

```bash
# Initialize project
npm init -y

# Install Express
npm install express

# Install nodemon for development
npm install --save-dev nodemon
```

Update `package.json`:
```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  }
}
```

---

## Basic Express Server

```javascript
// app.js
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

---

## Routing

### Basic Routes

```javascript
const express = require('express');
const app = express();

// GET request
app.get('/', (req, res) => {
    res.send('Home Page');
});

// POST request
app.post('/api/users', (req, res) => {
    res.send('Create user');
});

// PUT request
app.put('/api/users/:id', (req, res) => {
    res.send(`Update user ${req.params.id}`);
});

// DELETE request
app.delete('/api/users/:id', (req, res) => {
    res.send(`Delete user ${req.params.id}`);
});

// Handle all methods
app.all('/secret', (req, res) => {
    res.send('Access granted');
});

app.listen(3000);
```

### Route Parameters

```javascript
// URL parameters
app.get('/users/:userId/posts/:postId', (req, res) => {
    const { userId, postId } = req.params;
    res.json({ userId, postId });
});

// Query parameters
app.get('/search', (req, res) => {
    const { q, page, limit } = req.query;
    res.json({ query: q, page, limit });
});
// Visit: /search?q=nodejs&page=1&limit=10
```

### Route Patterns

```javascript
// Pattern matching
app.get('/users/:id(\\d+)', (req, res) => {
    res.send(`User ID: ${req.params.id}`);
});

// Optional parameters
app.get('/posts/:year/:month?', (req, res) => {
    res.json(req.params);
});

// Wildcard
app.get('/files/*', (req, res) => {
    res.send(req.params[0]);
});
```

---

## Middleware

Middleware functions have access to request, response, and next function.

### Built-in Middleware

```javascript
const express = require('express');
const app = express();

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

app.post('/api/data', (req, res) => {
    console.log(req.body);
    res.json({ received: req.body });
});
```

### Custom Middleware

```javascript
// Logger middleware
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next(); // Pass control to next middleware
};

app.use(logger);

// Authentication middleware
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];

    if (token === 'secret-token') {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

app.get('/protected', authenticate, (req, res) => {
    res.json({ message: 'Protected data' });
});
```

### Third-party Middleware

```bash
npm install morgan cors helmet compression
```

```javascript
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const app = express();

// Security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Request logging
app.use(morgan('combined'));

// Response compression
app.use(compression());

app.use(express.json());
```

---

## Response Methods

```javascript
app.get('/examples', (req, res) => {
    // Send string
    res.send('Hello');

    // Send JSON
    res.json({ message: 'Hello' });

    // Send status
    res.sendStatus(404); // Sends "Not Found"

    // Set status and send
    res.status(201).json({ created: true });

    // Redirect
    res.redirect('/new-url');
    res.redirect(301, '/permanent-url');

    // Download file
    res.download('/path/to/file.pdf');

    // Send file
    res.sendFile(__dirname + '/index.html');

    // Render template
    res.render('index', { title: 'Home' });
});
```

---

## Router Module

Organize routes into separate files:

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json([{ id: 1, name: 'John' }]);
});

router.get('/:id', (req, res) => {
    res.json({ id: req.params.id, name: 'John' });
});

router.post('/', (req, res) => {
    res.status(201).json(req.body);
});

router.put('/:id', (req, res) => {
    res.json({ id: req.params.id, ...req.body });
});

router.delete('/:id', (req, res) => {
    res.status(204).send();
});

module.exports = router;
```

```javascript
// app.js
const express = require('express');
const usersRouter = require('./routes/users');

const app = express();

app.use(express.json());
app.use('/api/users', usersRouter);

app.listen(3000);
```

---

## Error Handling

```javascript
// 404 handler (place after all routes)
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
});

// Async error handling
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/async-route', asyncHandler(async (req, res) => {
    const data = await someAsyncOperation();
    res.json(data);
}));
```

---

## Template Engines

### Using EJS

```bash
npm install ejs
```

```javascript
// app.js
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home Page',
        users: ['John', 'Jane', 'Bob']
    });
});

app.listen(3000);
```

```html
<!-- views/index.ejs -->
<!DOCTYPE html>
<html>
<head>
    <title><%= title %></title>
</head>
<body>
    <h1><%= title %></h1>
    <ul>
        <% users.forEach(user => { %>
            <li><%= user %></li>
        <% }); %>
    </ul>
</body>
</html>
```

---

## Complete CRUD API Example

```javascript
// app.js
const express = require('express');
const app = express();

app.use(express.json());

let books = [
    { id: 1, title: 'Node.js Guide', author: 'John Doe' },
    { id: 2, title: 'Express Handbook', author: 'Jane Smith' }
];

let nextId = 3;

// GET all books
app.get('/api/books', (req, res) => {
    res.json(books);
});

// GET single book
app.get('/api/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));

    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
});

// CREATE book
app.post('/api/books', (req, res) => {
    const { title, author } = req.body;

    if (!title || !author) {
        return res.status(400).json({ error: 'Title and author required' });
    }

    const book = { id: nextId++, title, author };
    books.push(book);

    res.status(201).json(book);
});

// UPDATE book
app.put('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }

    books[index] = { id, ...req.body };
    res.json(books[index]);
});

// DELETE book
app.delete('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }

    books.splice(index, 1);
    res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

---

## Best Practices

✅ Use router modules to organize routes
✅ Implement proper error handling
✅ Use middleware for cross-cutting concerns
✅ Validate input data
✅ Use environment variables for configuration
✅ Enable CORS when needed
✅ Add security headers with Helmet
✅ Log requests in production

---

## Key Takeaways

✅ Express simplifies HTTP server creation
✅ Middleware functions process requests
✅ Router modules organize code
✅ Template engines render dynamic HTML
✅ Proper error handling is essential

---

**Next:** [Lesson 3: Routing and Middleware](./03-routing-middleware.md)
