# Problem #017: useEffect Basics

**Difficulty**: 🟢 Easy
**Category**: State & Lifecycle
**Time**: 10-12 minutes

---

## 📝 Problem Statement

**Question 1**: What is useEffect and when do you use it?
**Question 2**: How do dependency arrays work in useEffect?
**Question 3**: How do you implement cleanup in useEffect?

---

## ✅ Complete Answer

### Question 1: useEffect Purpose

```jsx
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Side effect: Fetch data
    fetch(`https://api.example.com/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);  // Run when userId changes

  return <Text>{user?.name}</Text>;
};
```

### Question 2: Dependency Arrays

```jsx
// Run once on mount (empty array)
useEffect(() => {
  console.log('Mounted');
}, []);

// Run when dependencies change
useEffect(() => {
  console.log('userId changed:', userId);
}, [userId]);

// Run on every render (no array - avoid!)
useEffect(() => {
  console.log('Every render');
});
```

### Question 3: Cleanup

```jsx
useEffect(() => {
  const subscription = API.subscribe(data => {
    console.log(data);
  });

  // Cleanup function
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

---

**Difficulty**: 🟢 Easy
**Estimated Time**: 10-12 minutes

---

*This problem is part of the React Native Interview Problems Collection*
