# Problem #021: Build a Simple TODO App

**Difficulty**: 🟡 Medium
**Category**: State & Events
**Type**: Coding Problem
**Time**: 25-30 minutes

---

## 📝 Problem Statement

Build a functional TODO application with the following features:
1. Add new todos
2. Mark todos as complete/incomplete
3. Delete todos
4. Display todo count (total, active, completed)
5. Clear all completed todos
6. Input validation (no empty todos)

---

## 🎯 Requirements

✅ Use `useState` hook for state management
✅ Handle form submission properly
✅ Implement controlled input
✅ Each todo should have: id, text, completed status
✅ Show appropriate UI feedback
✅ Clean, readable code
✅ Basic styling for better UX

---

## ✅ Complete Solution

### TodoApp.jsx

```jsx
import React, { useState } from 'react';
import './TodoApp.css';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  // Add new todo
  const addTodo = (e) => {
    e.preventDefault();

    if (inputValue.trim() === '') {
      alert('Please enter a todo!');
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTodos([...todos, newTodo]);
    setInputValue(''); // Clear input
  };

  // Toggle todo completion
  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Delete todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Clear all completed todos
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  // Delete all todos
  const deleteAll = () => {
    if (window.confirm('Are you sure you want to delete all todos?')) {
      setTodos([]);
    }
  };

  // Calculate counts
  const totalCount = todos.length;
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  // Filter todos based on current filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'
  });

  return (
    <div className="todo-app">
      <div className="todo-container">
        <h1>📝 My Todo List</h1>

        {/* Input Form */}
        <form onSubmit={addTodo} className="todo-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What needs to be done?"
            className="todo-input"
          />
          <button type="submit" className="add-btn">
            Add Todo
          </button>
        </form>

        {/* Stats */}
        <div className="todo-stats">
          <span>Total: {totalCount}</span>
          <span>Active: {activeCount}</span>
          <span>Completed: {completedCount}</span>
        </div>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        {/* Todo List */}
        <ul className="todo-list">
          {filteredTodos.length === 0 ? (
            <li className="empty-state">
              {filter === 'all' && 'No todos yet. Add one above!'}
              {filter === 'active' && 'No active todos!'}
              {filter === 'completed' && 'No completed todos!'}
            </li>
          ) : (
            filteredTodos.map(todo => (
              <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <div className="todo-content">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="todo-checkbox"
                  />
                  <span className="todo-text">{todo.text}</span>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-btn"
                  title="Delete todo"
                >
                  🗑️
                </button>
              </li>
            ))
          )}
        </ul>

        {/* Action Buttons */}
        {todos.length > 0 && (
          <div className="action-buttons">
            {completedCount > 0 && (
              <button onClick={clearCompleted} className="clear-completed-btn">
                Clear Completed ({completedCount})
              </button>
            )}
            <button onClick={deleteAll} className="delete-all-btn">
              Delete All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TodoApp;
```

### TodoApp.css

```css
.todo-app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.todo-container {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 30px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 32px;
}

/* Form */
.todo-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.todo-input {
  flex: 1;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s;
}

.todo-input:focus {
  border-color: #667eea;
}

.add-btn {
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.add-btn:hover {
  background: #5568d3;
}

/* Stats */
.todo-stats {
  display: flex;
  justify-content: space-around;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
  font-weight: 600;
  color: #555;
}

/* Filters */
.filter-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
}

.filter-buttons button {
  padding: 8px 20px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.filter-buttons button:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-buttons button.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* Todo List */
.todo-list {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: all 0.3s;
  background: white;
}

.todo-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.todo-item.completed {
  opacity: 0.6;
  background: #f8f9fa;
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.todo-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.todo-text {
  font-size: 16px;
  color: #333;
  word-break: break-word;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: #999;
}

.delete-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.delete-btn:hover {
  opacity: 1;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
  font-style: italic;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.clear-completed-btn,
.delete-all-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.clear-completed-btn {
  background: #28a745;
  color: white;
}

.clear-completed-btn:hover {
  background: #218838;
}

.delete-all-btn {
  background: #dc3545;
  color: white;
}

.delete-all-btn:hover {
  background: #c82333;
}
```

---

## 📖 Code Explanation

### 1. State Management

```jsx
const [todos, setTodos] = useState([]);
const [inputValue, setInputValue] = useState('');
const [filter, setFilter] = useState('all');
```
- `todos`: Array of todo objects
- `inputValue`: Controlled input for new todos
- `filter`: Current filter ('all', 'active', 'completed')

### 2. Adding Todos

```jsx
const addTodo = (e) => {
  e.preventDefault(); // Prevent page reload

  if (inputValue.trim() === '') {
    alert('Please enter a todo!');
    return;
  }

  const newTodo = {
    id: Date.now(), // Simple unique ID
    text: inputValue.trim(),
    completed: false
  };

  setTodos([...todos, newTodo]); // Add to array
  setInputValue(''); // Clear input
};
```

### 3. Toggling Completion

```jsx
const toggleTodo = (id) => {
  setTodos(
    todos.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo
    )
  );
};
```
- Maps through todos
- Finds matching ID
- Toggles completed status
- Returns new array

### 4. Filtering Todos

```jsx
const filteredTodos = todos.filter(todo => {
  if (filter === 'active') return !todo.completed;
  if (filter === 'completed') return todo.completed;
  return true; // 'all'
});
```

### 5. Calculated Values

```jsx
const totalCount = todos.length;
const activeCount = todos.filter(todo => !todo.completed).length;
const completedCount = todos.filter(todo => todo.completed).length;
```
- Derived from todos state
- No need for separate state variables

---

## 🚀 Advanced Enhancements

### 1. Local Storage Persistence

```jsx
import { useEffect } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // ... rest of code
}
```

### 2. Edit Todo Functionality

```jsx
const [editingId, setEditingId] = useState(null);
const [editText, setEditText] = useState('');

const startEdit = (todo) => {
  setEditingId(todo.id);
  setEditText(todo.text);
};

const saveEdit = () => {
  setTodos(
    todos.map(todo =>
      todo.id === editingId ? { ...todo, text: editText } : todo
    )
  );
  setEditingId(null);
};
```

### 3. Due Dates

```jsx
const newTodo = {
  id: Date.now(),
  text: inputValue.trim(),
  completed: false,
  dueDate: null, // Add date picker
  createdAt: new Date().toISOString()
};
```

---

## ✅ Common Mistakes

❌ **Mistake 1**: Mutating state directly
```jsx
// Wrong
todos.push(newTodo);
setTodos(todos);
```

✅ **Correction**: Create new array
```jsx
setTodos([...todos, newTodo]);
```

❌ **Mistake 2**: Not preventing form submission
```jsx
// Wrong - page reloads
const addTodo = () => { /* ... */ }
```

✅ **Correction**: Use e.preventDefault()
```jsx
const addTodo = (e) => {
  e.preventDefault();
  /* ... */
}
```

❌ **Mistake 3**: Using array index as key
```jsx
// Wrong - causes issues on delete/reorder
{todos.map((todo, index) => <li key={index}>)}
```

✅ **Correction**: Use unique ID
```jsx
{todos.map(todo => <li key={todo.id}>)}
```

---

## 🎯 Follow-up Questions

**Q1**: How would you add todo editing functionality?
**A**: Add edit state, double-click handler, save/cancel buttons.

**Q2**: How to persist todos across page refreshes?
**A**: Use localStorage with useEffect to save/load todos.

**Q3**: How to add todo priorities or categories?
**A**: Extend todo object with priority/category fields, add filtering.

**Q4**: How to implement drag-and-drop reordering?
**A**: Use libraries like react-beautiful-dnd or implement with HTML5 drag API.

**Q5**: How to add due dates and sort by date?
**A**: Add dueDate field, implement sorting function.

---

## 💡 Key Takeaways

✅ useState manages component state
✅ Controlled inputs sync with state
✅ Array methods (map, filter) for data transformation
✅ Unique keys for list items
✅ Form submission handling
✅ Derived state from existing state
✅ Conditional rendering for empty states

---

**Difficulty**: 🟡 Medium
**Estimated Time**: 25-30 minutes
**Next Problem**: [#022: Form Validation →](./problem-022-form-validation.md)

---

*This problem is part of the ReactJS Interview Problems Collection*
