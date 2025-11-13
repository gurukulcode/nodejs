# Lesson 1: Introduction to Node.js & Environment Setup

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Understand what Node.js is and its use cases
- Know the differences between Node.js and browser JavaScript
- Install Node.js and npm on your system
- Set up your development environment
- Create and run your first Node.js script

---

## What is Node.js?

**Node.js** is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to run JavaScript on the server-side, outside of a web browser.

### Key Features:

1. **Asynchronous and Event-Driven** - All APIs are non-blocking
2. **Fast Execution** - Built on V8 engine
3. **Single-Threaded** - Uses event loop for concurrency
4. **Cross-Platform** - Runs on Windows, macOS, Linux
5. **Large Ecosystem** - npm has millions of packages

### Why Use Node.js?

✅ **Real-time applications** (chat, gaming, collaboration tools)
✅ **RESTful APIs and microservices**
✅ **Streaming applications**
✅ **Command-line tools**
✅ **Server-side rendering**
✅ **IoT applications**

### Node.js vs Browser JavaScript

| Feature | Node.js | Browser |
|---------|---------|---------|
| Environment | Server-side | Client-side |
| Global Object | `global` | `window` |
| Module System | CommonJS/ES6 | ES6 (with bundlers) |
| File System | Full access | Limited/No access |
| DOM | Not available | Available |
| APIs | OS, file system, network | DOM, Fetch, LocalStorage |

---

## Installing Node.js

### Option 1: Official Installer (Recommended for Beginners)

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the LTS (Long Term Support) version
3. Run the installer and follow instructions
4. Verify installation:

```bash
node --version
npm --version
```

### Option 2: Using NVM (Node Version Manager)

NVM allows you to install and switch between multiple Node.js versions.

**On macOS/Linux:**
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js
nvm install --lts
nvm use --lts
```

**On Windows:**
Use [nvm-windows](https://github.com/coreybutler/nvm-windows)

---

## Understanding npm

**npm** (Node Package Manager) comes bundled with Node.js and serves two main purposes:

1. **Package Registry** - World's largest software registry
2. **Dependency Manager** - Install and manage project dependencies

```bash
# Check npm version
npm --version

# Update npm
npm install -g npm@latest
```

---

## Setting Up Your Development Environment

### Recommended Code Editors:

1. **Visual Studio Code** (Most popular)
   - Install from [code.visualstudio.com](https://code.visualstudio.com/)
   - Recommended extensions:
     - ESLint
     - Prettier
     - Node.js Extension Pack
     - GitLens

2. **WebStorm** (Full-featured IDE)
3. **Sublime Text**
4. **Atom**

### Essential VS Code Extensions:

```bash
# Install via command line (optional)
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension christian-kohler.npm-intellisense
```

---

## Your First Node.js Script

Let's create and run a simple Node.js application!

### Step 1: Create a project directory

```bash
mkdir my-first-node-app
cd my-first-node-app
```

### Step 2: Create a JavaScript file

Create a file named `hello.js`:

```javascript
// hello.js
console.log('Hello, Node.js!');
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
```

### Step 3: Run the script

```bash
node hello.js
```

**Expected Output:**
```
Hello, Node.js!
Node version: v18.17.0
Platform: darwin
```

---

## Understanding the Node.js REPL

REPL stands for **Read-Eval-Print Loop**. It's an interactive shell for experimenting with Node.js.

```bash
# Start REPL
node

# Try these commands:
> 1 + 1
2
> const greeting = 'Hello, REPL!'
undefined
> greeting
'Hello, REPL!'
> .exit  // or press Ctrl+C twice
```

**Useful REPL Commands:**
- `.help` - Show REPL commands
- `.break` - Exit multi-line expression
- `.clear` - Clear context
- `.save filename` - Save REPL session
- `.load filename` - Load file into REPL

---

## The `process` Object

Node.js provides a global `process` object with useful information and methods:

```javascript
// process-info.js
console.log('Process ID:', process.pid);
console.log('Node Version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);
console.log('Current Directory:', process.cwd());
console.log('Memory Usage:', process.memoryUsage());
console.log('Uptime:', process.uptime(), 'seconds');

// Environment variables
console.log('Environment:', process.env.NODE_ENV);

// Command line arguments
console.log('Arguments:', process.argv);
```

Run with:
```bash
node process-info.js arg1 arg2
```

---

## Practical Exercise

### Exercise 1: Environment Check

Create a file `env-check.js` that displays:
- Node.js version
- npm version
- Operating system
- Current working directory
- Available memory

```javascript
// env-check.js
const os = require('os');

console.log('=== System Information ===');
console.log('Node.js Version:', process.version);
console.log('Operating System:', os.type(), os.release());
console.log('CPU Architecture:', os.arch());
console.log('CPU Cores:', os.cpus().length);
console.log('Total Memory:', (os.totalmem() / 1024 / 1024 / 1024).toFixed(2), 'GB');
console.log('Free Memory:', (os.freemem() / 1024 / 1024 / 1024).toFixed(2), 'GB');
console.log('Home Directory:', os.homedir());
console.log('Current Directory:', process.cwd());
```

### Exercise 2: Command Line Calculator

Create a simple calculator that takes command line arguments:

```javascript
// calculator.js
const args = process.argv.slice(2);
const num1 = parseFloat(args[0]);
const operator = args[1];
const num2 = parseFloat(args[2]);

let result;

switch(operator) {
    case '+':
        result = num1 + num2;
        break;
    case '-':
        result = num1 - num2;
        break;
    case '*':
        result = num1 * num2;
        break;
    case '/':
        result = num1 / num2;
        break;
    default:
        console.log('Invalid operator. Use +, -, *, or /');
        process.exit(1);
}

console.log(`${num1} ${operator} ${num2} = ${result}`);
```

Run with:
```bash
node calculator.js 10 + 5
node calculator.js 20 * 3
```

---

## Common Issues and Troubleshooting

### Issue 1: Command not found
```bash
node: command not found
```
**Solution:** Node.js is not in your PATH. Reinstall or add to PATH manually.

### Issue 2: Permission errors on macOS/Linux
```bash
Error: EACCES: permission denied
```
**Solution:** Don't use `sudo` with npm. Fix permissions:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Issue 3: Version conflicts
**Solution:** Use NVM to manage multiple Node.js versions.

---

## Key Takeaways

✅ Node.js is a JavaScript runtime for server-side development
✅ npm is the package manager that comes with Node.js
✅ Use `node filename.js` to run JavaScript files
✅ The `process` object provides system information
✅ REPL is great for quick experiments

---

## What's Next?

In the next lesson, we'll build our first real Node.js application and explore the event loop in detail.

**Next:** [Lesson 2: Your First Node.js Application](./02-first-application.md)

---

## Additional Resources

- [Node.js Official Documentation](https://nodejs.org/docs/)
- [Node.js Getting Started Guide](https://nodejs.dev/learn)
- [Understanding the Event Loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
