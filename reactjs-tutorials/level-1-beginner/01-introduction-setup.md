# Lesson 1: Introduction to React & Environment Setup

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Understand what React is and why it's popular
- Set up your development environment
- Create your first React application
- Understand JSX syntax

---

## What is React?

React is a **JavaScript library** for building user interfaces, created and maintained by Facebook (Meta). It's component-based and declarative, making it easier to build interactive UIs.

### Why Use React?

✅ **Component-Based**: Build encapsulated components that manage their own state
✅ **Virtual DOM**: Fast rendering through efficient DOM updates
✅ **Declarative**: Write UI code that's easy to understand and debug
✅ **Large Ecosystem**: Tons of libraries, tools, and community support
✅ **React Native**: Use React to build mobile apps
✅ **High Demand**: Most sought-after skill in frontend development

---

## Setting Up Your Environment

### Prerequisites

```bash
# Check if Node.js is installed (v18+ recommended)
node --version

# Check if npm is installed
npm --version
```

### Install Node.js

If not installed, download from [nodejs.org](https://nodejs.org/)

---

## Creating Your First React App

### Option 1: Create React App (CRA)

```bash
# Create a new React app
npx create-react-app my-first-app

# Navigate into the directory
cd my-first-app

# Start the development server
npm start
```

### Option 2: Vite (Recommended - Faster)

```bash
# Create a new React app with Vite
npm create vite@latest my-first-app -- --template react

# Navigate and install dependencies
cd my-first-app
npm install

# Start dev server
npm run dev
```

---

## Project Structure

```
my-first-app/
├── node_modules/       # Dependencies
├── public/             # Static assets
├── src/
│   ├── App.jsx        # Main component
│   ├── main.jsx       # Entry point
│   └── index.css      # Styles
├── package.json        # Project config
└── vite.config.js     # Vite config
```

---

## Understanding JSX

JSX (JavaScript XML) allows you to write HTML-like syntax in JavaScript.

### Basic JSX Example

```jsx
// src/App.jsx
function App() {
  return (
    <div>
      <h1>Hello, React!</h1>
      <p>Welcome to your first React app</p>
    </div>
  );
}

export default App;
```

### JSX Rules

1. **Must return a single parent element**
```jsx
// ❌ Wrong - Multiple root elements
function App() {
  return (
    <h1>Hello</h1>
    <p>World</p>
  );
}

// ✅ Correct - Single parent
function App() {
  return (
    <div>
      <h1>Hello</h1>
      <p>World</p>
    </div>
  );
}

// ✅ Also correct - Using Fragment
function App() {
  return (
    <>
      <h1>Hello</h1>
      <p>World</p>
    </>
  );
}
```

2. **Use camelCase for attributes**
```jsx
// ❌ Wrong
<div class="container" onclick="handleClick">

// ✅ Correct
<div className="container" onClick={handleClick}>
```

3. **Self-closing tags must end with /\>**
```jsx
<img src="logo.png" />
<input type="text" />
<br />
```

4. **JavaScript expressions in curly braces**
```jsx
function App() {
  const name = "John";
  const age = 25;

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old</p>
      <p>Next year you'll be {age + 1}</p>
    </div>
  );
}
```

---

## Your First Component

```jsx
// src/App.jsx
function App() {
  const greeting = "Welcome to React!";
  const currentYear = new Date().getFullYear();

  return (
    <div className="app">
      <header>
        <h1>{greeting}</h1>
        <p>Current Year: {currentYear}</p>
      </header>

      <main>
        <h2>Why Learn React?</h2>
        <ul>
          <li>Component-based architecture</li>
          <li>Virtual DOM for performance</li>
          <li>Large ecosystem</li>
          <li>High job demand</li>
        </ul>
      </main>

      <footer>
        <p>&copy; {currentYear} My React App</p>
      </footer>
    </div>
  );
}

export default App;
```

---

## Styling Your Component

```css
/* src/App.css */
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

header {
  text-align: center;
  background-color: #61dafb;
  padding: 20px;
  border-radius: 8px;
}

main {
  margin: 30px 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 10px;
  margin: 5px 0;
  background-color: #f0f0f0;
  border-radius: 4px;
}
```

Import the CSS in your component:
```jsx
import './App.css';

function App() {
  // ... component code
}
```

---

## 🎯 Practice Exercises

### Exercise 1: Personal Card
Create a component that displays your personal information:
- Name
- Age
- Favorite programming language
- A short bio

### Exercise 2: Math Calculator Display
Create a component that:
- Declares two numbers
- Displays their sum, difference, product, and quotient

### Exercise 3: Dynamic List
Create a component that displays a list of your favorite:
- Movies (at least 3)
- Books (at least 3)
- Use JSX to render them dynamically

---

## 💡 Key Takeaways

✅ React is a component-based JavaScript library
✅ JSX allows HTML-like syntax in JavaScript
✅ Components are reusable building blocks
✅ Use Vite or Create React App to start projects
✅ All JSX must return a single parent element
✅ JavaScript expressions go inside curly braces `{}`

---

## 🔗 What's Next?

In the next lesson, we'll learn about:
- Creating multiple components
- Passing data between components with props
- Component composition

[Next Lesson: Components and Props →](./02-components-props.md)

---

## 📚 Additional Resources

- [React Official Tutorial](https://react.dev/learn)
- [Vite Documentation](https://vitejs.dev/)
- [JSX In Depth](https://react.dev/learn/writing-markup-with-jsx)

---

*Happy coding! 🚀*
