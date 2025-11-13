# Lesson 2: Components and Props

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Create reusable functional components
- Pass data between components using props
- Understand prop types and validation
- Master component composition

---

## What are Components?

Components are independent, reusable pieces of UI. Think of them as custom HTML elements that encapsulate structure, style, and behavior.

---

## Functional Components

Modern React uses functional components (arrow functions or regular functions).

### Basic Functional Component

```jsx
// Greeting.jsx
function Greeting() {
  return <h1>Hello, World!</h1>;
}

export default Greeting;
```

### Arrow Function Component

```jsx
// Greeting.jsx
const Greeting = () => {
  return <h1>Hello, World!</h1>;
};

export default Greeting;
```

### Using the Component

```jsx
// App.jsx
import Greeting from './Greeting';

function App() {
  return (
    <div>
      <Greeting />
      <Greeting />
      <Greeting />
    </div>
  );
}
```

---

## Props: Passing Data to Components

Props (properties) are how we pass data from parent to child components.

### Basic Props Example

```jsx
// Greeting.jsx
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

export default Greeting;
```

```jsx
// App.jsx
import Greeting from './Greeting';

function App() {
  return (
    <div>
      <Greeting name="Alice" />
      <Greeting name="Bob" />
      <Greeting name="Charlie" />
    </div>
  );
}
```

### Destructuring Props

```jsx
// More readable approach
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

### Multiple Props

```jsx
// UserCard.jsx
function UserCard({ name, age, email, role }) {
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
      <p>Role: {role}</p>
    </div>
  );
}

export default UserCard;
```

```jsx
// App.jsx
function App() {
  return (
    <div>
      <UserCard
        name="John Doe"
        age={30}
        email="john@example.com"
        role="Developer"
      />
      <UserCard
        name="Jane Smith"
        age={25}
        email="jane@example.com"
        role="Designer"
      />
    </div>
  );
}
```

---

## Default Props

```jsx
function Greeting({ name = "Guest" }) {
  return <h1>Hello, {name}!</h1>;
}

// If no name prop is provided, it will display "Hello, Guest!"
<Greeting />          // Hello, Guest!
<Greeting name="Alice" />  // Hello, Alice!
```

---

## Props are Read-Only

**Important:** You cannot modify props inside a component.

```jsx
// ❌ Wrong - Never modify props
function Greeting({ name }) {
  name = "Modified"; // This will cause an error
  return <h1>Hello, {name}!</h1>;
}

// ✅ Correct - Props are immutable
function Greeting({ name }) {
  const displayName = name.toUpperCase();
  return <h1>Hello, {displayName}!</h1>;
}
```

---

## Children Props

Special prop for passing JSX between component tags.

```jsx
// Card.jsx
function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

export default Card;
```

```jsx
// App.jsx
function App() {
  return (
    <Card>
      <h2>Card Title</h2>
      <p>This is card content</p>
      <button>Click Me</button>
    </Card>
  );
}
```

---

## Practical Example: Product List

```jsx
// Product.jsx
function Product({ name, price, image, description }) {
  return (
    <div className="product">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p>{description}</p>
      <p className="price">${price}</p>
      <button>Add to Cart</button>
    </div>
  );
}

export default Product;
```

```jsx
// App.jsx
import Product from './Product';

function App() {
  return (
    <div className="product-list">
      <h1>Our Products</h1>

      <Product
        name="Laptop"
        price={999}
        image="/laptop.jpg"
        description="High-performance laptop for developers"
      />

      <Product
        name="Mouse"
        price={29}
        image="/mouse.jpg"
        description="Wireless ergonomic mouse"
      />

      <Product
        name="Keyboard"
        price={79}
        image="/keyboard.jpg"
        description="Mechanical keyboard with RGB"
      />
    </div>
  );
}
```

---

## Component Composition

Building complex UIs by composing simpler components.

```jsx
// Button.jsx
function Button({ text, onClick, variant = "primary" }) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

// Card.jsx
function Card({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

// App.jsx
function App() {
  return (
    <div>
      <Card title="User Actions">
        <Button text="Save" variant="primary" />
        <Button text="Cancel" variant="secondary" />
        <Button text="Delete" variant="danger" />
      </Card>
    </div>
  );
}
```

---

## PropTypes (Optional but Recommended)

Type checking for props to catch bugs early.

```bash
npm install prop-types
```

```jsx
import PropTypes from 'prop-types';

function UserCard({ name, age, email }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
    </div>
  );
}

UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  email: PropTypes.string.isRequired
};

export default UserCard;
```

---

## 🎯 Practice Exercises

### Exercise 1: Profile Card Component
Create a `ProfileCard` component that accepts:
- name (string)
- bio (string)
- avatarUrl (string)
- isOnline (boolean) - display a green/red dot

### Exercise 2: Blog Post Component
Create a `BlogPost` component with:
- title
- author
- date
- content
- tags (array)

### Exercise 3: Button Component Library
Create reusable button components:
- PrimaryButton
- SecondaryButton
- DangerButton

Each should accept `text` and `onClick` props.

### Exercise 4: Nested Components
Create a `Page` component that uses:
- Header (with logo and navigation)
- Sidebar (with menu items)
- Content (main content area)
- Footer (copyright info)

---

## 💡 Key Takeaways

✅ Components are reusable UI building blocks
✅ Props pass data from parent to child (one-way data flow)
✅ Props are immutable (read-only)
✅ Destructure props for cleaner code
✅ Use default props for optional values
✅ `children` prop passes JSX between tags
✅ Compose small components to build complex UIs

---

## 🔗 What's Next?

In the next lesson, we'll learn about:
- Managing component state with useState
- Handling user events
- Building interactive forms

[Next Lesson: State and Events →](./03-state-events.md)

---

## 📚 Additional Resources

- [React Components and Props](https://react.dev/learn/passing-props-to-a-component)
- [Composition vs Inheritance](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)

---

*Happy coding! 🚀*
