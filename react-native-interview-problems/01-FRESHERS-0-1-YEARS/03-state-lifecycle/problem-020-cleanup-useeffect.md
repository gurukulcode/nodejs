# Problem #020: Cleanup in useEffect

**Difficulty**: 🟢 Easy
**Category**: State & Lifecycle
**Time**: 8-10 minutes

---

## 📝 Problem Statement

**Question 1**: Why is cleanup important in useEffect?
**Question 2**: What are common scenarios requiring cleanup?
**Question 3**: How do you implement proper cleanup?

---

## ✅ Complete Answer

### Why Cleanup Matters

```jsx
// ❌ Without cleanup - memory leak!
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Running...');
  }, 1000);
  // Timer continues after unmount!
}, []);

// ✅ With cleanup
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Running...');
  }, 1000);

  return () => clearInterval(timer);
}, []);
```

### Common Cleanup Scenarios

```jsx
// Timers
useEffect(() => {
  const timer = setTimeout(() => {}, 1000);
  return () => clearTimeout(timer);
}, []);

// Event listeners
useEffect(() => {
  const handler = () => console.log('Clicked');
  window.addEventListener('click', handler);
  return () => window.removeEventListener('click', handler);
}, []);

// Subscriptions
useEffect(() => {
  const subscription = dataStream.subscribe(data => {});
  return () => subscription.unsubscribe();
}, []);

// Abort fetch
useEffect(() => {
  const abortController = new AbortController();

  fetch('/api/data', { signal: abortController.signal })
    .then(res => res.json())
    .then(setData);

  return () => abortController.abort();
}, []);
```

### Complete Pattern

```jsx
const Component = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetchData().then(result => {
      if (isMounted) {
        setData(result);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return <Text>{data}</Text>;
};
```

---

**Difficulty**: 🟢 Easy
**Estimated Time**: 8-10 minutes

---

*This problem is part of the React Native Interview Problems Collection*
