# Lesson 3: Testing Node.js Applications

## 🎯 Learning Objectives

- Write unit tests with Jest
- Integration testing with Supertest
- Test databases with test containers
- Mocking and stubbing
- Code coverage

---

## Jest Setup

```bash
npm install --save-dev jest @types/jest
```

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "node",
    "coveragePathIgnorePatterns": ["/node_modules/"],
    "testMatch": ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"]
  }
}
```

---

## Unit Tests

```javascript
// utils/math.js
exports.add = (a, b) => a + b;
exports.multiply = (a, b) => a * b;
exports.divide = (a, b) => {
    if (b === 0) throw new Error('Division by zero');
    return a / b;
};

// utils/math.test.js
const { add, multiply, divide } = require('./math');

describe('Math utilities', () => {
    describe('add', () => {
        test('should add two numbers', () => {
            expect(add(2, 3)).toBe(5);
        });

        test('should handle negative numbers', () => {
            expect(add(-2, 3)).toBe(1);
        });
    });

    describe('divide', () => {
        test('should divide two numbers', () => {
            expect(divide(6, 2)).toBe(3);
        });

        test('should throw error for division by zero', () => {
            expect(() => divide(5, 0)).toThrow('Division by zero');
        });
    });
});
```

---

## Testing Express APIs

```bash
npm install --save-dev supertest
```

```javascript
// app.test.js
const request = require('supertest');
const app = require('./app');

describe('User API', () => {
    describe('GET /api/users', () => {
        test('should return all users', async () => {
            const response = await request(app)
                .get('/api/users')
                .expect(200)
                .expect('Content-Type', /json/);

            expect(response.body).toBeInstanceOf(Array);
        });
    });

    describe('POST /api/users', () => {
        test('should create a new user', async () => {
            const newUser = {
                name: 'John Doe',
                email: 'john@example.com'
            };

            const response = await request(app)
                .post('/api/users')
                .send(newUser)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe(newUser.name);
        });

        test('should return 400 for invalid data', async () => {
            const response = await request(app)
                .post('/api/users')
                .send({ name: 'A' })
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });
    });
});
```

---

## Database Testing

```javascript
// tests/setup.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany();
    }
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});
```

```javascript
// models/User.test.js
const User = require('./User');

describe('User Model', () => {
    test('should create a user', async () => {
        const user = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123'
        });

        expect(user._id).toBeDefined();
        expect(user.email).toBe('john@example.com');
        expect(user.password).not.toBe('password123'); // Should be hashed
    });

    test('should fail without required fields', async () => {
        const user = new User({ name: 'John' });

        await expect(user.save()).rejects.toThrow();
    });

    test('should not allow duplicate emails', async () => {
        await User.create({
            name: 'John',
            email: 'john@example.com',
            password: 'password'
        });

        await expect(
            User.create({
                name: 'Jane',
                email: 'john@example.com',
                password: 'password'
            })
        ).rejects.toThrow();
    });
});
```

---

## Mocking

```javascript
// services/emailService.js
const sendEmail = async (to, subject, body) => {
    // Send email logic
};

module.exports = { sendEmail };

// services/userService.test.js
const { sendEmail } = require('./emailService');
const UserService = require('./userService');

jest.mock('./emailService');

describe('UserService', () => {
    test('should send welcome email on registration', async () => {
        sendEmail.mockResolvedValue(true);

        const user = await UserService.register({
            name: 'John',
            email: 'john@example.com'
        });

        expect(sendEmail).toHaveBeenCalledWith(
            'john@example.com',
            'Welcome',
            expect.any(String)
        );
    });
});
```

---

## Async Testing

```javascript
describe('Async operations', () => {
    test('should fetch user data', async () => {
        const user = await fetchUser(1);
        expect(user.name).toBe('John');
    });

    test('should handle errors', async () => {
        await expect(fetchUser(999)).rejects.toThrow('User not found');
    });

    test('using done callback', (done) => {
        fetchUser(1).then(user => {
            expect(user.name).toBe('John');
            done();
        });
    });
});
```

---

## Test Coverage

```bash
npm test -- --coverage
```

```javascript
// jest.config.js
module.exports = {
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/**/*.test.js',
        '!src/index.js'
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
};
```

---

**Next:** [Lesson 4: Security Best Practices](./04-security.md)
