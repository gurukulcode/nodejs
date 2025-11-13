# Problem #019: Component Lifecycle with Hooks

**Difficulty**: 🟢 Easy
**Category**: State & Lifecycle
**Time**: 10-12 minutes

---

## 📝 Problem Statement

**Question 1**: What are the component lifecycle phases?
**Question 2**: How do you implement lifecycle methods with hooks?
**Question 3**: What replaces componentDidMount, componentDidUpdate, componentWillUnmount?

---

## ✅ Complete Answer

### Lifecycle Phases

1. **Mounting**: Component is created
2. **Updating**: State/props change
3. **Unmounting**: Component is removed

### Hooks Equivalent

```jsx
import { useEffect } from 'react';

useEffect(() => {
  // componentDidMount
  console.log('Mounted');

  return () => {
    // componentWillUnmount
    console.log('Unmounting');
  };
}, []);

useEffect(() => {
  // componentDidUpdate (when userId changes)
  console.log('userId updated:', userId);
}, [userId]);
```

### Complete Example

```jsx
const DataFetcher = ({ userId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log('Component mounted');
    fetchData(userId);

    return () => console.log('Component unmounting');
  }, []);

  useEffect(() => {
    console.log('userId changed, refetching');
    fetchData(userId);
  }, [userId]);

  const fetchData = async (id) => {
    const response = await fetch(`/api/users/${id}`);
    setData(await response.json());
  };

  return <Text>{data?.name}</Text>;
};
```

---

**Difficulty**: 🟢 Easy
**Estimated Time**: 10-12 minutes

---

*This problem is part of the React Native Interview Problems Collection*
