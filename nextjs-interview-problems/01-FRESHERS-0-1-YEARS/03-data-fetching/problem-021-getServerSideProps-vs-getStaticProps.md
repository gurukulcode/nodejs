# Problem #021: getServerSideProps vs getStaticProps

**Difficulty:** 🟡 Medium
**Category:** Data Fetching
**Time:** 20-25 minutes

---

## 📋 Problem Statement

Create two pages that demonstrate the differences between `getServerSideProps` (SSR) and `getStaticProps` (SSG). Both pages should fetch data from an API, but use different rendering strategies.

### Requirements:
1. Create a page using `getServerSideProps` that shows current time
2. Create a page using `getStaticProps` that shows build time
3. Fetch data from a public API (use JSONPlaceholder)
4. Add visual indicators showing when each page was rendered
5. Explain when to use each method

---

## 💡 Solution

### 1. SSR Page (getServerSideProps)

```jsx
// pages/ssr-example.js
import { useState, useEffect } from 'react';

export default function SSRExample({ post, serverTime, requestTime }) {
  const [clientTime, setClientTime] = useState(null);

  useEffect(() => {
    setClientTime(new Date().toISOString());
  }, []);

  return (
    <div className="container">
      <h1>🔄 Server-Side Rendering (SSR)</h1>
      <p className="subtitle">Using getServerSideProps</p>

      <div className="info-card">
        <h2>Rendering Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="label">Server Time:</span>
            <span className="value">{serverTime}</span>
          </div>
          <div className="info-item">
            <span className="label">Request Time:</span>
            <span className="value">{requestTime} ms</span>
          </div>
          <div className="info-item">
            <span className="label">Client Time:</span>
            <span className="value">{clientTime || 'Loading...'}</span>
          </div>
        </div>
        <p className="note">
          ⚡ This page is rendered on EVERY request
        </p>
      </div>

      <div className="data-card">
        <h2>Fetched Data (Post)</h2>
        <div className="post">
          <h3>{post.title}</h3>
          <p>{post.body}</p>
          <span className="post-id">Post ID: {post.id}</span>
        </div>
      </div>

      <div className="explanation">
        <h3>📖 How SSR Works:</h3>
        <ol>
          <li>User requests the page</li>
          <li>Server runs getServerSideProps</li>
          <li>Server fetches data from API</li>
          <li>Server renders HTML with data</li>
          <li>HTML sent to browser</li>
          <li>React hydrates on client</li>
        </ol>
      </div>

      <button onClick={() => window.location.reload()}>
        🔄 Reload Page (Notice Server Time Changes)
      </button>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        h1 {
          color: #0070f3;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: #666;
          margin-bottom: 2rem;
        }

        .info-card, .data-card, .explanation {
          background: #f5f5f5;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .info-grid {
          display: grid;
          gap: 1rem;
          margin: 1rem 0;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem;
          background: white;
          border-radius: 4px;
        }

        .label {
          font-weight: bold;
          color: #333;
        }

        .value {
          font-family: monospace;
          color: #0070f3;
        }

        .note {
          background: #fff3cd;
          padding: 0.75rem;
          border-radius: 4px;
          margin-top: 1rem;
          border-left: 4px solid #ffc107;
        }

        .post {
          background: white;
          padding: 1rem;
          border-radius: 4px;
        }

        .post h3 {
          margin-top: 0;
          color: #333;
        }

        .post-id {
          display: inline-block;
          background: #0070f3;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.875rem;
        }

        .explanation {
          background: #e3f2fd;
        }

        .explanation ol {
          margin: 0.5rem 0 0 0;
          padding-left: 1.5rem;
        }

        .explanation li {
          margin: 0.5rem 0;
        }

        button {
          background: #0070f3;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          width: 100%;
        }

        button:hover {
          background: #0051cc;
        }
      `}</style>
    </div>
  );
}

// This runs on EVERY request
export async function getServerSideProps(context) {
  const startTime = Date.now();

  // Fetch data from API
  const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  const post = await res.json();

  const endTime = Date.now();
  const requestTime = endTime - startTime;

  return {
    props: {
      post,
      serverTime: new Date().toISOString(),
      requestTime
    }
  };
}
```

---

### 2. SSG Page (getStaticProps)

```jsx
// pages/ssg-example.js
import { useState, useEffect } from 'react';

export default function SSGExample({ posts, buildTime }) {
  const [clientTime, setClientTime] = useState(null);

  useEffect(() => {
    setClientTime(new Date().toISOString());
  }, []);

  return (
    <div className="container">
      <h1>⚡ Static Site Generation (SSG)</h1>
      <p className="subtitle">Using getStaticProps</p>

      <div className="info-card">
        <h2>Rendering Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="label">Build Time:</span>
            <span className="value">{buildTime}</span>
          </div>
          <div className="info-item">
            <span className="label">Client Time:</span>
            <span className="value">{clientTime || 'Loading...'}</span>
          </div>
        </div>
        <p className="note">
          ⚡ This page was generated at BUILD time, not request time!
        </p>
      </div>

      <div className="data-card">
        <h2>Fetched Data (Posts)</h2>
        <div className="posts-grid">
          {posts.slice(0, 6).map(post => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.body.substring(0, 100)}...</p>
              <span className="post-id">Post #{post.id}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="explanation">
        <h3>📖 How SSG Works:</h3>
        <ol>
          <li>During build time (npm run build)</li>
          <li>Next.js runs getStaticProps</li>
          <li>Fetches data from API</li>
          <li>Generates static HTML</li>
          <li>HTML is cached and reused</li>
          <li>Served instantly from CDN</li>
        </ol>
      </div>

      <button onClick={() => window.location.reload()}>
        🔄 Reload Page (Notice Build Time Stays Same)
      </button>

      <style jsx>{`
        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
        }

        h1 {
          color: #10b981;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: #666;
          margin-bottom: 2rem;
        }

        .info-card, .data-card, .explanation {
          background: #f5f5f5;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .info-grid {
          display: grid;
          gap: 1rem;
          margin: 1rem 0;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem;
          background: white;
          border-radius: 4px;
        }

        .label {
          font-weight: bold;
          color: #333;
        }

        .value {
          font-family: monospace;
          color: #10b981;
        }

        .note {
          background: #d1fae5;
          padding: 0.75rem;
          border-radius: 4px;
          margin-top: 1rem;
          border-left: 4px solid #10b981;
        }

        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }

        .post-card {
          background: white;
          padding: 1rem;
          border-radius: 4px;
          border: 2px solid #e5e7eb;
        }

        .post-card h3 {
          margin-top: 0;
          font-size: 1rem;
          color: #333;
        }

        .post-card p {
          font-size: 0.875rem;
          color: #666;
        }

        .post-id {
          display: inline-block;
          background: #10b981;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.75rem;
        }

        .explanation {
          background: #f0fdf4;
        }

        .explanation ol {
          margin: 0.5rem 0 0 0;
          padding-left: 1.5rem;
        }

        .explanation li {
          margin: 0.5rem 0;
        }

        button {
          background: #10b981;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          width: 100%;
        }

        button:hover {
          background: #059669;
        }
      `}</style>
    </div>
  );
}

// This runs at BUILD time only
export async function getStaticProps() {
  // Fetch data from API
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await res.json();

  return {
    props: {
      posts,
      buildTime: new Date().toISOString()
    },
    // Optional: revalidate every 60 seconds (ISR)
    // revalidate: 60
  };
}
```

---

### 3. Comparison Dashboard

```jsx
// pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <h1>Next.js Data Fetching Comparison</h1>

      <div className="cards">
        <Link href="/ssr-example" className="card ssr">
          <h2>🔄 Server-Side Rendering</h2>
          <p>getServerSideProps</p>
          <ul>
            <li>Runs on every request</li>
            <li>Always fresh data</li>
            <li>Slower initial load</li>
            <li>Better for dynamic content</li>
          </ul>
          <button>View SSR Example →</button>
        </Link>

        <Link href="/ssg-example" className="card ssg">
          <h2>⚡ Static Site Generation</h2>
          <p>getStaticProps</p>
          <ul>
            <li>Runs at build time</li>
            <li>Data can be stale</li>
            <li>Instant page load</li>
            <li>Better for static content</li>
          </ul>
          <button>View SSG Example →</button>
        </Link>
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          text-align: center;
        }

        h1 {
          font-size: 2.5rem;
          margin-bottom: 3rem;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .card {
          background: white;
          border-radius: 8px;
          padding: 2rem;
          text-decoration: none;
          color: inherit;
          border: 3px solid #e5e7eb;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .card.ssr {
          border-color: #0070f3;
        }

        .card.ssg {
          border-color: #10b981;
        }

        .card h2 {
          margin-top: 0;
        }

        .card.ssr h2 {
          color: #0070f3;
        }

        .card.ssg h2 {
          color: #10b981;
        }

        .card p {
          font-family: monospace;
          color: #666;
          font-size: 0.875rem;
        }

        .card ul {
          text-align: left;
          padding-left: 1.5rem;
          margin: 1.5rem 0;
        }

        .card li {
          margin: 0.5rem 0;
          color: #666;
        }

        .card button {
          background: #333;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          margin-top: 1rem;
        }

        .card.ssr button {
          background: #0070f3;
        }

        .card.ssg button {
          background: #10b981;
        }
      `}</style>
    </div>
  );
}
```

---

## 📝 Explanation

### When to Use Each Method

| Use Case | Method | Reason |
|----------|--------|--------|
| Blog posts | `getStaticProps` | Content doesn't change often |
| User dashboard | `getServerSideProps` | User-specific, always fresh |
| Product catalog | `getStaticProps` + ISR | Fast, with periodic updates |
| Real-time data | Client-side | Needs constant updates |
| News articles | `getStaticProps` + ISR | Fast load, hourly updates OK |
| Shopping cart | `getServerSideProps` | User-specific, must be current |
| Landing page | `getStaticProps` | Static content, max speed |
| Admin panel | `getServerSideProps` | Dynamic, authenticated |

### Performance Comparison

**getStaticProps (SSG):**
- ✅ Lightning fast (pre-rendered HTML)
- ✅ Can be served from CDN
- ✅ No server load on request
- ❌ Data can be stale
- ❌ Needs rebuild for updates

**getServerSideProps (SSR):**
- ✅ Always fresh data
- ✅ Dynamic per request
- ✅ Can use request context (cookies, headers)
- ❌ Slower (waits for data)
- ❌ Server load on each request

---

## ✅ Best Practices

1. **Prefer getStaticProps when possible**
   ```jsx
   // ✅ Good - Static content
   export async function getStaticProps() {
     const posts = await fetchPosts();
     return { props: { posts } };
   }
   ```

2. **Use ISR for the best of both worlds**
   ```jsx
   export async function getStaticProps() {
     return {
       props: { data },
       revalidate: 60 // Rebuild every 60 seconds
     };
   }
   ```

3. **Use getServerSideProps only when necessary**
   ```jsx
   // ✅ Good - User-specific data
   export async function getServerSideProps(context) {
     const { req } = context;
     const session = await getSession(req);
     return { props: { session } };
   }
   ```

4. **Handle errors properly**
   ```jsx
   export async function getStaticProps() {
     try {
       const data = await fetchData();
       return { props: { data } };
     } catch (error) {
       return { notFound: true };
     }
   }
   ```

---

## ❌ Common Mistakes

1. **Using SSR when SSG would work**
   ```jsx
   // ❌ Bad - Blog posts don't need SSR
   export async function getServerSideProps() {
     const posts = await fetchPosts();
     return { props: { posts } };
   }

   // ✅ Good - Use SSG with ISR
   export async function getStaticProps() {
     const posts = await fetchPosts();
     return {
       props: { posts },
       revalidate: 3600 // Update every hour
     };
   }
   ```

2. **Fetching data on client when SSG would work**
   ```jsx
   // ❌ Bad - Slow, no SEO
   useEffect(() => {
     fetch('/api/posts').then(setPosts);
   }, []);

   // ✅ Good - Fast, SEO-friendly
   export async function getStaticProps() {
     const posts = await fetchPosts();
     return { props: { posts } };
   }
   ```

3. **Not handling loading/error states in SSR**
   ```jsx
   // ❌ Bad - No error handling
   export async function getServerSideProps() {
     const data = await fetch(url);
     return { props: { data } };
   }

   // ✅ Good - Handles errors
   export async function getServerSideProps() {
     try {
       const res = await fetch(url);
       if (!res.ok) throw new Error('Failed');
       const data = await res.json();
       return { props: { data } };
     } catch (error) {
       return { notFound: true };
     }
   }
   ```

---

## 🔄 Follow-up Questions

1. **Q: What is ISR (Incremental Static Regeneration)?**
   - **A:** Combines SSG and SSR - generates static pages but regenerates them in the background after a specified time.

2. **Q: Can you use both methods in the same app?**
   - **A:** Yes! Different pages can use different methods based on their needs.

3. **Q: What if data changes every second?**
   - **A:** Use client-side fetching with SWR or React Query. SSR/SSG aren't suitable.

4. **Q: Do these methods run in the browser?**
   - **A:** No! They run on the server or during build. Client never sees this code.

5. **Q: What about getInitialProps?**
   - **A:** Legacy method. Use getServerSideProps or getStaticProps instead.

---

## 🎯 Key Takeaways

✅ getStaticProps = Build time, fast, static content
✅ getServerSideProps = Request time, slow, dynamic content
✅ Prefer getStaticProps + ISR when possible
✅ Both methods run on server, not client
✅ Choose based on data freshness requirements

---

**Next Problem:** [#022: getStaticPaths for Dynamic Routes →](./problem-022-getStaticPaths.md)
