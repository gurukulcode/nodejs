# Lesson 6: Component Lifecycle & useEffect

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Understand React component lifecycle
- Master the useEffect hook
- Handle side effects in components
- Fetch data from APIs
- Implement cleanup functions

---

## Component Lifecycle Concepts

React components go through three phases:

1. **Mounting**: Component is created and inserted into the DOM
2. **Updating**: Component re-renders due to state/props changes
3. **Unmounting**: Component is removed from the DOM

---

## The useEffect Hook

useEffect lets you perform side effects in functional components.

### Basic Syntax

```jsx
import { useEffect } from 'react';

useEffect(() => {
  // Side effect code here
}, [dependencies]);
```

---

## Running Effects

### On Every Render (No Dependency Array)

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Effect runs on every render');
    console.log('Current count:', count);
  });

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### On Mount Only (Empty Dependency Array)

```jsx
function Welcome() {
  useEffect(() => {
    console.log('Component mounted - runs once');
    document.title = 'Welcome!';
  }, []);

  return <h1>Welcome to my app</h1>;
}
```

### On Specific Changes (With Dependencies)

```jsx
function SearchResults({ searchTerm }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    console.log('Effect runs when searchTerm changes');
    // Fetch results based on searchTerm
  }, [searchTerm]); // Only re-run if searchTerm changes

  return <div>{/* Display results */}</div>;
}
```

---

## Cleanup Functions

Return a function from useEffect to clean up.

### Timer Cleanup

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    // Cleanup function
    return () => {
      clearInterval(interval);
      console.log('Timer cleanup');
    };
  }, []);

  return <div>Seconds: {seconds}</div>;
}
```

### Event Listener Cleanup

```jsx
function WindowSize() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div>Window width: {width}px</div>;
}
```

---

## Fetching Data with useEffect

### Basic API Fetch

```jsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Using async/await

```jsx
function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        posts.map(post => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </div>
        ))
      )}
    </div>
  );
}
```

---

## Practical Examples

### Document Title Updates

```jsx
function PageTitle({ title }) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return <h1>{title}</h1>;
}
```

### Local Storage Sync

```jsx
function Counter() {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('count');
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('count', count);
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

### Search with Debounce

```jsx
function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Debounce: wait 500ms after user stops typing
    const timer = setTimeout(() => {
      if (searchTerm) {
        fetch(`https://api.example.com/search?q=${searchTerm}`)
          .then(res => res.json())
          .then(data => setResults(data));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Live Clock

```jsx
function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <h2>Current Time</h2>
      <p>{time.toLocaleTimeString()}</p>
    </div>
  );
}
```

---

## Multiple useEffect Hooks

You can use multiple useEffect hooks to separate concerns.

```jsx
function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  // Fetch user data
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]);

  // Fetch user posts
  useEffect(() => {
    fetch(`/api/users/${userId}/posts`)
      .then(res => res.json())
      .then(data => setPosts(data));
  }, [userId]);

  // Update document title
  useEffect(() => {
    if (user) {
      document.title = `${user.name}'s Dashboard`;
    }
  }, [user]);

  return (
    <div>
      {user && <h1>{user.name}</h1>}
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

---

## Common Pitfalls

### ❌ Missing Dependencies

```jsx
// Wrong - missing dependency
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1); // Stale closure
    }, 1000);
    return () => clearInterval(timer);
  }, []); // Missing 'count' in dependencies
}

// ✅ Correct - use function form
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => c + 1); // Function form
    }, 1000);
    return () => clearInterval(timer);
  }, []); // No dependencies needed
}
```

### ❌ Infinite Loops

```jsx
// Wrong - causes infinite loop
function BadComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(count + 1); // This triggers re-render, which triggers effect again
  });

  return <div>{count}</div>;
}
```

---

## 🎯 Practice Exercises

### Exercise 1: Fetch and Display Users
Fetch users from an API and display:
- Loading state
- Error handling
- List of users with details

### Exercise 2: Auto-Save Form
Create a form that auto-saves to localStorage:
- Save on every change after 1 second delay
- Load saved data on mount

### Exercise 3: Live Weather App
Build a component that:
- Fetches weather data
- Updates every 5 minutes
- Shows loading indicator

### Exercise 4: Mouse Tracker
Create a component that:
- Tracks mouse position
- Updates in real-time
- Cleans up event listeners

### Exercise 5: Pagination
Implement pagination that:
- Fetches page data from API
- Updates when page changes
- Shows loading between pages

---

## 💡 Key Takeaways

✅ useEffect handles side effects in components
✅ Dependency array controls when effect runs
✅ Empty array [] means run once on mount
✅ Always clean up subscriptions and timers
✅ Use multiple effects to separate concerns
✅ Avoid infinite loops with proper dependencies
✅ Use function form of setState in effects

---

## 🎓 Level 1 Complete!

Congratulations on completing Level 1! You now know:
- React basics and JSX
- Components and Props
- State and Events
- Conditional Rendering and Lists
- Styling in React
- Component Lifecycle and useEffect

Ready for Level 2? Let's dive into advanced hooks, routing, and state management!

[Next: Level 2 - Intermediate →](../level-2-intermediate/)

---

## 📚 Additional Resources

- [useEffect Hook Guide](https://react.dev/reference/react/useEffect)
- [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

---

*Happy coding! 🚀*
