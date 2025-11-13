# Problem #041: Fetch API Basics

**Difficulty**: 🟡 Medium
**Category**: API Integration
**Time**: 12-15 minutes

---

## 📝 Problem Statement

**Question 1**: How do you implement Fetch API Basics?
**Question 2**: Handle loading, error, and success states.
**Question 3**: Show best practices for data fetching.

---

## ✅ Complete Answer

```jsx
import { useState, useEffect } from 'react';

const DataFetcher = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://api.example.com/data')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error}</Text>;
  return <FlatList data={data} renderItem={...} />;
};
```

---

**Difficulty**: 🟡 Medium
**Estimated Time**: 12-15 minutes

---

*This problem is part of the React Native Interview Problems Collection*
