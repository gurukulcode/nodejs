# Lesson 4: Working with Databases

## 🎯 Learning Objectives

- Connect to MongoDB using Mongoose
- Define schemas and models
- Perform CRUD operations
- Work with PostgreSQL and Sequelize
- Implement data validation

---

## MongoDB with Mongoose

### Installation

```bash
npm install mongoose
```

### Connection

```javascript
// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/myapp', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
```

### Schema and Model

```javascript
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email']
    },
    age: {
        type: Number,
        min: 18,
        max: 120
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Instance method
userSchema.methods.getPublicProfile = function() {
    return {
        name: this.name,
        email: this.email
    };
};

// Static method
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email });
};

module.exports = mongoose.model('User', userSchema);
```

### CRUD Operations

```javascript
const User = require('./models/User');

// CREATE
const createUser = async () => {
    const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
    });
    await user.save();
};

// READ
const getUsers = async () => {
    const users = await User.find({ isActive: true })
        .select('name email')
        .sort({ createdAt: -1 })
        .limit(10);
    return users;
};

// UPDATE
const updateUser = async (id) => {
    const user = await User.findByIdAndUpdate(
        id,
        { age: 31 },
        { new: true, runValidators: true }
    );
    return user;
};

// DELETE
const deleteUser = async (id) => {
    await User.findByIdAndDelete(id);
};
```

### Query Operators

```javascript
// Comparison
User.find({ age: { $gte: 18, $lte: 65 } });
User.find({ role: { $in: ['admin', 'moderator'] } });

// Logical
User.find({ $or: [{ age: { $lt: 18 } }, { isActive: false }] });
User.find({ $and: [{ age: { $gte: 18 } }, { role: 'admin' }] });

// Text search
User.find({ name: { $regex: /john/i } });

// Existence
User.find({ phone: { $exists: true } });
```

---

## PostgreSQL with Sequelize

### Installation

```bash
npm install sequelize pg pg-hstore
```

### Connection

```javascript
// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
});

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL connected');
    } catch (err) {
        console.error('Unable to connect:', err);
    }
};

module.exports = { sequelize, testConnection };
```

### Model Definition

```javascript
// models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            len: [3, 100]
        }
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    age: {
        type: DataTypes.INTEGER,
        validate: {
            min: 18,
            max: 120
        }
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    }
}, {
    timestamps: true,
    tableName: 'users'
});

module.exports = User;
```

### Associations

```javascript
// One-to-Many
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// Many-to-Many
User.belongsToMany(Group, { through: 'UserGroups' });
Group.belongsToMany(User, { through: 'UserGroups' });

// Query with associations
const user = await User.findOne({
    where: { id: 1 },
    include: [{ model: Post, as: 'posts' }]
});
```

---

## Complete API with MongoDB

```javascript
// app.js
const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/User');

const app = express();
app.use(express.json());

connectDB();

// Create user
app.post('/api/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000);
```

---

**Next:** [Lesson 5: RESTful APIs](./05-restful-apis.md)
