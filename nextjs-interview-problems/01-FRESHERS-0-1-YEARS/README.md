# Level 1: Freshers (0-1 Years Experience)

## 🎯 Overview

This section contains **50 problems** designed for Next.js beginners with 0-1 years of experience. These problems cover fundamental concepts essential for any Next.js developer.

### Difficulty Distribution
- 🟢 Easy: 30 problems
- 🟡 Medium: 20 problems

---

## 📚 Categories

### 1. Next.js Fundamentals (10 problems)
**[Problems #001-010 →](./01-nextjs-fundamentals/)**

Topics covered:
- What is Next.js and why use it
- Pages Router vs App Router
- File-based routing system
- Link component and navigation
- Image component and optimization
- Head component for SEO
- Next.js project structure
- Environment variables
- Static assets handling
- Development vs production builds

**Key Learning Goals:**
- Understand Next.js value proposition
- Set up a Next.js project
- Navigate between pages
- Optimize images automatically
- Manage metadata

---

### 2. Pages & Routing (10 problems)
**[Problems #011-020 →](./02-pages-routing/)**

Topics covered:
- Dynamic routes with [id]
- Nested routes
- Route parameters (params)
- Query parameters
- useRouter hook
- Custom 404 pages
- Custom error pages
- Route priority
- Shallow routing
- Programmatic navigation

**Key Learning Goals:**
- Create dynamic routes
- Access URL parameters
- Handle navigation programmatically
- Build custom error pages
- Understand routing patterns

---

### 3. Data Fetching (10 problems)
**[Problems #021-030 →](./03-data-fetching/)**

Topics covered:
- getServerSideProps (SSR)
- getStaticProps (SSG)
- getStaticPaths for dynamic routes
- Client-side data fetching
- SWR for client-side fetching
- When to use each method
- Props passing from data fetching
- Error handling
- Loading states
- Data fetching patterns

**Key Learning Goals:**
- Choose appropriate rendering strategy
- Implement SSR and SSG
- Fetch data on server and client
- Handle loading and error states
- Use SWR for client-side data

---

### 4. API Routes (10 problems)
**[Problems #031-040 →](./04-api-routes/)**

Topics covered:
- Creating API endpoints
- Request handling (GET, POST, PUT, DELETE)
- Request and response objects
- Query parameters in API routes
- Request body parsing
- API middleware
- Error handling in APIs
- Status codes
- CORS configuration
- API route organization

**Key Learning Goals:**
- Build RESTful API endpoints
- Handle different HTTP methods
- Parse and validate requests
- Send appropriate responses
- Organize API routes

---

### 5. Styling & Optimization (10 problems)
**[Problems #041-050 →](./05-styling-optimization/)**

Topics covered:
- CSS Modules
- Global styles
- Styled JSX
- Tailwind CSS integration
- Image component optimization
- Font optimization
- next/head for metadata
- Performance best practices
- Lazy loading
- Asset optimization

**Key Learning Goals:**
- Apply different styling methods
- Optimize images with Image component
- Optimize fonts loading
- Improve page performance
- Manage metadata and SEO

---

## 🎯 Prerequisites

Before starting these problems, you should know:

### React Knowledge:
- ✅ Functional components
- ✅ useState and useEffect hooks
- ✅ Props and state
- ✅ Event handling
- ✅ Conditional rendering
- ✅ Lists and keys

### JavaScript:
- ✅ ES6+ syntax
- ✅ Async/await
- ✅ Promises
- ✅ Array methods (map, filter)
- ✅ Object destructuring
- ✅ Modules (import/export)

### Web Fundamentals:
- ✅ HTML & CSS
- ✅ HTTP basics
- ✅ REST API concepts
- ✅ JSON

---

## 🚀 Getting Started

### 1. Setup Your Environment

```bash
# Install Node.js (v18+ recommended)
node --version

# Create a new Next.js app
npx create-next-app@latest my-nextjs-app

# Navigate to project
cd my-nextjs-app

# Start development server
npm run dev
```

### 2. Choose Your Router

Next.js 13+ offers two routing systems:

**Pages Router (Traditional):**
```
pages/
  index.js
  about.js
  [id].js
```

**App Router (Modern - Recommended):**
```
app/
  page.js
  about/
    page.js
  [id]/
    page.js
```

Most problems in this level work with both, but examples will show both approaches where applicable.

---

## 📖 How to Approach These Problems

### Step-by-Step Process:

1. **Read the Problem** - Understand requirements
2. **Plan Your Solution** - Think about the approach
3. **Set Up** - Create necessary files/routes
4. **Implement** - Write the code
5. **Test** - Run and verify it works
6. **Review** - Compare with provided solution
7. **Optimize** - Consider improvements

### Time Allocation:
- 🟢 Easy problems: 5-15 minutes
- 🟡 Medium problems: 15-30 minutes

### Best Practices:
- Always run `npm run dev` to test
- Use TypeScript for better DX (optional but recommended)
- Follow Next.js conventions
- Read error messages carefully
- Check the Network tab for data fetching issues
- Use React DevTools

---

## 🎯 Learning Outcomes

After completing Level 1, you will be able to:

✅ Set up and configure Next.js projects
✅ Create pages with file-based routing
✅ Implement dynamic routes
✅ Fetch data using SSR and SSG
✅ Build API routes
✅ Optimize images and fonts
✅ Style components using multiple methods
✅ Handle navigation programmatically
✅ Implement basic SEO
✅ Deploy a Next.js application

---

## 💡 Interview Tips for This Level

### Common Questions:
1. **What is Next.js?**
   - React framework for production
   - Built-in SSR, SSG, routing
   - Optimizations out of the box

2. **When to use getStaticProps vs getServerSideProps?**
   - getStaticProps: Data doesn't change often, build time
   - getServerSideProps: Data changes frequently, request time

3. **How does file-based routing work?**
   - File in pages/ becomes a route
   - index.js → /
   - about.js → /about
   - [id].js → /anything (dynamic)

4. **Why use next/image?**
   - Automatic optimization
   - Lazy loading
   - Responsive images
   - Modern formats (WebP)

5. **What are API routes?**
   - Backend endpoints in Next.js
   - Located in pages/api/
   - Serverless functions

### What Interviewers Look For:
- ✅ Understanding of rendering strategies
- ✅ Proper use of data fetching methods
- ✅ File structure organization
- ✅ Performance considerations
- ✅ Basic optimization knowledge

---

## 🛠️ Recommended Tools

### Development:
- **VS Code** - Editor with Next.js extensions
- **React DevTools** - Component inspection
- **Chrome DevTools** - Network and performance

### Extensions:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- ESLint
- Prettier

### Libraries to Know:
- SWR - Client-side data fetching
- Axios - HTTP requests (alternative to fetch)
- Tailwind CSS - Utility-first CSS

---

## 📊 Progress Tracking

- [ ] Completed Next.js Fundamentals (10 problems)
- [ ] Completed Pages & Routing (10 problems)
- [ ] Completed Data Fetching (10 problems)
- [ ] Completed API Routes (10 problems)
- [ ] Completed Styling & Optimization (10 problems)
- [ ] Built a complete mini-project combining concepts
- [ ] Deployed to Vercel

---

## 🎓 Next Steps

After completing Level 1:
1. Build a complete project (blog, portfolio, etc.)
2. Deploy to Vercel
3. Move to [Level 2: Junior (1-2 Years) →](../02-JUNIOR-1-2-YEARS/)

---

## 📚 Additional Resources

### Official Docs:
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn Tutorial](https://nextjs.org/learn)
- [API Routes](https://nextjs.org/docs/api-routes/introduction)

### Video Tutorials:
- [Next.js in 100 Seconds](https://www.youtube.com/watch?v=Sklc_fQBmcs)
- [Next.js Crash Course](https://www.youtube.com/results?search_query=nextjs+crash+course)

### Practice Projects:
- Personal portfolio
- Blog with markdown
- Weather app
- Movie database
- Todo app with API routes

---

**Ready to begin? Start with [Problem #001 →](./01-nextjs-fundamentals/problem-001-what-is-nextjs.md)**

*Good luck! 🚀*
