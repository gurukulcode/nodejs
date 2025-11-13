# Lesson 4: Production Deployment

## 🎯 Learning Objectives

- Deploy to cloud platforms (AWS, Azure, GCP)
- Process management with PM2
- Environment configuration
- SSL/TLS setup with Nginx
- Zero-downtime deployments

---

## PM2 Process Manager

```bash
npm install -g pm2
```

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'myapp',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    merge_logs: true,
    max_memory_restart: '1G',
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    min_uptime: '10s',
    max_restarts: 10,
    autorestart: true
  }]
};
```

```bash
# PM2 commands
pm2 start ecosystem.config.js
pm2 list
pm2 logs
pm2 monit
pm2 restart myapp
pm2 stop myapp
pm2 delete myapp

# Save configuration
pm2 save
pm2 startup
```

---

## Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/myapp
upstream backend {
    least_conn;
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    listen 80;
    server_name example.com www.example.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com www.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript;

    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /static {
        alias /var/www/myapp/public;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## Deploy to AWS EC2

```bash
# Connect to EC2
ssh -i key.pem ubuntu@ec2-instance.amazonaws.com

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone https://github.com/username/repo.git
cd repo

# Install dependencies
npm ci --production

# Configure environment
cp .env.example .env
nano .env

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Install Nginx
sudo apt install -y nginx

# Configure Nginx
sudo nano /etc/nginx/sites-available/myapp
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# SSL with Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d example.com -d www.example.com
```

---

## Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create myapp

# Add buildpack
heroku buildpacks:set heroku/nodejs

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL=mongodb://...

# Deploy
git push heroku main

# View logs
heroku logs --tail

# Scale
heroku ps:scale web=2
```

```json
// Procfile
web: node server.js
```

---

## Deploy to DigitalOcean App Platform

```yaml
# .do/app.yaml
name: myapp
region: nyc

services:
  - name: web
    github:
      repo: username/repo
      branch: main
      deploy_on_push: true
    build_command: npm run build
    run_command: npm start
    environment_slug: node-js
    instance_count: 2
    instance_size_slug: basic-xs
    envs:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        value: ${db.DATABASE_URL}

databases:
  - name: db
    engine: MONGODB
    version: "6"
```

---

## Docker Deployment

```bash
# Build and push to registry
docker build -t username/myapp:latest .
docker push username/myapp:latest

# On server
docker pull username/myapp:latest
docker run -d \
  --name myapp \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  username/myapp:latest
```

---

## Zero-Downtime Deployment

```bash
#!/bin/bash
# deploy.sh

# Pull latest code
git pull origin main

# Install dependencies
npm ci --production

# Run database migrations
npm run migrate

# Reload PM2
pm2 reload ecosystem.config.js --update-env

# Check if app is running
sleep 5
pm2 describe myapp | grep -q "online" || exit 1

echo "Deployment successful!"
```

---

## Health Check Endpoint

```javascript
// routes/health.js
router.get('/health', async (req, res) => {
    try {
        // Check database
        await mongoose.connection.db.admin().ping();

        // Check Redis
        await redisClient.ping();

        res.json({
            status: 'healthy',
            timestamp: new Date(),
            uptime: process.uptime(),
            memory: process.memoryUsage()
        });
    } catch (err) {
        res.status(503).json({
            status: 'unhealthy',
            error: err.message
        });
    }
});
```

---

**Next:** [Lesson 5: Monitoring and Logging](./05-monitoring.md)
