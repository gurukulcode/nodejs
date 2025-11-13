# Lesson 1: Introduction to Next.js & Environment Setup

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Understand what Next.js is and why it's powerful
- Set up your Next.js development environment
- Create your first Next.js application
- Understand the project structure
- Build a simple multi-page application

---

## What is Next.js?

Next.js is a **React framework** for building full-stack web applications. It's created and maintained by Vercel and provides everything you need to build production-ready React apps.

### Why Use Next.js Instead of Plain React?

| Feature | Create React App | Next.js |
|---------|-----------------|---------|
| **Routing** | Need React Router | Built-in file-based routing |
| **SEO** | Limited (CSR only) | Excellent (SSR/SSG) |
| **Performance** | Manual optimization | Automatic optimizations |
| **Backend** | Need separate server | API routes included |
| **Image Optimization** | Manual | Automatic with Image component |
| **Code Splitting** | Manual configuration | Automatic per-page |
| **TypeScript** | Manual setup | Zero-config support |
| **Deployment** | Various options | Optimized for Vercel |

### Next.js Key Features:

✅ **Server-Side Rendering (SSR)** - Render pages on the server
✅ **Static Site Generation (SSG)** - Generate HTML at build time
✅ **File-based Routing** - No router configuration needed
✅ **API Routes** - Build your backend in the same project
✅ **Automatic Code Splitting** - Only load what you need
✅ **Image Optimization** - Automatic image optimization
✅ **Fast Refresh** - Instant feedback on edits
✅ **Built-in CSS Support** - CSS Modules, Sass, CSS-in-JS
✅ **TypeScript** - First-class TypeScript support
✅ **Edge Runtime** - Deploy to the edge for lower latency

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

If not installed, download from [nodejs.org](https://nodejs.org/) (LTS version recommended)

---

## Creating Your First Next.js App

### Option 1: Create Next.js App (Recommended)

```bash
# Create a new Next.js app with interactive prompts
npx create-next-app@latest my-first-nextjs-app

# You'll be asked:
# ✔ Would you like to use TypeScript? › No / Yes
# ✔ Would you like to use ESLint? › No / Yes
# ✔ Would you like to use Tailwind CSS? › No / Yes
# ✔ Would you like to use `src/` directory? › No / Yes
# ✔ Would you like to use App Router? (recommended) › No / Yes
# ✔ Would you like to customize the default import alias (@/*)? › No / Yes

# Navigate into the directory
cd my-first-nextjs-app

# Start the development server
npm run dev
```

**For this tutorial, choose:**
- TypeScript: No (we'll cover this later)
- ESLint: Yes
- Tailwind CSS: No (we'll use regular CSS)
- src/ directory: No
- App Router: Yes (modern approach)
- Import alias: No

### Option 2: Manual Setup

```bash
# Create project directory
mkdir my-nextjs-app
cd my-nextjs-app

# Initialize package.json
npm init -y

# Install Next.js, React, and React DOM
npm install next react react-dom

# Add scripts to package.json
```

Add to `package.json`:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## Project Structure

### App Router Structure (Next.js 13+)

```
my-first-nextjs-app/
├── app/
│   ├── layout.js         # Root layout (wraps all pages)
│   ├── page.js           # Home page (/)
│   ├── about/
│   │   └── page.js       # About page (/about)
│   └── globals.css       # Global styles
├── public/               # Static assets
│   ├── next.svg
│   └── vercel.svg
├── node_modules/         # Dependencies
├── .gitignore
├── next.config.js        # Next.js configuration
├── package.json
└── README.md
```

### Key Files Explained:

**app/layout.js** - Root layout component
```jsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

**app/page.js** - Home page component
```jsx
export default function Home() {
  return <h1>Hello Next.js!</h1>
}
```

---

## Your First Next.js Application

Let's build a simple website with multiple pages!

### 1. Home Page

```jsx
// app/page.js
export default function Home() {
  return (
    <div className="container">
      <main className="main">
        <h1 className="title">
          Welcome to <span className="highlight">Next.js!</span>
        </h1>

        <p className="description">
          A React Framework for Production
        </p>

        <div className="grid">
          <div className="card">
            <h3>🚀 Fast Refresh</h3>
            <p>Instant feedback on edits. Try editing this page!</p>
          </div>

          <div className="card">
            <h3>📁 File-based Routing</h3>
            <p>Create a file in app/ and it becomes a route.</p>
          </div>

          <div className="card">
            <h3>⚡ Server & Client</h3>
            <p>Server and Client Components for optimal performance.</p>
          </div>

          <div className="card">
            <h3>🎨 Built-in CSS</h3>
            <p>CSS Modules, Tailwind, and more out of the box.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
```

### 2. Add Styling

```css
/* app/globals.css */
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  background: linear-gradient(to bottom, #0f172a, #1e293b);
  color: white;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.main {
  min-height: 100vh;
  padding: 4rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: 4rem;
  line-height: 1.15;
  text-align: center;
  margin-bottom: 1rem;
}

.highlight {
  color: #0070f3;
}

.description {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 3rem;
  color: #94a3b8;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1000px;
}

.card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  transition: transform 0.2s, border-color 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  border-color: #0070f3;
}

.card h3 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.card p {
  color: #94a3b8;
  line-height: 1.6;
}
```

### 3. Create an About Page

```jsx
// app/about/page.js
export default function About() {
  const features = [
    {
      id: 1,
      title: 'Zero Config',
      description: 'Automatic compilation and bundling with optimizations'
    },
    {
      id: 2,
      title: 'Hybrid Rendering',
      description: 'Choose SSR, SSG, or ISR for each page'
    },
    {
      id: 3,
      title: 'TypeScript Support',
      description: 'First-class TypeScript support out of the box'
    },
    {
      id: 4,
      title: 'Image Optimization',
      description: 'Automatic image optimization with the Image component'
    }
  ];

  return (
    <div className="container">
      <main className="main">
        <h1 className="title">About Next.js</h1>

        <p className="description">
          Next.js gives you the best developer experience with all the features
          you need for production: hybrid static & server rendering, TypeScript
          support, smart bundling, route pre-fetching, and more.
        </p>

        <div className="features">
          <h2>Key Features</h2>
          <div className="features-grid">
            {features.map((feature) => (
              <div key={feature.id} className="feature-card">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
```

### 4. Add Navigation

```jsx
// app/layout.js
import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'My First Next.js App',
  description: 'Learning Next.js fundamentals',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <div className="nav-container">
            <Link href="/" className="logo">
              Next.js App
            </Link>
            <ul className="nav-links">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
            </ul>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
```

### 5. Style the Navigation

Add to `globals.css`:
```css
.nav {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #0070f3;
  text-decoration: none;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 2rem;
  margin: 0;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: #0070f3;
}

.features {
  width: 100%;
  max-width: 1000px;
  margin-top: 3rem;
}

.features h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
}

.feature-card h3 {
  margin-bottom: 0.5rem;
  color: #0070f3;
}

.feature-card p {
  color: #94a3b8;
  font-size: 0.9rem;
  line-height: 1.6;
}
```

---

## Running Your Application

```bash
# Start development server
npm run dev

# Visit http://localhost:3000

# Try editing files - changes reflect instantly!
```

---

## Important Next.js Concepts

### 1. Server Components (Default)

In the App Router, all components are Server Components by default:

```jsx
// app/page.js - This is a Server Component
export default function Page() {
  // This code runs on the SERVER
  console.log('This logs on the server!');

  return <h1>Server Component</h1>
}
```

### 2. Client Components

Add `'use client'` to use client-side features:

```jsx
// app/counter/page.js
'use client' // This makes it a Client Component

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### 3. Metadata

```jsx
// Static metadata
export const metadata = {
  title: 'My Page',
  description: 'Page description'
}

// Dynamic metadata
export async function generateMetadata({ params }) {
  return {
    title: `Post ${params.id}`
  }
}
```

---

## 🎯 Practice Exercises

### Exercise 1: Add a Contact Page
Create a new page at `/contact` with:
- A heading
- A simple form (non-functional for now)
- Add it to the navigation

### Exercise 2: Dynamic Welcome
Create a page that displays "Welcome!" and the current year dynamically.

### Exercise 3: Card Component
Extract the card into a reusable component and use it on multiple pages.

---

## 💡 Key Takeaways

✅ Next.js is a React framework with built-in features
✅ App Router uses file-based routing
✅ `page.js` defines a route
✅ `layout.js` wraps pages with common UI
✅ Server Components are the default
✅ Use `'use client'` for interactivity
✅ Next.js Link component for navigation
✅ Hot reloading makes development fast

---

## 🔗 What's Next?

In the next lesson, we'll learn about:
- Dynamic routes with parameters
- Data fetching strategies
- Server and Client Components in depth
- Building a real application

[Next Lesson: Routing & Navigation →](./02-routing-navigation.md)

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn Course](https://nextjs.org/learn)
- [App Router Guide](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

---

*Happy coding! 🚀*
