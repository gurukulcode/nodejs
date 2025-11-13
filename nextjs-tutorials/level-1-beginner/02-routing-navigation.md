# Lesson 2: Routing & Navigation in Next.js

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Master file-based routing in Next.js
- Create dynamic routes with parameters
- Use the Link component for navigation
- Implement nested routes and layouts
- Handle 404 and error pages
- Use the useRouter hook for programmatic navigation

---

## File-Based Routing

Next.js uses the file system to define routes. This is much simpler than configuring routes manually!

### Pages Router vs App Router

Next.js offers two routing systems. We'll focus on the **App Router** (recommended).

---

## Basic Routing

### Creating Routes

```
app/
├── page.js                    → /
├── about/
│   └── page.js               → /about
├── blog/
│   └── page.js               → /blog
└── contact/
    └── page.js               → /contact
```

### Example: Blog Page

```jsx
// app/blog/page.js
export default function Blog() {
  return (
    <div className="container">
      <h1>Blog</h1>
      <p>Welcome to our blog!</p>
    </div>
  );
}
```

---

## Dynamic Routes

Dynamic routes use square brackets `[param]` in the folder name.

### Single Dynamic Route

```
app/
└── blog/
    ├── page.js               → /blog
    └── [slug]/
        └── page.js           → /blog/any-slug-here
```

```jsx
// app/blog/[slug]/page.js
export default function BlogPost({ params }) {
  return (
    <div className="container">
      <h1>Blog Post</h1>
      <p>You are reading: <strong>{params.slug}</strong></p>
    </div>
  );
}

// /blog/hello-world  → params.slug = "hello-world"
// /blog/my-story     → params.slug = "my-story"
```

### Multiple Dynamic Segments

```
app/
└── shop/
    └── [category]/
        └── [product]/
            └── page.js       → /shop/[category]/[product]
```

```jsx
// app/shop/[category]/[product]/page.js
export default function Product({ params }) {
  const { category, product } = params;

  return (
    <div className="container">
      <h1>Product Page</h1>
      <p>Category: {category}</p>
      <p>Product: {product}</p>
    </div>
  );
}

// /shop/electronics/laptop → category="electronics", product="laptop"
// /shop/clothing/shirt     → category="clothing", product="shirt"
```

---

## The Link Component

Use Next.js `<Link>` for client-side navigation (faster than `<a>` tags).

### Basic Link Usage

```jsx
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/blog">Blog</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  );
}
```

### Link with Dynamic Routes

```jsx
import Link from 'next/link';

export default function BlogList() {
  const posts = [
    { id: 1, slug: 'getting-started', title: 'Getting Started' },
    { id: 2, slug: 'advanced-tips', title: 'Advanced Tips' },
    { id: 3, slug: 'best-practices', title: 'Best Practices' }
  ];

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <div key={post.id}>
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </div>
      ))}
    </div>
  );
}
```

### Link with Query Parameters

```jsx
// Static query params
<Link href="/search?q=nextjs&category=tutorial">
  Search Results
</Link>

// Dynamic query params
<Link href={{
  pathname: '/search',
  query: { q: 'nextjs', category: 'tutorial' }
}}>
  Search Results
</Link>
```

### Styling Active Links

```jsx
'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <nav>
      {links.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className={pathname === link.href ? 'active' : ''}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
```

---

## Nested Routes and Layouts

### Nested Layouts

Layouts wrap their child pages and persist across navigation.

```
app/
├── layout.js                 # Root layout
├── page.js                   # Home page
└── dashboard/
    ├── layout.js             # Dashboard layout
    ├── page.js               # /dashboard
    ├── settings/
    │   └── page.js          # /dashboard/settings
    └── profile/
        └── page.js          # /dashboard/profile
```

```jsx
// app/layout.js (Root Layout)
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>Global Navigation</nav>
        </header>
        {children}
        <footer>Global Footer</footer>
      </body>
    </html>
  );
}

// app/dashboard/layout.js (Dashboard Layout)
export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/dashboard/settings">Settings</Link>
          <Link href="/dashboard/profile">Profile</Link>
        </nav>
      </aside>
      <main className="content">
        {children}
      </main>
    </div>
  );
}

// app/dashboard/page.js
export default function DashboardPage() {
  return <h1>Dashboard Overview</h1>
}
```

---

## Programmatic Navigation

Use `useRouter` hook for programmatic navigation.

```jsx
'use client'

import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform login logic...
    const success = await login();

    if (success) {
      // Navigate to dashboard
      router.push('/dashboard');

      // Or navigate and refresh server data
      // router.refresh();

      // Or replace (no back button)
      // router.replace('/dashboard');

      // Or go back
      // router.back();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Router Methods

```jsx
'use client'

import { useRouter } from 'next/navigation';

export default function NavigationExample() {
  const router = useRouter();

  return (
    <div>
      {/* Navigate to a page */}
      <button onClick={() => router.push('/about')}>
        Go to About
      </button>

      {/* Replace (no history) */}
      <button onClick={() => router.replace('/login')}>
        Replace with Login
      </button>

      {/* Go back */}
      <button onClick={() => router.back()}>
        Go Back
      </button>

      {/* Go forward */}
      <button onClick={() => router.forward()}>
        Go Forward
      </button>

      {/* Refresh current route */}
      <button onClick={() => router.refresh()}>
        Refresh
      </button>
    </div>
  );
}
```

---

## Catch-All Routes

Catch-all routes match multiple path segments.

### Optional Catch-All `[[...slug]]`

```
app/
└── docs/
    └── [[...slug]]/
        └── page.js
```

```jsx
// app/docs/[[...slug]]/page.js
export default function Docs({ params }) {
  const { slug } = params;

  // /docs              → slug = undefined
  // /docs/intro        → slug = ['intro']
  // /docs/api/hooks    → slug = ['api', 'hooks']

  return (
    <div>
      <h1>Documentation</h1>
      <p>Path: {slug ? slug.join(' / ') : 'Home'}</p>
    </div>
  );
}
```

### Required Catch-All `[...slug]`

```
app/
└── shop/
    └── [...categories]/
        └── page.js
```

```jsx
// app/shop/[...categories]/page.js
export default function Shop({ params }) {
  const { categories } = params;

  // /shop              → 404 (doesn't match)
  // /shop/clothing     → categories = ['clothing']
  // /shop/men/shirts   → categories = ['men', 'shirts']

  return (
    <div>
      <h1>Shop</h1>
      <p>Categories: {categories.join(' > ')}</p>
    </div>
  );
}
```

---

## Custom 404 Page

```jsx
// app/not-found.js
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for doesn't exist.</p>
      <Link href="/">Go Back Home</Link>

      <style jsx>{`
        .not-found {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        h1 {
          font-size: 6rem;
          margin: 0;
          color: #0070f3;
        }

        h2 {
          font-size: 2rem;
          margin: 1rem 0;
        }

        a {
          margin-top: 2rem;
          padding: 1rem 2rem;
          background: #0070f3;
          color: white;
          border-radius: 8px;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
```

---

## Error Handling

```jsx
// app/error.js
'use client' // Error components must be Client Components

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
```

---

## Loading States

```jsx
// app/loading.js
export default function Loading() {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <p>Loading...</p>

      <style jsx>{`
        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #0070f3;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
```

---

## Complete Example: Blog with Routing

```
app/
├── layout.js
├── page.js
├── blog/
│   ├── page.js              # Blog list
│   └── [slug]/
│       └── page.js          # Individual post
└── not-found.js
```

```jsx
// app/blog/page.js
import Link from 'next/link';

export default function BlogList() {
  const posts = [
    { slug: 'nextjs-intro', title: 'Introduction to Next.js', date: '2024-01-01' },
    { slug: 'routing-guide', title: 'Routing Guide', date: '2024-01-02' },
    { slug: 'data-fetching', title: 'Data Fetching Strategies', date: '2024-01-03' }
  ];

  return (
    <div className="container">
      <h1>Blog Posts</h1>
      <div className="posts">
        {posts.map(post => (
          <article key={post.slug} className="post-card">
            <h2>
              <Link href={`/blog/${post.slug}`}>
                {post.title}
              </Link>
            </h2>
            <time>{post.date}</time>
          </article>
        ))}
      </div>
    </div>
  );
}

// app/blog/[slug]/page.js
import { notFound } from 'next/navigation';

export default function BlogPost({ params }) {
  const posts = {
    'nextjs-intro': {
      title: 'Introduction to Next.js',
      date: '2024-01-01',
      content: 'Next.js is an amazing framework...'
    },
    'routing-guide': {
      title: 'Routing Guide',
      date: '2024-01-02',
      content: 'File-based routing is simple...'
    },
    'data-fetching': {
      title: 'Data Fetching Strategies',
      date: '2024-01-03',
      content: 'Next.js offers multiple ways to fetch data...'
    }
  };

  const post = posts[params.slug];

  if (!post) {
    notFound();
  }

  return (
    <article className="container">
      <h1>{post.title}</h1>
      <time>{post.date}</time>
      <div className="content">
        <p>{post.content}</p>
      </div>
    </article>
  );
}
```

---

## 🎯 Practice Exercises

### Exercise 1: User Profile Page
Create a dynamic route `/users/[id]` that displays user information.

### Exercise 2: Product Catalog
Create nested routes:
- `/products` - List all products
- `/products/[category]` - Products by category
- `/products/[category]/[id]` - Individual product

### Exercise 3: Active Navigation
Build a navigation component that highlights the active page.

---

## 💡 Key Takeaways

✅ File-based routing: folders = routes
✅ `page.js` defines a route
✅ `[param]` creates dynamic routes
✅ Use `<Link>` for client-side navigation
✅ `layout.js` wraps child pages
✅ `useRouter` for programmatic navigation
✅ Catch-all routes with `[...slug]`
✅ Custom 404 and error pages

---

## 🔗 What's Next?

In the next lesson, we'll learn about:
- Data fetching strategies (SSR, SSG, ISR)
- getServerSideProps and getStaticProps
- Client-side data fetching
- Building dynamic pages with data

[Next Lesson: Data Fetching →](./03-data-fetching.md)

---

## 📚 Additional Resources

- [Routing Documentation](https://nextjs.org/docs/app/building-your-application/routing)
- [Link Component](https://nextjs.org/docs/app/api-reference/components/link)
- [useRouter Hook](https://nextjs.org/docs/app/api-reference/functions/use-router)

---

*Happy coding! 🚀*
