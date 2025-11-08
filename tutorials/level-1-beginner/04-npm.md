# Lesson 4: NPM Package Management

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Understand what npm is and how it works
- Create and configure package.json
- Install, update, and remove packages
- Understand semantic versioning
- Use npm scripts for automation
- Publish your own npm package

---

## What is npm?

**npm** (Node Package Manager) is:
- The world's largest software registry (2+ million packages)
- A command-line tool for managing dependencies
- Included automatically with Node.js

### npm vs npx vs yarn

| Tool | Purpose |
|------|---------|
| **npm** | Package manager and installer |
| **npx** | Execute packages without installing |
| **yarn** | Alternative package manager (by Facebook) |

---

## Understanding package.json

The `package.json` file is the heart of any Node.js project.

### Creating package.json

```bash
# Interactive mode (recommended)
npm init

# Use defaults
npm init -y

# Specify custom defaults
npm init --yes
```

### Complete package.json Example

```json
{
  "name": "my-awesome-app",
  "version": "1.0.0",
  "description": "A sample Node.js application",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "build": "webpack"
  },
  "keywords": ["sample", "nodejs", "demo"],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.22",
    "jest": "^29.5.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/username/repo"
  },
  "bugs": {
    "url": "https://github.com/username/repo/issues"
  },
  "homepage": "https://github.com/username/repo#readme"
}
```

### Key Fields Explained

- **name**: Package name (must be unique if publishing)
- **version**: Current version (follows semver)
- **description**: Brief description of the package
- **main**: Entry point file
- **scripts**: Automated commands
- **dependencies**: Production dependencies
- **devDependencies**: Development-only dependencies
- **engines**: Specify Node.js/npm version requirements

---

## Installing Packages

### Install as Dependency

```bash
# Latest version
npm install express

# Specific version
npm install express@4.18.0

# Version range
npm install express@^4.18.0

# Multiple packages
npm install express mongoose dotenv

# Shorthand
npm i express
```

### Install as Dev Dependency

```bash
npm install --save-dev nodemon
npm install -D jest eslint

# These are only needed during development
```

### Global Installation

```bash
# Install globally (available system-wide)
npm install -g nodemon
npm install -g create-react-app

# List global packages
npm list -g --depth=0
```

### Install from package.json

```bash
# Install all dependencies
npm install

# Install only production dependencies
npm install --production
```

---

## Semantic Versioning (semver)

Version format: `MAJOR.MINOR.PATCH` (e.g., 2.4.1)

- **MAJOR**: Breaking changes (2.0.0 → 3.0.0)
- **MINOR**: New features, backward-compatible (2.4.0 → 2.5.0)
- **PATCH**: Bug fixes (2.4.1 → 2.4.2)

### Version Ranges

```json
{
  "dependencies": {
    "express": "4.18.2",      // Exact version
    "lodash": "^4.17.21",     // Compatible (4.x.x, but < 5.0.0)
    "mongoose": "~6.10.0",    // Approximately (6.10.x)
    "axios": ">1.0.0",        // Greater than
    "moment": ">=2.29.0",     // Greater or equal
    "dotenv": "*",            // Any version (not recommended)
    "chalk": "latest"         // Latest version
  }
}
```

**Most common:** `^` (caret) - allows minor and patch updates

---

## package-lock.json

`package-lock.json` ensures consistent installations across environments:

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "lockfileVersion": 2,
  "requires": true,
  "packages": {
    "node_modules/express": {
      "version": "4.18.2",
      "resolved": "https://registry.npmjs.org/express/-/express-4.18.2.tgz",
      "integrity": "sha512-...",
      "dependencies": {
        "body-parser": "1.20.1",
        "cookie": "0.5.0"
      }
    }
  }
}
```

**Important:**
- Always commit `package-lock.json` to version control
- Don't edit it manually
- Ensures everyone uses the same package versions

---

## NPM Scripts

Automate common tasks using scripts:

### Basic Scripts

```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "jest",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

Run with:
```bash
npm start
npm run dev
npm test
npm run lint
```

### Advanced Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "lint": "eslint . --ext .js",
    "lint:fix": "eslint . --ext .js --fix",
    "format": "prettier --write \"**/*.{js,json,md}\"",
    "clean": "rm -rf dist node_modules",
    "prebuild": "npm run clean",
    "build": "webpack --mode production",
    "postbuild": "echo 'Build complete!'",
    "deploy": "npm run build && npm run upload",
    "upload": "scp -r dist/* user@server:/path"
  }
}
```

### Pre and Post Hooks

npm automatically runs `pre<script>` before and `post<script>` after a script:

```json
{
  "scripts": {
    "pretest": "echo 'Preparing tests...'",
    "test": "jest",
    "posttest": "echo 'Tests complete!'"
  }
}
```

### Passing Arguments

```bash
npm run test -- --watch
npm run dev -- --port=3001
```

---

## Managing Dependencies

### Update Packages

```bash
# Check for outdated packages
npm outdated

# Update all packages (respecting semver)
npm update

# Update specific package
npm update express

# Update to latest (ignoring semver)
npm install express@latest
```

### Remove Packages

```bash
# Remove from dependencies
npm uninstall express

# Remove from devDependencies
npm uninstall -D nodemon

# Shorthand
npm un lodash
npm rm axios
```

### Audit Security

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Force fix (may include breaking changes)
npm audit fix --force
```

---

## Useful npm Commands

### Information Commands

```bash
# View package info
npm info express

# View package versions
npm view express versions

# List installed packages
npm list
npm list --depth=0  # Only top-level

# Search for packages
npm search express

# View package documentation
npm docs express

# View package repository
npm repo express
```

### Cache Commands

```bash
# Clear npm cache
npm cache clean --force

# Verify cache integrity
npm cache verify
```

### Configuration

```bash
# View all config
npm config list

# Get specific config
npm config get prefix

# Set config
npm config set init-author-name "Your Name"

# Delete config
npm config delete proxy
```

---

## Creating a Useful CLI Tool

Let's create a simple npm package - a weather CLI tool:

### Project Structure
```
weather-cli/
├── bin/
│   └── weather.js
├── lib/
│   └── api.js
├── package.json
└── README.md
```

### package.json
```json
{
  "name": "simple-weather-cli",
  "version": "1.0.0",
  "description": "A simple weather CLI tool",
  "main": "lib/api.js",
  "bin": {
    "weather": "./bin/weather.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["weather", "cli", "forecast"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "axios": "^1.4.0",
    "chalk": "^4.1.2",
    "commander": "^11.0.0"
  }
}
```

### bin/weather.js
```javascript
#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const { getWeather } = require('../lib/api');

program
  .version('1.0.0')
  .description('A simple weather CLI tool')
  .argument('<city>', 'city name')
  .option('-u, --units <type>', 'units (metric/imperial)', 'metric')
  .action(async (city, options) => {
    try {
      console.log(chalk.blue(`Fetching weather for ${city}...`));
      const weather = await getWeather(city, options.units);

      console.log(chalk.green('\n✓ Weather Information:'));
      console.log(chalk.white(`Temperature: ${weather.temp}°${options.units === 'metric' ? 'C' : 'F'}`));
      console.log(chalk.white(`Condition: ${weather.description}`));
      console.log(chalk.white(`Humidity: ${weather.humidity}%`));

    } catch (error) {
      console.error(chalk.red(`✗ Error: ${error.message}`));
      process.exit(1);
    }
  });

program.parse(process.argv);
```

### lib/api.js
```javascript
const axios = require('axios');

async function getWeather(city, units = 'metric') {
  const API_KEY = process.env.WEATHER_API_KEY || 'demo';
  const url = `https://api.openweathermap.org/data/2.5/weather`;

  try {
    const response = await axios.get(url, {
      params: {
        q: city,
        units: units,
        appid: API_KEY
      }
    });

    return {
      temp: response.data.main.temp,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity
    };
  } catch (error) {
    throw new Error('Failed to fetch weather data');
  }
}

module.exports = { getWeather };
```

### Test Locally

```bash
# Make executable
chmod +x bin/weather.js

# Link package locally
npm link

# Test the command
weather London
weather "New York" --units imperial
```

---

## Publishing to npm

### Prerequisites

```bash
# Create npm account at npmjs.com
# Login to npm
npm login

# Verify login
npm whoami
```

### Prepare for Publishing

1. **Choose a unique name** - Check availability:
```bash
npm search exact-package-name
```

2. **Update package.json**:
```json
{
  "name": "@yourusername/package-name",
  "version": "1.0.0",
  "description": "Clear description",
  "keywords": ["relevant", "keywords"],
  "repository": {
    "type": "git",
    "url": "https://github.com/username/repo"
  }
}
```

3. **Add .npmignore**:
```
node_modules/
.env
*.log
test/
.git
```

### Publish Package

```bash
# Publish public package
npm publish

# Publish scoped package publicly
npm publish --access public

# Update version and publish
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
npm publish
```

### Unpublish (within 72 hours)

```bash
npm unpublish package-name@version
```

---

## Best Practices

✅ **Always use package-lock.json**
✅ **Specify engine versions** in package.json
✅ **Use semantic versioning** properly
✅ **Run `npm audit`** regularly
✅ **Keep dependencies updated**
✅ **Use `devDependencies`** for development tools
✅ **Don't commit node_modules** to git
✅ **Use npm scripts** for automation
✅ **Document your package** with good README

---

## Practical Exercise

Create a package called "json-formatter-cli" that:
1. Reads a JSON file
2. Formats it with proper indentation
3. Optionally minifies JSON
4. Can be used as a CLI tool

```bash
json-format input.json
json-format input.json --minify
json-format input.json --output formatted.json
```

---

## Key Takeaways

✅ npm manages dependencies for Node.js projects
✅ package.json defines project metadata and dependencies
✅ Use semver for version management
✅ npm scripts automate common tasks
✅ Always audit packages for security issues
✅ You can publish your own packages to npm

---

## What's Next?

In the next lesson, we'll explore file system operations in Node.js.

**Next:** [Lesson 5: File System Operations](./05-file-system.md)

---

## Additional Resources

- [npm Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
- [npm Package Best Practices](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
