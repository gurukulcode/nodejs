# Problem #018: State Updates and Batching

**Difficulty**: 🟢 Easy
**Category**: State & Lifecycle
**Time**: 8-10 minutes

---

## 📝 Problem Statement

**Question 1**: How does React Native batch state updates?
**Question 2**: When should you use functional updates?
**Question 3**: How do you update nested state correctly?

---

## ✅ Complete Answer

### Batched Updates

```jsx
const handleClick = () => {
  setCount(count + 1);
  setName('John');
  setActive(true);
  // All batched into single re-render
};
```

### Functional Updates

```jsx
// ✅ Use functional update when new state depends on old
setCount(prev => prev + 1);
setItems(prev => [...prev, newItem]);
```

### Nested State

```jsx
const [user, setUser] = useState({
  profile: { name: 'John', age: 30 },
  settings: { theme: 'dark' },
});

// Update nested property
setUser(prev => ({
  ...prev,
  profile: {
    ...prev.profile,
    age: 31,
  },
}));
```

---

**Difficulty**: 🟢 Easy
**Estimated Time**: 8-10 minutes

---

*This problem is part of the React Native Interview Problems Collection*
