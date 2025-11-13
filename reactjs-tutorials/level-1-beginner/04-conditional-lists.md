# Lesson 4: Conditional Rendering and Lists

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Master conditional rendering techniques
- Render lists dynamically with map()
- Understand the importance of keys
- Handle empty states

---

## Conditional Rendering

Displaying different UI based on conditions.

### Using if/else

```jsx
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  } else {
    return <h1>Please sign in</h1>;
  }
}
```

### Ternary Operator (Recommended)

```jsx
function Greeting({ isLoggedIn }) {
  return (
    <h1>
      {isLoggedIn ? 'Welcome back!' : 'Please sign in'}
    </h1>
  );
}
```

### Logical AND (&amp;&amp;) Operator

```jsx
function Notification({ hasMessages }) {
  return (
    <div>
      <h2>Inbox</h2>
      {hasMessages && <p>You have new messages!</p>}
    </div>
  );
}
```

---

## Complex Conditional Rendering

### Multiple Conditions

```jsx
function UserStatus({ status }) {
  return (
    <div>
      {status === 'online' && <span className="status-online">🟢 Online</span>}
      {status === 'offline' && <span className="status-offline">⚫ Offline</span>}
      {status === 'away' && <span className="status-away">🟡 Away</span>}
    </div>
  );
}
```

### Switch-like Pattern

```jsx
function Message({ type }) {
  const messages = {
    success: 'Operation successful!',
    error: 'Something went wrong!',
    warning: 'Please be careful!',
    info: 'Here is some information'
  };

  return (
    <div className={`message message-${type}`}>
      {messages[type]}
    </div>
  );
}
```

---

## Rendering Lists

### Basic List Rendering

```jsx
function FruitList() {
  const fruits = ['Apple', 'Banana', 'Orange', 'Mango'];

  return (
    <ul>
      {fruits.map((fruit, index) => (
        <li key={index}>{fruit}</li>
      ))}
    </ul>
  );
}
```

### List of Objects

```jsx
function UserList() {
  const users = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
    { id: 3, name: 'Charlie', age: 35 }
  ];

  return (
    <div>
      {users.map(user => (
        <div key={user.id} className="user-card">
          <h3>{user.name}</h3>
          <p>Age: {user.age}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Understanding Keys

Keys help React identify which items have changed, been added, or removed.

### ✅ Good Practice

```jsx
// Use unique IDs
<div key={user.id}>{user.name}</div>

// Or unique combinations
<div key={`${user.id}-${user.email}`}>{user.name}</div>
```

### ❌ Bad Practice

```jsx
// Don't use array index as key if list can change
<div key={index}>{user.name}</div>

// Don't use random values
<div key={Math.random()}>{user.name}</div>
```

---

## Practical Examples

### Product Catalog

```jsx
function ProductCatalog() {
  const products = [
    { id: 1, name: 'Laptop', price: 999, inStock: true },
    { id: 2, name: 'Phone', price: 699, inStock: false },
    { id: 3, name: 'Tablet', price: 499, inStock: true }
  ];

  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product.id} className="product">
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          {product.inStock ? (
            <button>Add to Cart</button>
          ) : (
            <p className="out-of-stock">Out of Stock</p>
          )}
        </div>
      ))}
    </div>
  );
}
```

### Filtered List

```jsx
function TaskList() {
  const [filter, setFilter] = useState('all');

  const tasks = [
    { id: 1, title: 'Buy groceries', completed: false },
    { id: 2, title: 'Write code', completed: true },
    { id: 3, title: 'Exercise', completed: false },
    { id: 4, title: 'Read book', completed: true }
  ];

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  return (
    <div>
      <div className="filters">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>

      <ul>
        {filteredTasks.map(task => (
          <li key={task.id}>
            {task.title}
            {task.completed && ' ✓'}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Empty State

```jsx
function MessageList({ messages }) {
  return (
    <div>
      <h2>Messages</h2>
      {messages.length === 0 ? (
        <div className="empty-state">
          <p>No messages yet</p>
          <p>Start a conversation!</p>
        </div>
      ) : (
        <ul>
          {messages.map(message => (
            <li key={message.id}>
              <strong>{message.sender}:</strong> {message.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

## Conditional Rendering with Components

### Loading States

```jsx
function DataDisplay({ isLoading, data, error }) {
  if (isLoading) {
    return <div className="spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!data || data.length === 0) {
    return <div className="empty">No data available</div>;
  }

  return (
    <ul>
      {data.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### Authentication Flow

```jsx
function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {user ? (
        <Dashboard user={user} onLogout={() => setUser(null)} />
      ) : (
        <LoginForm onLogin={setUser} />
      )}
    </div>
  );
}
```

---

## Advanced List Patterns

### Nested Lists

```jsx
function CategoryList({ categories }) {
  return (
    <div>
      {categories.map(category => (
        <div key={category.id} className="category">
          <h3>{category.name}</h3>
          <ul>
            {category.items.map(item => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

### Dynamic Table

```jsx
function UserTable({ users }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              {user.isActive ? (
                <span className="badge-success">Active</span>
              ) : (
                <span className="badge-danger">Inactive</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## 🎯 Practice Exercises

### Exercise 1: Weather App
Create a component that shows different icons based on weather conditions:
- Sunny ☀️
- Rainy 🌧️
- Cloudy ☁️
- Snowy ❄️

### Exercise 2: Student Grade Display
Display a list of students with:
- Name
- Grade
- Pass/Fail status (pass if grade >= 60)
- Different styling for pass/fail

### Exercise 3: Search Filter
Create a searchable list:
- Display list of items
- Add search input
- Filter items based on search term

### Exercise 4: Shopping Cart
Build a cart that shows:
- List of items with quantity
- Total price calculation
- Empty cart message
- Remove item functionality

### Exercise 5: Notification Center
Create a notification system:
- Different types: success, error, warning, info
- Show/hide based on state
- Auto-dismiss after 3 seconds

---

## 💡 Key Takeaways

✅ Use ternary operator for simple conditions
✅ Use && for conditional rendering
✅ map() renders lists dynamically
✅ Always provide unique keys
✅ Handle empty states gracefully
✅ Filter arrays before rendering
✅ Extract list items into components for complexity

---

## 🔗 What's Next?

In the next lesson, we'll learn about:
- CSS Modules
- Styled-components
- Tailwind CSS with React
- Dynamic styling

[Next Lesson: Styling in React →](./05-styling.md)

---

## 📚 Additional Resources

- [Conditional Rendering](https://react.dev/learn/conditional-rendering)
- [Rendering Lists](https://react.dev/learn/rendering-lists)

---

*Happy coding! 🚀*
