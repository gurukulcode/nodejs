# Lesson 2: Docker & Containerization

## 🎯 Learning Objectives

- Create Dockerfiles for Node.js
- Docker Compose for multi-container apps
- Container optimization
- Development vs Production images
- Docker networking

---

## Basic Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source
COPY . .

# Expose port
EXPOSE 3000

# Start app
CMD ["node", "server.js"]
```

---

## Multi-stage Build

```dockerfile
# Stage 1: Build
FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/server.js"]
```

---

## Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mongodb://mongo:27017/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis
    networks:
      - app-network

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app
    networks:
      - app-network

volumes:
  mongo-data:

networks:
  app-network:
    driver: bridge
```

---

## Development Docker Compose

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev
```

```dockerfile
# Dockerfile.dev
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
```

---

## .dockerignore

```
node_modules
npm-debug.log
.env
.git
.gitignore
README.md
.dockerignore
Dockerfile
docker-compose.yml
.vscode
coverage
.nyc_output
dist
```

---

## Health Checks

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node healthcheck.js || exit 1
```

```javascript
// healthcheck.js
const http = require('http');

const options = {
    host: 'localhost',
    port: 3000,
    path: '/health',
    timeout: 2000
};

const request = http.request(options, (res) => {
    if (res.statusCode === 200) {
        process.exit(0);
    } else {
        process.exit(1);
    }
});

request.on('error', () => {
    process.exit(1);
});

request.end();
```

---

## Docker Commands

```bash
# Build image
docker build -t myapp:latest .

# Run container
docker run -d -p 3000:3000 --name myapp myapp:latest

# View logs
docker logs -f myapp

# Execute command in container
docker exec -it myapp sh

# Docker Compose
docker-compose up -d
docker-compose down
docker-compose logs -f

# Clean up
docker system prune -a
```

---

**Next:** [Lesson 3: CI/CD Pipelines](./03-cicd.md)
