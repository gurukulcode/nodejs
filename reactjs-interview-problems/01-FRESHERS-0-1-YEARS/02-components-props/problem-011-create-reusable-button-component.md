# Problem #011: Create a Reusable Button Component

**Difficulty**: 🟢 Easy
**Category**: Components & Props
**Type**: Coding Problem
**Time**: 15-20 minutes

---

## 📝 Problem Statement

Create a reusable `Button` component that accepts the following props:
- `text` (string) - Button label
- `onClick` (function) - Click handler
- `variant` (string) - Button style: 'primary', 'secondary', 'danger'
- `size` (string) - Button size: 'small', 'medium', 'large'
- `disabled` (boolean) - Whether button is disabled
- `icon` (ReactNode, optional) - Icon to display before text

The component should be flexible and reusable across your application.

---

## 🎯 Requirements

1. Create a functional component called `Button`
2. Accept and use all the specified props
3. Apply appropriate CSS classes based on `variant` and `size`
4. Handle the disabled state properly
5. Support optional icon prop
6. Use PropTypes for prop validation
7. Set default values for optional props

---

## ✅ Solution

### Button.jsx

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

function Button({
  text,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  icon = null,
  type = 'button'
}) {
  // Generate className based on props
  const buttonClass = `btn btn-${variant} btn-${size} ${disabled ? 'btn-disabled' : ''}`;

  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={handleClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      <span className="btn-text">{text}</span>
    </button>
  );
}

// PropTypes validation
Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

// Default props
Button.defaultProps = {
  variant: 'primary',
  size: 'medium',
  disabled: false,
  icon: null,
  type: 'button',
  onClick: null
};

export default Button;
```

### Button.css

```css
/* Base button styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  white-space: nowrap;
}

.btn:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Sizes */
.btn-small {
  padding: 6px 12px;
  font-size: 14px;
}

.btn-medium {
  padding: 10px 20px;
  font-size: 16px;
}

.btn-large {
  padding: 14px 28px;
  font-size: 18px;
}

/* Variants */
.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #545b62;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #c82333;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: #218838;
}

/* Disabled state */
.btn-disabled,
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Icon */
.btn-icon {
  display: inline-flex;
  align-items: center;
}

.btn-text {
  display: inline-block;
}
```

### Usage Example (App.jsx)

```jsx
import React from 'react';
import Button from './Button';

function App() {
  const handleClick = () => {
    alert('Button clicked!');
  };

  const handleDelete = () => {
    console.log('Delete action');
  };

  return (
    <div className="app">
      <h1>Reusable Button Component Demo</h1>

      <section>
        <h2>Variants</h2>
        <Button text="Primary Button" onClick={handleClick} />
        <Button text="Secondary Button" variant="secondary" onClick={handleClick} />
        <Button text="Danger Button" variant="danger" onClick={handleDelete} />
        <Button text="Success Button" variant="success" onClick={handleClick} />
      </section>

      <section>
        <h2>Sizes</h2>
        <Button text="Small" size="small" onClick={handleClick} />
        <Button text="Medium" size="medium" onClick={handleClick} />
        <Button text="Large" size="large" onClick={handleClick} />
      </section>

      <section>
        <h2>With Icons</h2>
        <Button
          text="Download"
          icon={<span>⬇️</span>}
          onClick={handleClick}
        />
        <Button
          text="Delete"
          variant="danger"
          icon={<span>🗑️</span>}
          onClick={handleDelete}
        />
        <Button
          text="Settings"
          variant="secondary"
          icon={<span>⚙️</span>}
          onClick={handleClick}
        />
      </section>

      <section>
        <h2>Disabled State</h2>
        <Button text="Disabled Primary" disabled onClick={handleClick} />
        <Button text="Disabled Secondary" variant="secondary" disabled onClick={handleClick} />
        <Button text="Disabled Danger" variant="danger" disabled onClick={handleDelete} />
      </section>
    </div>
  );
}

export default App;
```

---

## 📖 Explanation

### 1. Component Structure
```jsx
function Button({ text, onClick, variant, size, disabled, icon, type }) {
  // Component logic
}
```
- Uses destructuring to extract props
- Clear parameter names

### 2. Dynamic className Generation
```jsx
const buttonClass = `btn btn-${variant} btn-${size} ${disabled ? 'btn-disabled' : ''}`;
```
- Combines multiple classes based on props
- Conditional class for disabled state

### 3. Click Handler
```jsx
const handleClick = (e) => {
  if (!disabled && onClick) {
    onClick(e);
  }
};
```
- Prevents clicks when disabled
- Only calls onClick if it exists

### 4. PropTypes Validation
```jsx
Button.propTypes = {
  text: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success']),
  // ...
};
```
- Validates prop types at runtime
- Helps catch bugs early
- Provides documentation

### 5. Default Props
```jsx
Button.defaultProps = {
  variant: 'primary',
  size: 'medium',
  // ...
};
```
- Sets sensible defaults
- Makes component easier to use

---

## 🚀 Alternative Implementation (Using classnames Package)

```jsx
import classNames from 'classnames';

function Button({ text, onClick, variant, size, disabled, icon, type }) {
  const buttonClass = classNames('btn', {
    [`btn-${variant}`]: variant,
    [`btn-${size}`]: size,
    'btn-disabled': disabled
  });

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      <span className="btn-text">{text}</span>
    </button>
  );
}
```

---

## 🎯 Advanced Version (TypeScript)

```tsx
import React from 'react';
import './Button.css';

interface ButtonProps {
  text: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  icon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  icon = null,
  type = 'button'
}) => {
  const buttonClass = `btn btn-${variant} btn-${size} ${disabled ? 'btn-disabled' : ''}`;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={handleClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      <span className="btn-text">{text}</span>
    </button>
  );
};

export default Button;
```

---

## ✅ Common Mistakes

❌ **Mistake 1**: Not handling disabled state in onClick
```jsx
// Wrong - onClick fires even when disabled
<button onClick={onClick} disabled={disabled}>
```

✅ **Correction**: Check disabled state before calling onClick
```jsx
const handleClick = (e) => {
  if (!disabled && onClick) {
    onClick(e);
  }
};
```

❌ **Mistake 2**: Not providing default props
```jsx
// Component breaks if variant not provided
<Button text="Click" />
```

✅ **Correction**: Set default values
```jsx
function Button({ variant = 'primary', ... }) { }
```

❌ **Mistake 3**: Hardcoding styles instead of using CSS classes
```jsx
// Wrong - mixing concerns
<button style={{ backgroundColor: 'blue' }}>
```

✅ **Correction**: Use CSS classes
```jsx
<button className="btn-primary">
```

---

## 🎯 Follow-up Questions

**Q1**: How would you add loading state to this button?
**A**: Add a `loading` prop and display a spinner icon, disable button during loading.

**Q2**: How can you make this button support full width?
**A**: Add a `fullWidth` prop that adds `width: 100%` CSS class.

**Q3**: How would you add different button shapes (rounded, circle)?
**A**: Add a `shape` prop with values like 'default', 'rounded', 'circle'.

**Q4**: How to handle button click analytics?
**A**: Wrap the onClick handler to send analytics events before calling the actual handler.

---

## 💡 Key Takeaways

✅ Reusable components accept props for customization
✅ PropTypes help validate props and catch errors
✅ Default props make components easier to use
✅ CSS classes keep styling separate from logic
✅ Handle edge cases (disabled, missing onClick)
✅ Accessibility matters (aria attributes)

---

**Difficulty**: 🟢 Easy
**Estimated Time**: 15-20 minutes
**Next Problem**: [#012: Props Destructuring and Default Values →](./problem-012-props-destructuring.md)

---

*This problem is part of the ReactJS Interview Problems Collection*
