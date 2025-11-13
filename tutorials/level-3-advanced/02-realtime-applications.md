# Lesson 2: Real-time Applications with WebSockets

## 🎯 Learning Objectives

- Understand WebSocket protocol
- Implement Socket.io for real-time communication
- Build a chat application
- Handle rooms and namespaces
- Broadcasting and private messaging

---

## WebSockets vs HTTP

| HTTP | WebSockets |
|------|------------|
| Request-Response | Full-duplex |
| Stateless | Stateful connection |
| New connection per request | Persistent connection |
| Higher latency | Low latency |

---

## Socket.io Setup

```bash
npm install socket.io
```

```javascript
// server.js
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

---

## Basic Events

```javascript
// Server-side
io.on('connection', (socket) => {
    // Listen to events from client
    socket.on('message', (data) => {
        console.log('Received:', data);

        // Send to sender
        socket.emit('response', { message: 'Received' });

        // Send to everyone except sender
        socket.broadcast.emit('newMessage', data);

        // Send to everyone including sender
        io.emit('broadcast', data);
    });

    // Custom events
    socket.on('joinRoom', (room) => {
        socket.join(room);
        io.to(room).emit('userJoined', socket.id);
    });
});
```

```javascript
// Client-side
const socket = io('http://localhost:3000');

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.emit('message', { text: 'Hello, Server!' });

socket.on('response', (data) => {
    console.log('Server response:', data);
});
```

---

## Chat Application

```javascript
// server.js
const users = {};

io.on('connection', (socket) => {
    // User joins
    socket.on('join', ({ username, room }) => {
        socket.join(room);

        users[socket.id] = { username, room };

        // Welcome message to user
        socket.emit('message', {
            username: 'System',
            text: `Welcome to ${room}!`,
            timestamp: new Date()
        });

        // Notify room
        socket.broadcast.to(room).emit('message', {
            username: 'System',
            text: `${username} has joined`,
            timestamp: new Date()
        });

        // Update room users
        io.to(room).emit('roomUsers', {
            room,
            users: getRoomUsers(room)
        });
    });

    // Listen for chat message
    socket.on('chatMessage', (message) => {
        const user = users[socket.id];

        io.to(user.room).emit('message', {
            username: user.username,
            text: message,
            timestamp: new Date()
        });
    });

    // User disconnects
    socket.on('disconnect', () => {
        const user = users[socket.id];

        if (user) {
            io.to(user.room).emit('message', {
                username: 'System',
                text: `${user.username} has left`,
                timestamp: new Date()
            });

            // Update room users
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });

            delete users[socket.id];
        }
    });
});

function getRoomUsers(room) {
    return Object.values(users)
        .filter(user => user.room === room)
        .map(user => user.username);
}
```

---

## Rooms and Namespaces

```javascript
// Namespaces
const adminNsp = io.of('/admin');
const userNsp = io.of('/user');

adminNsp.on('connection', (socket) => {
    console.log('Admin connected');
});

userNsp.on('connection', (socket) => {
    console.log('User connected');
});

// Rooms
io.on('connection', (socket) => {
    // Join room
    socket.join('room1');

    // Join multiple rooms
    socket.join(['room1', 'room2']);

    // Leave room
    socket.leave('room1');

    // Send to specific room
    io.to('room1').emit('announcement', 'Message to room1');

    // Send to multiple rooms
    io.to('room1').to('room2').emit('multi-room', 'data');
});
```

---

## Authentication

```javascript
const socketio = require('socket.io');
const jwt = require('jsonwebtoken');

const io = socketio(server);

// Middleware
io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        next();
    } catch (err) {
        next(new Error('Authentication error'));
    }
});

io.on('connection', (socket) => {
    console.log('Authenticated user:', socket.userId);
});

// Client-side
const socket = io('http://localhost:3000', {
    auth: {
        token: 'your-jwt-token'
    }
});
```

---

## Private Messaging

```javascript
io.on('connection', (socket) => {
    // Private message
    socket.on('privateMessage', ({ to, message }) => {
        io.to(to).emit('privateMessage', {
            from: socket.id,
            message,
            timestamp: new Date()
        });
    });

    // Typing indicator
    socket.on('typing', ({ room }) => {
        socket.broadcast.to(room).emit('typing', {
            user: users[socket.id].username
        });
    });

    socket.on('stopTyping', ({ room }) => {
        socket.broadcast.to(room).emit('stopTyping', {
            user: users[socket.id].username
        });
    });
});
```

---

## Real-time Notifications

```javascript
// Notification system
const notificationNsp = io.of('/notifications');

notificationNsp.use(authenticateSocket);

notificationNsp.on('connection', (socket) => {
    // Join user's personal notification room
    socket.join(`user:${socket.userId}`);
});

// Send notification to specific user
function notifyUser(userId, notification) {
    notificationNsp.to(`user:${userId}`).emit('notification', {
        id: generateId(),
        ...notification,
        timestamp: new Date()
    });
}

// Usage in your API
router.post('/posts', authenticate, async (req, res) => {
    const post = await Post.create({
        ...req.body,
        authorId: req.user._id
    });

    // Notify followers
    const followers = await getFollowers(req.user._id);
    followers.forEach(followerId => {
        notifyUser(followerId, {
            type: 'new_post',
            message: `${req.user.name} created a new post`,
            data: { postId: post._id }
        });
    });

    res.status(201).json(post);
});
```

---

## Broadcasting Updates

```javascript
// Live data updates
router.put('/posts/:id', authenticate, async (req, res) => {
    const post = await Post.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    // Broadcast update
    io.emit('postUpdated', post);

    res.json(post);
});

router.delete('/posts/:id', authenticate, async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);

    // Broadcast deletion
    io.emit('postDeleted', req.params.id);

    res.status(204).send();
});
```

---

## Key Takeaways

✅ WebSockets enable real-time bidirectional communication
✅ Socket.io simplifies WebSocket implementation
✅ Use rooms for group communication
✅ Implement authentication for secure connections
✅ Broadcasting keeps all clients synchronized

---

**Next:** [Lesson 3: Testing Node.js Applications](./03-testing.md)
