# Lesson 3: State and Events

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Understand component state with useState
- Handle user events (clicks, inputs, forms)
- Build interactive components
- Manage controlled components

---

## What is State?

**State** is data that changes over time in a component. When state changes, React re-renders the component.

---

## The useState Hook

```jsx
import { useState } from 'react';

function Counter() {
  // Declare a state variable
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

### Syntax Breakdown

```jsx
const [stateVariable, setStateFunction] = useState(initialValue);
```

- `stateVariable`: Current state value
- `setStateFunction`: Function to update state
- `initialValue`: Starting value for the state

---

## Event Handling

### Click Events

```jsx
function ClickExample() {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <button onClick={handleClick}>
      Click Me
    </button>
  );
}

// Inline function
function InlineExample() {
  return (
    <button onClick={() => alert('Clicked!')}>
      Click Me
    </button>
  );
}
```

### Multiple Event Handlers

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

---

## Input Handling

### Controlled Components

```jsx
function InputExample() {
  const [text, setText] = useState('');

  const handleChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="Type something..."
      />
      <p>You typed: {text}</p>
    </div>
  );
}
```

### Shorter Syntax

```jsx
function InputExample() {
  const [text, setText] = useState('');

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <p>You typed: {text}</p>
    </div>
  );
}
```

---

## Form Handling

### Simple Form

```jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent page reload
    console.log('Email:', email);
    console.log('Password:', password);
    // Add login logic here
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit">Login</button>
    </form>
  );
}
```

---

## Practical Examples

### Toggle Visibility

```jsx
function ToggleExample() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? 'Hide' : 'Show'} Content
      </button>

      {isVisible && (
        <div className="content">
          <p>This content can be toggled!</p>
        </div>
      )}
    </div>
  );
}
```

### Shopping Cart Counter

```jsx
function CartItem({ name, price }) {
  const [quantity, setQuantity] = useState(1);

  const increase = () => setQuantity(quantity + 1);
  const decrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const total = (price * quantity).toFixed(2);

  return (
    <div className="cart-item">
      <h3>{name}</h3>
      <p>Price: ${price}</p>

      <div className="quantity-controls">
        <button onClick={decrease}>-</button>
        <span>{quantity}</span>
        <button onClick={increase}>+</button>
      </div>

      <p className="total">Total: ${total}</p>
    </div>
  );
}
```

### Todo List

```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, inputValue]);
      setInputValue('');
    }
  };

  const removeTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2>Todo List</h2>

      <div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}
            <button onClick={() => removeTodo(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Multiple State Variables

```jsx
function UserProfile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState('');

  return (
    <form>
      <input
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
      />
      <input
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
      />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
        placeholder="Age"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <h3>Preview:</h3>
      <p>Name: {firstName} {lastName}</p>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
    </form>
  );
}
```

---

## Object State

```jsx
function UserForm() {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const handleChange = (field, value) => {
    setUser({
      ...user,
      [field]: value
    });
  };

  return (
    <div>
      <input
        value={user.firstName}
        onChange={(e) => handleChange('firstName', e.target.value)}
        placeholder="First Name"
      />
      <input
        value={user.lastName}
        onChange={(e) => handleChange('lastName', e.target.value)}
        placeholder="Last Name"
      />
      <input
        value={user.email}
        onChange={(e) => handleChange('email', e.target.value)}
        placeholder="Email"
      />
    </div>
  );
}
```

---

## 🎯 Practice Exercises

### Exercise 1: Color Picker
Create a component with buttons for different colors. When clicked, change the background color of a div.

### Exercise 2: Character Counter
Create a textarea that displays the remaining characters (max 280).

### Exercise 3: Temperature Converter
Create inputs for Celsius and Fahrenheit that convert between each other.

### Exercise 4: Registration Form
Build a registration form with:
- Username
- Email
- Password
- Confirm Password
- Show validation errors
- Display form data on submit

### Exercise 5: Like Button
Create a button that:
- Shows number of likes
- Changes color when clicked
- Increments count

---

## 💡 Key Takeaways

✅ State is data that changes over time
✅ useState hook manages component state
✅ Event handlers respond to user actions
✅ Always use event.preventDefault() in forms
✅ Controlled components sync input with state
✅ State updates trigger re-renders
✅ Never modify state directly - always use setState

---

## 🔗 What's Next?

In the next lesson, we'll learn about:
- Conditional rendering techniques
- Rendering lists with map()
- Keys in React lists

[Next Lesson: Conditional Rendering and Lists →](./04-conditional-lists.md)

---

## 📚 Additional Resources

- [State: A Component's Memory](https://react.dev/learn/state-a-components-memory)
- [Responding to Events](https://react.dev/learn/responding-to-events)

---

*Happy coding! 🚀*
