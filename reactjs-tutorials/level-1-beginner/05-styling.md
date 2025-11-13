# Lesson 5: Styling in React

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Apply CSS styles in React applications
- Use CSS Modules for scoped styling
- Understand inline styles and dynamic styling
- Get introduced to popular CSS-in-JS solutions

---

## Traditional CSS

### External CSS File

```jsx
// App.jsx
import './App.css';

function App() {
  return (
    <div className="container">
      <h1 className="title">Hello React</h1>
      <button className="btn btn-primary">Click Me</button>
    </div>
  );
}
```

```css
/* App.css */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}
```

---

## CSS Modules

Scoped CSS that avoids naming conflicts.

### Setup

```jsx
// Button.jsx
import styles from './Button.module.css';

function Button({ children, variant = 'primary' }) {
  return (
    <button className={`${styles.btn} ${styles[variant]}`}>
      {children}
    </button>
  );
}

export default Button;
```

```css
/* Button.module.css */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.primary {
  background-color: #007bff;
  color: white;
}

.primary:hover {
  background-color: #0056b3;
}

.secondary {
  background-color: #6c757d;
  color: white;
}

.danger {
  background-color: #dc3545;
  color: white;
}
```

---

## Inline Styles

### Basic Inline Styles

```jsx
function Box() {
  const boxStyle = {
    width: '200px',
    height: '200px',
    backgroundColor: '#007bff',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '24px'
  };

  return <div style={boxStyle}>Hello</div>;
}
```

### Dynamic Inline Styles

```jsx
function Alert({ type, message }) {
  const styles = {
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '10px',
    backgroundColor: type === 'error' ? '#f8d7da' : '#d4edda',
    color: type === 'error' ? '#721c24' : '#155724',
    border: `1px solid ${type === 'error' ? '#f5c6cb' : '#c3e6cb'}`
  };

  return <div style={styles}>{message}</div>;
}
```

---

## Conditional Styling

### Using classNames Package

```bash
npm install classnames
```

```jsx
import classNames from 'classnames';
import styles from './Button.module.css';

function Button({ children, variant, disabled, fullWidth }) {
  const buttonClass = classNames(styles.btn, {
    [styles.primary]: variant === 'primary',
    [styles.secondary]: variant === 'secondary',
    [styles.danger]: variant === 'danger',
    [styles.disabled]: disabled,
    [styles.fullWidth]: fullWidth
  });

  return (
    <button className={buttonClass} disabled={disabled}>
      {children}
    </button>
  );
}
```

---

## Practical Examples

### Card Component

```jsx
// Card.jsx
import styles from './Card.module.css';

function Card({ title, description, image, highlighted }) {
  return (
    <div className={`${styles.card} ${highlighted ? styles.highlighted : ''}`}>
      {image && (
        <img src={image} alt={title} className={styles.cardImage} />
      )}
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
      </div>
    </div>
  );
}
```

```css
/* Card.module.css */
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  background: white;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.highlighted {
  border: 2px solid #007bff;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.3);
}

.cardImage {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.cardBody {
  padding: 20px;
}

.cardTitle {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #333;
}

.cardDescription {
  color: #666;
  line-height: 1.6;
}
```

### Theme Toggle

```jsx
function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  const appStyle = {
    minHeight: '100vh',
    backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
    color: darkMode ? '#ffffff' : '#000000',
    transition: 'all 0.3s ease',
    padding: '20px'
  };

  return (
    <div style={appStyle}>
      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
      <h1>Welcome to my app</h1>
      <p>This theme toggles between light and dark mode.</p>
    </div>
  );
}
```

---

## Introduction to Styled-Components

### Installation

```bash
npm install styled-components
```

### Basic Usage

```jsx
import styled from 'styled-components';

const Button = styled.button`
  background-color: ${props => props.primary ? '#007bff' : '#6c757d'};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: ${props => props.primary ? '#0056b3' : '#5a6268'};
  }
`;

function App() {
  return (
    <div>
      <Button primary>Primary Button</Button>
      <Button>Secondary Button</Button>
    </div>
  );
}
```

---

## Tailwind CSS with React

### Installation

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Usage

```jsx
function Card({ title, description }) {
  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
      <div className="px-6 py-4">
        <h3 className="font-bold text-xl mb-2 text-gray-800">
          {title}
        </h3>
        <p className="text-gray-600 text-base">
          {description}
        </p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Learn More
        </button>
      </div>
    </div>
  );
}
```

---

## Responsive Design

### CSS Modules with Media Queries

```css
/* Component.module.css */
.container {
  padding: 20px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## 🎯 Practice Exercises

### Exercise 1: Button Component Library
Create buttons with different variants:
- Primary, Secondary, Danger, Success
- Small, Medium, Large sizes
- Outlined and Solid styles

### Exercise 2: Profile Card
Design a user profile card with:
- Avatar
- Name and bio
- Social media links
- Hover effects

### Exercise 3: Dark Mode Toggle
Implement a complete dark mode:
- Toggle button
- Persistent theme (localStorage)
- Apply to all components

### Exercise 4: Responsive Navigation
Build a navigation bar that:
- Shows all links on desktop
- Collapses to hamburger menu on mobile
- Smooth transitions

### Exercise 5: Form Styling
Style a complete form with:
- Input fields with focus states
- Error messages styling
- Success indicators
- Loading states

---

## 💡 Key Takeaways

✅ Use className instead of class in JSX
✅ CSS Modules provide scoped styling
✅ Inline styles use camelCase properties
✅ Dynamic styles based on props/state
✅ classnames package for conditional classes
✅ Choose styling approach based on project needs
✅ Tailwind CSS for utility-first approach
✅ Styled-components for CSS-in-JS

---

## 🔗 What's Next?

In the next lesson, we'll learn about:
- Component lifecycle in depth
- useEffect hook for side effects
- Data fetching basics
- Cleanup functions

[Next Lesson: Component Lifecycle & useEffect →](./06-lifecycle-useeffect.md)

---

## 📚 Additional Resources

- [Styling React Components](https://react.dev/learn/styling)
- [CSS Modules GitHub](https://github.com/css-modules/css-modules)
- [Styled Components Docs](https://styled-components.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

---

*Happy coding! 🚀*
