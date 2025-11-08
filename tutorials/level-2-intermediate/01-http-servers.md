# Lesson 1: Building HTTP Servers

## 🎯 Learning Objectives

- Create HTTP servers using the built-in http module
- Handle different HTTP methods (GET, POST, PUT, DELETE)
- Parse URLs and query parameters
- Send various response types (HTML, JSON, files)
- Implement basic routing

---

## The HTTP Module

Node.js provides a built-in `http` module for creating web servers:

```javascript
// simple-server.js
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, World!');
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
```

Run with:
```bash
node simple-server.js
```

---

## Request and Response Objects

### Request Object (req)

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:', req.headers);

    res.end('Request logged');
});

server.listen(3000);
```

### Response Object (res)

```javascript
const server = http.createServer((req, res) => {
    // Set status code
    res.statusCode = 200;

    // Set headers
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Custom-Header', 'My Value');

    // Or use writeHead
    res.writeHead(200, {
        'Content-Type': 'text/html',
        'X-Powered-By': 'Node.js'
    });

    // Send response
    res.write('<h1>Hello, World!</h1>');
    res.end();
});
```

---

## Handling Different HTTP Methods

```javascript
// method-handler.js
const http = require('http');

const server = http.createServer((req, res) => {
    const { method, url } = req;

    if (method === 'GET' && url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Home Page</h1>');
    }
    else if (method === 'GET' && url === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>About Page</h1>');
    }
    else if (method === 'POST' && url === '/api/data') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ received: body }));
        });
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(3000);
```

---

## URL Parsing and Query Parameters

```javascript
// url-parsing.js
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    if (pathname === '/search') {
        const searchTerm = query.q;
        const page = query.page || 1;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            searchTerm,
            page,
            results: []
        }));
    }
    else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(3000);
// Visit: http://localhost:3000/search?q=nodejs&page=2
```

---

## Sending JSON Responses

```javascript
// json-server.js
const http = require('http');

const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

const server = http.createServer((req, res) => {
    const { method, url } = req;

    if (method === 'GET' && url === '/api/users') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    }
    else if (method === 'GET' && url.startsWith('/api/users/')) {
        const id = parseInt(url.split('/')[3]);
        const user = users.find(u => u.id === id);

        if (user) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(user));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'User not found' }));
        }
    }
    else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(3000);
```

---

## Serving Static Files

```javascript
// static-server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif'
};

const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
    const extname = path.extname(filePath);
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(3000);
```

---

## Building a RESTful API Server

```javascript
// rest-api-server.js
const http = require('http');
const url = require('url');

let todos = [
    { id: 1, title: 'Learn Node.js', completed: false },
    { id: 2, title: 'Build an API', completed: false }
];

let nextId = 3;

const server = http.createServer((req, res) => {
    const { method } = req;
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // GET /api/todos
    if (method === 'GET' && pathname === '/api/todos') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(todos));
    }
    // GET /api/todos/:id
    else if (method === 'GET' && pathname.match(/\/api\/todos\/\d+/)) {
        const id = parseInt(pathname.split('/')[3]);
        const todo = todos.find(t => t.id === id);

        if (todo) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(todo));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Todo not found' }));
        }
    }
    // POST /api/todos
    else if (method === 'POST' && pathname === '/api/todos') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const newTodo = JSON.parse(body);
                const todo = {
                    id: nextId++,
                    title: newTodo.title,
                    completed: false
                };
                todos.push(todo);

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(todo));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    }
    // PUT /api/todos/:id
    else if (method === 'PUT' && pathname.match(/\/api\/todos\/\d+/)) {
        const id = parseInt(pathname.split('/')[3]);
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const updates = JSON.parse(body);
                const index = todos.findIndex(t => t.id === id);

                if (index !== -1) {
                    todos[index] = { ...todos[index], ...updates };
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(todos[index]));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Todo not found' }));
                }
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    }
    // DELETE /api/todos/:id
    else if (method === 'DELETE' && pathname.match(/\/api\/todos\/\d+/)) {
        const id = parseInt(pathname.split('/')[3]);
        const index = todos.findIndex(t => t.id === id);

        if (index !== -1) {
            todos.splice(index, 1);
            res.writeHead(204);
            res.end();
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Todo not found' }));
        }
    }
    else {
        res.writeHead(404);
        res.end();
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

---

## Handling POST Data

```javascript
// post-handler.js
const http = require('http');

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();

            // Prevent large payloads
            if (body.length > 1e6) {
                req.connection.destroy();
                reject(new Error('Payload too large'));
            }
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                resolve(data);
            } catch (err) {
                reject(err);
            }
        });

        req.on('error', reject);
    });
}

const server = http.createServer(async (req, res) => {
    if (req.method === 'POST') {
        try {
            const data = await parseBody(req);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ received: data }));
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
    }
});

server.listen(3000);
```

---

## HTTP Status Codes

```javascript
const statusCodes = {
    // Success
    200: 'OK',
    201: 'Created',
    204: 'No Content',

    // Redirection
    301: 'Moved Permanently',
    302: 'Found',
    304: 'Not Modified',

    // Client Errors
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    422: 'Unprocessable Entity',

    // Server Errors
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable'
};

function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}
```

---

## Key Takeaways

✅ Node.js `http` module creates web servers easily
✅ Request object contains method, URL, headers, and body
✅ Response object sends data back to clients
✅ Parse URLs and query parameters for routing
✅ Handle different HTTP methods for RESTful APIs
✅ Use appropriate status codes for responses

---

**Next:** [Lesson 2: Introduction to Express.js](./02-express-basics.md)
