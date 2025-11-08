# Lesson 2: Your First Node.js Application

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Understand the Node.js event loop
- Work with timers and asynchronous operations
- Create a basic command-line application
- Understand global objects in Node.js
- Handle user input and output

---

## Understanding the Node.js Event Loop

The **Event Loop** is what allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded.

### How It Works:

```
   ┌───────────────────────────┐
┌─>│           timers          │ - setTimeout(), setInterval()
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │ - I/O callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │ - Internal use
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │ - Retrieve new I/O events
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │ - setImmediate()
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │ - socket.on('close', ...)
   └───────────────────────────┘
```

### Event Loop Example:

```javascript
// event-loop-demo.js
console.log('Start');

setTimeout(() => {
    console.log('Timeout 1');
}, 0);

setImmediate(() => {
    console.log('Immediate 1');
});

process.nextTick(() => {
    console.log('Next Tick 1');
});

console.log('End');

// Output:
// Start
// End
// Next Tick 1
// Timeout 1
// Immediate 1
```

**Key Points:**
- `process.nextTick()` executes before any I/O events
- `setTimeout()` executes in the timers phase
- `setImmediate()` executes in the check phase

---

## Working with Timers

### setTimeout() - Execute once after delay

```javascript
// timers-example.js
console.log('Starting timer...');

const timeoutId = setTimeout(() => {
    console.log('This runs after 2 seconds');
}, 2000);

// Cancel timeout if needed
// clearTimeout(timeoutId);
```

### setInterval() - Execute repeatedly

```javascript
// interval-example.js
let counter = 0;

const intervalId = setInterval(() => {
    counter++;
    console.log(`Tick ${counter}`);

    if (counter === 5) {
        clearInterval(intervalId);
        console.log('Timer stopped');
    }
}, 1000);
```

### setImmediate() - Execute after current event loop

```javascript
// immediate-example.js
console.log('Before immediate');

setImmediate(() => {
    console.log('Immediate callback');
});

console.log('After immediate');

// Output:
// Before immediate
// After immediate
// Immediate callback
```

---

## Global Objects in Node.js

Unlike browsers, Node.js has different global objects:

```javascript
// globals-demo.js

// __filename - Current file's absolute path
console.log('Current file:', __filename);

// __dirname - Current directory's absolute path
console.log('Current directory:', __dirname);

// global - Global namespace (like window in browsers)
global.myGlobalVar = 'Hello Global';
console.log(global.myGlobalVar);

// console - For debugging output
console.log('Standard output');
console.error('Error output');
console.warn('Warning output');
console.table([{name: 'John', age: 30}, {name: 'Jane', age: 25}]);

// Buffer - For handling binary data
const buf = Buffer.from('Hello Buffer');
console.log(buf);
console.log(buf.toString());
```

---

## Handling User Input

### Reading from stdin (Standard Input)

```javascript
// input-basic.js
console.log('What is your name?');

process.stdin.on('data', (data) => {
    const name = data.toString().trim();
    console.log(`Hello, ${name}!`);
    process.exit();
});
```

### Using readline module

```javascript
// readline-example.js
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('What is your name? ', (name) => {
    rl.question('How old are you? ', (age) => {
        console.log(`Hello ${name}, you are ${age} years old!`);
        rl.close();
    });
});

rl.on('close', () => {
    console.log('Goodbye!');
    process.exit(0);
});
```

---

## Building a Simple To-Do List Application

Let's build a command-line to-do list application:

```javascript
// todo-app.js
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let todos = [];

function showMenu() {
    console.log('\n=== TO-DO LIST ===');
    console.log('1. Add task');
    console.log('2. View tasks');
    console.log('3. Complete task');
    console.log('4. Delete task');
    console.log('5. Exit');
    console.log('==================\n');

    rl.question('Choose an option: ', handleMenuChoice);
}

function handleMenuChoice(choice) {
    switch(choice.trim()) {
        case '1':
            addTask();
            break;
        case '2':
            viewTasks();
            break;
        case '3':
            completeTask();
            break;
        case '4':
            deleteTask();
            break;
        case '5':
            console.log('Goodbye!');
            rl.close();
            break;
        default:
            console.log('Invalid option!');
            showMenu();
    }
}

function addTask() {
    rl.question('Enter task description: ', (description) => {
        todos.push({
            id: todos.length + 1,
            description: description,
            completed: false
        });
        console.log('Task added successfully!');
        showMenu();
    });
}

function viewTasks() {
    console.log('\n--- Your Tasks ---');
    if (todos.length === 0) {
        console.log('No tasks yet!');
    } else {
        todos.forEach((todo) => {
            const status = todo.completed ? '✓' : '○';
            console.log(`${status} ${todo.id}. ${todo.description}`);
        });
    }
    showMenu();
}

function completeTask() {
    rl.question('Enter task ID to complete: ', (id) => {
        const task = todos.find(t => t.id === parseInt(id));
        if (task) {
            task.completed = true;
            console.log('Task completed!');
        } else {
            console.log('Task not found!');
        }
        showMenu();
    });
}

function deleteTask() {
    rl.question('Enter task ID to delete: ', (id) => {
        const index = todos.findIndex(t => t.id === parseInt(id));
        if (index !== -1) {
            todos.splice(index, 1);
            console.log('Task deleted!');
        } else {
            console.log('Task not found!');
        }
        showMenu();
    });
}

// Start the application
console.log('Welcome to your To-Do List!');
showMenu();
```

Run the application:
```bash
node todo-app.js
```

---

## Working with Process Exit Codes

Exit codes indicate how a program terminated:

```javascript
// exit-codes.js

// Success
process.exit(0);

// Failure
process.exit(1);

// Handle exit gracefully
process.on('exit', (code) => {
    console.log(`Process exiting with code: ${code}`);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
    console.log('\nGracefully shutting down...');
    process.exit(0);
});
```

---

## Practical Exercises

### Exercise 1: Countdown Timer

Create a countdown timer that takes seconds as input:

```javascript
// countdown.js
const seconds = parseInt(process.argv[2]) || 10;

let remaining = seconds;

console.log(`Countdown starting from ${seconds} seconds...`);

const interval = setInterval(() => {
    console.log(remaining);
    remaining--;

    if (remaining < 0) {
        clearInterval(interval);
        console.log('Time\'s up!');
    }
}, 1000);
```

### Exercise 2: Simple Quiz App

```javascript
// quiz.js
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const questions = [
    {
        question: 'What is the capital of France?',
        answer: 'paris'
    },
    {
        question: 'What is 2 + 2?',
        answer: '4'
    },
    {
        question: 'What language is Node.js written in?',
        answer: 'javascript'
    }
];

let currentQuestion = 0;
let score = 0;

function askQuestion() {
    if (currentQuestion >= questions.length) {
        console.log(`\nQuiz complete! Your score: ${score}/${questions.length}`);
        rl.close();
        return;
    }

    const q = questions[currentQuestion];

    rl.question(`\nQ${currentQuestion + 1}: ${q.question} `, (answer) => {
        if (answer.toLowerCase().trim() === q.answer.toLowerCase()) {
            console.log('Correct!');
            score++;
        } else {
            console.log(`Wrong! The answer is: ${q.answer}`);
        }
        currentQuestion++;
        askQuestion();
    });
}

console.log('=== Welcome to the Quiz! ===\n');
askQuestion();
```

### Exercise 3: Number Guessing Game

```javascript
// guess-number.js
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

console.log('=== Number Guessing Game ===');
console.log('I\'m thinking of a number between 1 and 100...\n');

function makeGuess() {
    rl.question('Enter your guess: ', (input) => {
        const guess = parseInt(input);
        attempts++;

        if (isNaN(guess)) {
            console.log('Please enter a valid number!');
            makeGuess();
            return;
        }

        if (guess === secretNumber) {
            console.log(`\n🎉 Congratulations! You guessed it in ${attempts} attempts!`);
            rl.close();
        } else if (guess < secretNumber) {
            console.log('Too low! Try again.');
            makeGuess();
        } else {
            console.log('Too high! Try again.');
            makeGuess();
        }
    });
}

makeGuess();
```

---

## Understanding process.argv

Command-line arguments are available through `process.argv`:

```javascript
// args-demo.js
console.log('All arguments:', process.argv);
console.log('\nParsed arguments:');

// process.argv[0] - node executable path
// process.argv[1] - script file path
// process.argv[2+] - your arguments

const args = process.argv.slice(2);

args.forEach((arg, index) => {
    console.log(`Argument ${index + 1}:`, arg);
});

// Parse named arguments
const namedArgs = {};
args.forEach(arg => {
    if (arg.startsWith('--')) {
        const [key, value] = arg.substring(2).split('=');
        namedArgs[key] = value || true;
    }
});

console.log('\nNamed arguments:', namedArgs);
```

Run with:
```bash
node args-demo.js arg1 arg2 --name=John --verbose
```

---

## Key Takeaways

✅ The event loop enables non-blocking I/O in Node.js
✅ Use `setTimeout`, `setInterval`, and `setImmediate` for async operations
✅ `readline` module helps handle user input
✅ `process.argv` contains command-line arguments
✅ Always handle process exit gracefully

---

## What's Next?

In the next lesson, we'll dive deep into the Node.js module system and learn how to organize code effectively.

**Next:** [Lesson 3: Working with Modules](./03-modules.md)

---

## Additional Resources

- [Event Loop Documentation](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
- [Readline Module](https://nodejs.org/api/readline.html)
- [Process Object](https://nodejs.org/api/process.html)
