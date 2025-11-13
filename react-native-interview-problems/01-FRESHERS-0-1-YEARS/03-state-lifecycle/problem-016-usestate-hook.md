# Problem #016: useState Hook

**Difficulty**: 🟢 Easy
**Category**: State & Lifecycle
**Time**: 10-12 minutes

---

## 📝 Problem Statement

**Question 1**: What is useState and how do you use it for state management?
**Question 2**: How do you update state with useState (primitive vs object/array)?
**Question 3**: What are common useState patterns and best practices?

---

## ✅ Complete Answer

### Question 1: useState Basics

```jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Counter = () => {
  // Declare state variable
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.count}>{count}</Text>
      <TouchableOpacity onPress={() => setCount(count + 1)}>
        <Text>Increment</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### Question 2: Updating Different State Types

```jsx
// Primitives
const [count, setCount] = useState(0);
setCount(count + 1);
setCount(prev => prev + 1);  // Functional update

// Objects
const [user, setUser] = useState({ name: 'John', age: 30 });
setUser({ ...user, age: 31 });  // Spread to merge

// Arrays
const [items, setItems] = useState([]);
setItems([...items, newItem]);  // Add
setItems(items.filter(item => item.id !== id));  // Remove
```

### Question 3: Best Practices

```jsx
// ✅ Multiple state variables
const [name, setName] = useState('');
const [email, setEmail] = useState('');

// ✅ Functional updates for dependencies
setCount(prev => prev + 1);

// ❌ Avoid mutating state directly
user.name = 'New Name';  // Wrong!
setUser({ ...user, name: 'New Name' });  // Correct
```

---

**Difficulty**: 🟢 Easy
**Estimated Time**: 10-12 minutes

---

*This problem is part of the React Native Interview Problems Collection*
