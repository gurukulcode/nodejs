# Problem #012: Props Passing and Component Communication

**Difficulty**: 🟢 Easy
**Category**: Components & Props
**Time**: 8-10 minutes

---

## 📝 Problem Statement

**Question 1**: How do you pass props from parent to child components?

**Question 2**: Explain prop drilling and how to pass data through multiple levels.

**Question 3**: How do you pass functions as props for child-to-parent communication?

---

## ✅ Complete Answer

### Question 1: Basic Props Passing

```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Child component receiving props
const UserCard = ({ name, age, email, isActive }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text>Age: {age}</Text>
      <Text>Email: {email}</Text>
      {isActive && <Text style={styles.badge}>Active</Text>}
    </View>
  );
};

// Parent component passing props
const App = () => {
  return (
    <View style={styles.container}>
      <UserCard
        name="John Doe"
        age={30}
        email="john@example.com"
        isActive={true}
      />
      <UserCard
        name="Jane Smith"
        age={25}
        email="jane@example.com"
        isActive={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  card: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8 },
  name: { fontSize: 18, fontWeight: 'bold' },
  badge: { color: 'green', fontWeight: '600' },
});
```

---

### Question 2: Prop Drilling

```jsx
// Grandparent
const App = () => {
  const user = { name: 'John', role: 'Admin' };

  return <Dashboard user={user} />;
};

// Parent
const Dashboard = ({ user }) => {
  return <Sidebar user={user} />;
};

// Child
const Sidebar = ({ user }) => {
  return <UserProfile user={user} />;
};

// Grandchild finally uses the prop
const UserProfile = ({ user }) => {
  return <Text>{user.name} - {user.role}</Text>;
};
```

---

### Question 3: Functions as Props

```jsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

// Child component with callback
const Button = ({ title, onPress, variant = 'primary' }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, variant === 'secondary' && styles.buttonSecondary]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

// Parent component handling callbacks
const Counter = () => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    setCount(count - 1);
  };

  const handleReset = () => {
    setCount(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.count}>{count}</Text>
      <Button title="Increment" onPress={handleIncrement} />
      <Button title="Decrement" onPress={handleDecrement} variant="secondary" />
      <Button title="Reset" onPress={handleReset} variant="secondary" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  count: { fontSize: 48, textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, marginBottom: 10 },
  buttonSecondary: { backgroundColor: '#666' },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
```

---

**Difficulty**: 🟢 Easy
**Estimated Time**: 8-10 minutes

---

*This problem is part of the React Native Interview Problems Collection*
