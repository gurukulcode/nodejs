#!/usr/bin/env node

/**
 * Problem Generator for Node.js Interview Problems
 * Generates markdown files for all 210 problems
 */

const fs = require('fs');
const path = require('path');

// Problem definitions
const problemsData = {
  // FRESHERS (0-1 years) - Problems #001-030
  freshers: {
    folder: '01-FRESHERS-0-1-YEARS',
    problems: [
      // Already created: #001-005

      // #006-008: Node.js Fundamentals (remaining)
      { num: 6, category: '01-nodejs-fundamentals', title: 'package.json and npm Basics', difficulty: 'Easy', tags: '#npm #package-json #dependencies' },
      { num: 7, category: '01-nodejs-fundamentals', title: 'Node.js Architecture and V8 Engine', difficulty: 'Easy', tags: '#architecture #v8 #runtime' },
      { num: 8, category: '01-nodejs-fundamentals', title: 'CommonJS vs ES6 Modules - When to Use What', difficulty: 'Medium', tags: '#modules #comparison #best-practices' },

      // #009-015: Basic Async Programming
      { num: 9, category: '02-basic-async', title: 'Callback Functions - Basics', difficulty: 'Easy', tags: '#callbacks #async #fundamentals' },
      { num: 10, category: '02-basic-async', title: 'Callback Hell and Solutions', difficulty: 'Medium', tags: '#callbacks #callback-hell #patterns' },
      { num: 11, category: '02-basic-async', title: 'Promises - Create and Use', difficulty: 'Easy', tags: '#promises #async #error-handling' },
      { num: 12, category: '02-basic-async', title: 'Promise Chaining and Error Handling', difficulty: 'Medium', tags: '#promises #chaining #catch' },
      { num: 13, category: '02-basic-async', title: 'Async/Await - Basics and Usage', difficulty: 'Easy', tags: '#async-await #promises #syntax' },
      { num: 14, category: '02-basic-async', title: 'setTimeout vs setImmediate vs process.nextTick', difficulty: 'Medium', tags: '#timers #event-loop #execution-order' },
      { num: 15, category: '02-basic-async', title: 'Synchronous vs Asynchronous Code Flow', difficulty: 'Easy', tags: '#sync #async #execution' },

      // #016-020: Basic File Operations
      { num: 16, category: '03-basic-file-operations', title: 'Read File Synchronously - fs.readFileSync()', difficulty: 'Easy', tags: '#fs #file-read #sync' },
      { num: 17, category: '03-basic-file-operations', title: 'Read File Asynchronously - fs.readFile()', difficulty: 'Easy', tags: '#fs #file-read #async' },
      { num: 18, category: '03-basic-file-operations', title: 'Write to File - Create and Append', difficulty: 'Easy', tags: '#fs #file-write #append' },
      { num: 19, category: '03-basic-file-operations', title: 'Check File Existence and Get Stats', difficulty: 'Easy', tags: '#fs #file-stats #exists' },
      { num: 20, category: '03-basic-file-operations', title: 'Path Module - Working with File Paths', difficulty: 'Easy', tags: '#path #file-paths #utilities' },

      // #021-026: Basic HTTP & Express
      { num: 21, category: '04-basic-http-express', title: 'Create HTTP Server Without Framework', difficulty: 'Easy', tags: '#http #server #basic' },
      { num: 22, category: '04-basic-http-express', title: 'Handle GET Requests and Query Parameters', difficulty: 'Easy', tags: '#http #get #query-params' },
      { num: 23, category: '04-basic-http-express', title: 'Handle POST Requests and Parse Body', difficulty: 'Medium', tags: '#http #post #body-parser' },
      { num: 24, category: '04-basic-http-express', title: 'Express.js - Basic Setup and Routing', difficulty: 'Easy', tags: '#express #routing #setup' },
      { num: 25, category: '04-basic-http-express', title: 'Create Simple REST API with CRUD Endpoints', difficulty: 'Medium', tags: '#express #rest-api #crud' },
      { num: 26, category: '04-basic-http-express', title: 'Middleware - Concept and Basic Usage', difficulty: 'Medium', tags: '#express #middleware #concepts' },

      // #027-030: Error Handling & Debugging
      { num: 27, category: '05-error-handling-debugging', title: 'Try-Catch in Synchronous Code', difficulty: 'Easy', tags: '#errors #try-catch #sync' },
      { num: 28, category: '05-error-handling-debugging', title: 'Error Handling in Callbacks', difficulty: 'Easy', tags: '#errors #callbacks #patterns' },
      { num: 29, category: '05-error-handling-debugging', title: 'Error Handling in Promises - .catch()', difficulty: 'Easy', tags: '#errors #promises #catch' },
      { num: 30, category: '05-error-handling-debugging', title: 'Basic Debugging Techniques', difficulty: 'Easy', tags: '#debugging #console #tools' },
    ]
  },

  // JUNIOR (1-2 years) - Problems #031-065
  junior: {
    folder: '02-JUNIOR-1-2-YEARS',
    problems: [
      // #031-038: Intermediate Async
      { num: 31, category: '01-intermediate-async', title: 'Convert Callback to Promise', difficulty: 'Easy', tags: '#promises #callbacks #conversion' },
      { num: 32, category: '01-intermediate-async', title: 'Promise.all() - Parallel Execution', difficulty: 'Medium', tags: '#promises #parallel #promise-all' },
      { num: 33, category: '01-intermediate-async', title: 'Promise.race() - First Settled Promise', difficulty: 'Medium', tags: '#promises #race #competition' },
      { num: 34, category: '01-intermediate-async', title: 'Promise.allSettled() vs Promise.all()', difficulty: 'Medium', tags: '#promises #comparison #error-handling' },
      { num: 35, category: '01-intermediate-async', title: 'Async/Await with Try-Catch', difficulty: 'Medium', tags: '#async-await #error-handling #try-catch' },
      { num: 36, category: '01-intermediate-async', title: 'Sequential vs Parallel Async Operations', difficulty: 'Medium', tags: '#async #performance #patterns' },
      { num: 37, category: '01-intermediate-async', title: 'Handle Multiple Async Errors', difficulty: 'Medium', tags: '#async #errors #multiple' },
      { num: 38, category: '01-intermediate-async', title: 'Promisify Node.js Callback Functions', difficulty: 'Medium', tags: '#promisify #util #conversion' },

      // #039-046: Express Deep Dive
      { num: 39, category: '02-express-deep-dive', title: 'Middleware Execution Order', difficulty: 'Medium', tags: '#express #middleware #order' },
      { num: 40, category: '02-express-deep-dive', title: 'Custom Logging Middleware', difficulty: 'Medium', tags: '#express #middleware #logging' },
      { num: 41, category: '02-express-deep-dive', title: 'Error Handling Middleware', difficulty: 'Medium', tags: '#express #errors #middleware' },
      { num: 42, category: '02-express-deep-dive', title: 'Router-Level Middleware', difficulty: 'Medium', tags: '#express #router #middleware' },
      { num: 43, category: '02-express-deep-dive', title: 'Serve Static Files', difficulty: 'Easy', tags: '#express #static #files' },
      { num: 44, category: '02-express-deep-dive', title: 'Request and Response Objects', difficulty: 'Medium', tags: '#express #req #res' },
      { num: 45, category: '02-express-deep-dive', title: 'Routing Patterns and Parameters', difficulty: 'Medium', tags: '#express #routing #params' },
      { num: 46, category: '02-express-deep-dive', title: 'HTTP Methods - PUT, DELETE, PATCH', difficulty: 'Medium', tags: '#express #http-methods #rest' },

      // Continue with remaining junior problems...
      { num: 47, category: '03-database-basics', title: 'Connect to MongoDB with Mongoose', difficulty: 'Easy', tags: '#mongodb #mongoose #connection' },
      { num: 48, category: '03-database-basics', title: 'Create Schema and Model', difficulty: 'Easy', tags: '#mongoose #schema #model' },
      { num: 49, category: '03-database-basics', title: 'CRUD Operations in MongoDB', difficulty: 'Medium', tags: '#mongodb #crud #operations' },
      { num: 50, category: '03-database-basics', title: 'Connect to PostgreSQL', difficulty: 'Easy', tags: '#postgresql #pg #connection' },
      { num: 51, category: '03-database-basics', title: 'Basic SQL Queries in Node.js', difficulty: 'Medium', tags: '#sql #queries #postgresql' },
      { num: 52, category: '03-database-basics', title: 'Handle Database Errors', difficulty: 'Medium', tags: '#database #errors #handling' },
      { num: 53, category: '03-database-basics', title: 'Environment Variables for Config', difficulty: 'Easy', tags: '#env #config #dotenv' },

      { num: 54, category: '04-input-validation-security', title: 'Validate Input with Joi', difficulty: 'Medium', tags: '#validation #joi #input' },
      { num: 55, category: '04-input-validation-security', title: 'Sanitize User Input (XSS Prevention)', difficulty: 'Medium', tags: '#security #xss #sanitization' },
      { num: 56, category: '04-input-validation-security', title: 'Parse and Validate JSON', difficulty: 'Easy', tags: '#json #validation #parsing' },
      { num: 57, category: '04-input-validation-security', title: 'Handle File Uploads with Multer', difficulty: 'Medium', tags: '#multer #uploads #files' },
      { num: 58, category: '04-input-validation-security', title: 'CORS - Enable and Configure', difficulty: 'Medium', tags: '#cors #security #headers' },
      { num: 59, category: '04-input-validation-security', title: 'Security Headers with Helmet', difficulty: 'Easy', tags: '#helmet #security #headers' },

      { num: 60, category: '05-streams-buffers', title: 'What are Buffers?', difficulty: 'Easy', tags: '#buffers #binary #data' },
      { num: 61, category: '05-streams-buffers', title: 'Read Large Files with Streams', difficulty: 'Medium', tags: '#streams #readable #files' },
      { num: 62, category: '05-streams-buffers', title: 'Write with Writable Streams', difficulty: 'Medium', tags: '#streams #writable #write' },
      { num: 63, category: '05-streams-buffers', title: 'Transform Streams', difficulty: 'Medium', tags: '#streams #transform #pipes' },
      { num: 64, category: '05-streams-buffers', title: 'Pipe Streams Together', difficulty: 'Medium', tags: '#streams #pipe #chain' },
      { num: 65, category: '05-streams-buffers', title: 'Stream Error Handling', difficulty: 'Medium', tags: '#streams #errors #handling' },
    ]
  }
};

// Template for problem generation
function generateProblemContent(problem) {
  const { num, title, difficulty, tags } = problem;
  const paddedNum = String(num).padStart(3, '0');

  return `# Problem #${paddedNum}: ${title}

**Difficulty**: ${difficulty === 'Easy' ? '🟢' : difficulty === 'Medium' ? '🟡' : '🔴'} ${difficulty}
**Category**: Node.js Interview Problems
**Experience Level**: Determined by folder level
**Topic Tags**: \`${tags}\`

---

## 📋 Problem Statement

Write a detailed problem statement here. This problem covers **${title}**.

**Requirements**:
1. Requirement 1
2. Requirement 2
3. Requirement 3

---

## 💡 Solution

### Approach

Explain the approach to solve this problem.

### Code Implementation

\`\`\`javascript
// solution-${paddedNum}.js

// TODO: Add implementation here

console.log('Problem #${paddedNum}: ${title}');
\`\`\`

### Explanation

Step-by-step explanation of the solution.

---

## 🎯 Key Concepts

- Concept 1
- Concept 2
- Concept 3

---

## ❓ Interview Questions

**Q1**: Common interview question related to this topic?
\`\`\`
A: Answer here
\`\`\`

**Q2**: Another interview question?
\`\`\`
A: Answer here
\`\`\`

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
**Difficulty**: ${difficulty === 'Easy' ? '🟢' : difficulty === 'Medium' ? '🟡' : '🔴'} ${difficulty}

---

*Problem #${paddedNum} - ${title}*
`;
}

// Generate problem files
function generateProblems() {
  Object.entries(problemsData).forEach(([level, data]) => {
    const { folder, problems } = data;
    const basePath = path.join(__dirname, folder);

    problems.forEach(problem => {
      const { num, category } = problem;
      const paddedNum = String(num).padStart(3, '0');
      const fileName = `problem-${paddedNum}-${problem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
      const filePath = path.join(basePath, category, fileName);

      // Skip if already exists
      if (fs.existsSync(filePath)) {
        console.log(`⏭️  Skipping (exists): ${fileName}`);
        return;
      }

      // Generate content
      const content = generateProblemContent(problem);

      // Write file
      try {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Created: Problem #${paddedNum} - ${problem.title}`);
      } catch (err) {
        console.error(`❌ Error creating ${fileName}:`, err.message);
      }
    });
  });

  console.log('\n🎉 Problem generation complete!');
}

// Run
generateProblems();
