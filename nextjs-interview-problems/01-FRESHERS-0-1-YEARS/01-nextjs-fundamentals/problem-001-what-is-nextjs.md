# Problem #001: What is Next.js and Why Use It?

**Difficulty:** 🟢 Easy
**Category:** Next.js Fundamentals
**Time:** 10-15 minutes

---

## 📋 Problem Statement

Explain what Next.js is and create a simple comparison demonstrating the key differences between a vanilla React app and a Next.js app.

### Requirements:
1. Define Next.js in your own words
2. List at least 5 key features of Next.js
3. Explain when you should use Next.js vs Create React App
4. Create a simple Next.js page that demonstrates built-in features

---

## 💡 Solution

### 1. What is Next.js?

Next.js is a **React framework** for building production-ready web applications. It's built and maintained by Vercel and provides a structured way to build React applications with built-in features like:
- Server-side rendering (SSR)
- Static site generation (SSG)
- API routes (backend functionality)
- File-based routing
- Automatic code splitting
- Image optimization
- And much more!

Think of it as **React with superpowers** - you get all of React's benefits plus additional features that would require complex setup in a vanilla React app.

---

### 2. Key Features of Next.js

| Feature | Description | Benefit |
|---------|-------------|---------|
| **File-based Routing** | No need for React Router - files in `pages/` or `app/` become routes | Simpler, more intuitive routing |
| **SSR & SSG** | Render pages on server or at build time | Better SEO, faster initial load |
| **API Routes** | Create backend endpoints in `pages/api/` | Full-stack in one project |
| **Automatic Code Splitting** | Only loads JavaScript needed for each page | Faster page loads |
| **Image Optimization** | Built-in `<Image>` component | Optimized images automatically |
| **Built-in TypeScript** | Zero-config TypeScript support | Better developer experience |
| **Fast Refresh** | Instant feedback on edits | Improved development speed |
| **Edge Runtime** | Deploy to edge for lower latency | Global performance |

---

### 3. When to Use Next.js vs Create React App

**Use Next.js when:**
- ✅ You need SEO (e-commerce, blogs, marketing sites)
- ✅ You want server-side rendering
- ✅ You need API routes / backend functionality
- ✅ You want the best performance out of the box
- ✅ You're building a production application
- ✅ You need static site generation
- ✅ You want to deploy to Vercel easily

**Use Create React App (or Vite) when:**
- ✅ Building a single-page application (SPA)
- ✅ Creating an admin dashboard (no SEO needed)
- ✅ Building internal tools
- ✅ Prototyping quickly
- ✅ You only need client-side rendering
- ✅ You have a separate backend already

---

### 4. Practical Example

Let's create a simple Next.js page that demonstrates its features:

#### Setup:
```bash
npx create-next-app@latest nextjs-demo
cd nextjs-demo
npm run dev
```

#### Example Page (Pages Router):
```jsx
// pages/index.js
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function Home({ serverTime }) {
  return (
    <>
      {/* Built-in Head component for SEO */}
      <Head>
        <title>Next.js Demo</title>
        <meta name="description" content="Learning Next.js features" />
      </Head>

      <div className="container">
        <h1>Welcome to Next.js!</h1>

        {/* Server-side rendered data */}
        <p>This page was rendered on the server at: <strong>{serverTime}</strong></p>

        {/* Optimized Image component */}
        <Image
          src="/vercel.svg"
          alt="Vercel Logo"
          width={200}
          height={50}
          priority
        />

        {/* Next.js Link for client-side navigation */}
        <Link href="/about">
          Go to About Page
        </Link>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        h1 {
          font-size: 3rem;
          margin: 0;
        }
      `}</style>
    </>
  );
}

// Server-side rendering - runs on every request
export async function getServerSideProps() {
  return {
    props: {
      serverTime: new Date().toISOString()
    }
  };
}
```

#### Same Example (App Router):
```jsx
// app/page.js
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Next.js Demo',
  description: 'Learning Next.js features'
};

export default function Home() {
  const serverTime = new Date().toISOString();

  return (
    <div className="container">
      <h1>Welcome to Next.js!</h1>

      {/* Server component - rendered on server by default */}
      <p>This page was rendered on the server at: <strong>{serverTime}</strong></p>

      {/* Optimized Image component */}
      <Image
        src="/vercel.svg"
        alt="Vercel Logo"
        width={200}
        height={50}
        priority
      />

      {/* Next.js Link for client-side navigation */}
      <Link href="/about">
        Go to About Page
      </Link>
    </div>
  );
}
```

#### API Route Example:
```javascript
// pages/api/hello.js
export default function handler(req, res) {
  res.status(200).json({
    message: 'Hello from Next.js API!',
    timestamp: new Date().toISOString()
  });
}

// Access at: http://localhost:3000/api/hello
```

---

## 📝 Explanation

### What Makes This Next.js, Not Just React?

1. **File-based Routing:** No React Router setup needed
   ```
   pages/index.js → /
   pages/about.js → /about
   pages/api/hello.js → /api/hello
   ```

2. **Server-Side Rendering:**
   - `getServerSideProps` runs on the server
   - Page HTML is generated on each request
   - Better SEO and initial load time

3. **Built-in Components:**
   - `<Image>` - Automatic optimization, lazy loading, responsive
   - `<Link>` - Client-side navigation with prefetching
   - `<Head>` - Manage document head (meta tags, title)

4. **API Routes:**
   - Backend functionality without a separate server
   - Serverless functions
   - Same project, deployed together

5. **Styled JSX:**
   - Scoped CSS in JavaScript
   - No CSS-in-JS library needed

---

## ✅ Best Practices

1. **Use Next.js Image component** for all images
   ```jsx
   // ✅ Good
   <Image src="/logo.png" alt="Logo" width={200} height={50} />

   // ❌ Avoid
   <img src="/logo.png" alt="Logo" />
   ```

2. **Use Next.js Link for internal navigation**
   ```jsx
   // ✅ Good
   <Link href="/about">About</Link>

   // ❌ Avoid
   <a href="/about">About</a>
   ```

3. **Choose the right data fetching method**
   - SSR (getServerSideProps) - Dynamic data
   - SSG (getStaticProps) - Static data
   - Client-side - User-specific data

4. **Always add metadata for SEO**
   ```jsx
   // Pages Router
   <Head>
     <title>Page Title</title>
     <meta name="description" content="Description" />
   </Head>

   // App Router
   export const metadata = {
     title: 'Page Title',
     description: 'Description'
   }
   ```

---

## ❌ Common Mistakes

1. **Using regular `<img>` and `<a>` tags**
   - Miss out on Next.js optimizations
   - Slower performance

2. **Not understanding rendering strategies**
   - Using SSR when SSG would work (slower)
   - Using client-side when SSR is needed (bad SEO)

3. **Importing CSS incorrectly**
   - Regular CSS needs to be in `_app.js` or use CSS Modules

4. **Not optimizing images**
   - Next.js Image component does this automatically

5. **Thinking Next.js is just React**
   - It's a framework with conventions and optimizations

---

## 🔄 Follow-up Questions

Interviewers might ask:

1. **Q: What's the difference between Next.js and Gatsby?**
   - **A:** Both are React frameworks. Gatsby focuses on static sites (SSG), while Next.js offers SSG, SSR, and ISR. Next.js is more flexible for dynamic content.

2. **Q: Can you use Next.js without server-side rendering?**
   - **A:** Yes! You can export a static site with `next export` or use client-side rendering only.

3. **Q: What is the Virtual DOM in Next.js?**
   - **A:** Next.js uses React, so it has the Virtual DOM. The difference is Next.js can render the initial HTML on the server.

4. **Q: How does Next.js improve SEO?**
   - **A:** By rendering HTML on the server (SSR) or at build time (SSG), search engines can see the content immediately without executing JavaScript.

5. **Q: What's the difference between Pages Router and App Router?**
   - **A:** App Router (Next.js 13+) is the modern approach with Server Components, improved layouts, and better streaming. Pages Router is the traditional, stable approach.

---

## 🎯 Key Takeaways

✅ Next.js is a React framework with built-in features for production apps
✅ It provides SSR, SSG, API routes, and optimizations out of the box
✅ Use it when you need SEO, performance, or a full-stack solution
✅ File-based routing is simpler than React Router
✅ Built-in components (`Image`, `Link`, `Head`) provide automatic optimizations

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Why Next.js?](https://nextjs.org/learn/foundations/about-nextjs)
- [Next.js vs Create React App](https://blog.logrocket.com/next-js-vs-create-react-app/)

---

**Next Problem:** [#002: File-Based Routing →](./problem-002-file-based-routing.md)
