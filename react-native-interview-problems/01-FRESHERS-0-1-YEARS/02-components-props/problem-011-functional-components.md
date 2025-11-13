# Problem #011: Functional Components in React Native

**Difficulty**: 🟢 Easy
**Category**: Components & Props
**Time**: 10-12 minutes

---

## 📝 Problem Statement

**Question 1**: What are functional components and how do you create them in React Native?

**Question 2**: Explain the benefits of functional components over class components.

**Question 3**: How do you use hooks in functional components for state and lifecycle management?

---

## 🎯 What Interviewers Look For

- Understanding of functional component syntax
- Knowledge of hooks (useState, useEffect)
- Awareness of modern React Native patterns
- Practical component creation skills

---

## ✅ Complete Answer

### Question 1: Functional Components Basics

```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Simple functional component
const Greeting = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, World!</Text>
    </View>
  );
};

// With props
const UserGreeting = ({ name, age }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, {name}!</Text>
      <Text style={styles.subtext}>Age: {age}</Text>
    </View>
  );
};

// With destructuring and default props
const Welcome = ({ title = 'Welcome', subtitle }) => {
  return (
    <View>
      <Text>{title}</Text>
      {subtitle && <Text>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtext: {
    fontSize: 14,
    color: '#666',
  },
});

export default Greeting;
```

---

### Question 2: Benefits Over Class Components

#### **Functional vs Class Comparison**

**Class Component (Old Way):**
```jsx
import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  componentDidMount() {
    console.log('Mounted');
  }

  componentDidUpdate() {
    console.log('Updated');
  }

  componentWillUnmount() {
    console.log('Unmounted');
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <View>
        <Text>Count: {this.state.count}</Text>
        <TouchableOpacity onPress={this.increment}>
          <Text>Increment</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
```

**Functional Component (Modern Way):**
```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const Counter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Mounted or Updated');
    return () => console.log('Cleanup');
  }, []);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <View>
      <Text>Count: {count}</Text>
      <TouchableOpacity onPress={increment}>
        <Text>Increment</Text>
      </TouchableOpacity>
    </View>
  );
};
```

#### **Benefits:**

1. ✅ **Less Code**: No `constructor`, `this`, or `render()` method
2. ✅ **Easier to Read**: Clear, straightforward logic
3. ✅ **Better Performance**: Lighter than class components
4. ✅ **Hooks**: Access to powerful React hooks
5. ✅ **No `this` Confusion**: No binding issues
6. ✅ **Easier Testing**: Pure functions easier to test
7. ✅ **Code Reuse**: Custom hooks for shared logic

---

### Question 3: Using Hooks

```jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const UserProfile = ({ userId }) => {
  // State hooks
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');

  // Effect hook - component mount & userId changes
  useEffect(() => {
    fetchUser();
  }, [userId]);

  // Effect hook - update name when user loads
  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  // Callback hook - memoized function
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.example.com/users/${userId}`);
      const data = await response.json();
      setUser(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Callback hook - memoized save function
  const handleSave = useCallback(async () => {
    try {
      await fetch(`https://api.example.com/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ name }),
      });
      setUser({ ...user, name });
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  }, [userId, name, user]);

  // Memo hook - computed value
  const displayName = useMemo(() => {
    return user ? user.name.toUpperCase() : '';
  }, [user]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity onPress={fetchUser} style={styles.button}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{displayName}</Text>

      {editMode ? (
        <View>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={handleSave} style={styles.button}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setEditMode(false)}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setEditMode(true)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default UserProfile;
```

---

## 💡 Common Hooks Summary

```jsx
// 1. useState - State management
const [state, setState] = useState(initialValue);

// 2. useEffect - Side effects & lifecycle
useEffect(() => {
  // Effect logic
  return () => {
    // Cleanup
  };
}, [dependencies]);

// 3. useCallback - Memoized functions
const memoizedFn = useCallback(() => {
  // Function logic
}, [dependencies]);

// 4. useMemo - Memoized values
const memoizedValue = useMemo(() => {
  return expensiveCalculation();
}, [dependencies]);

// 5. useRef - Refs and persistent values
const ref = useRef(initialValue);

// 6. useContext - Context consumption
const value = useContext(MyContext);
```

---

## 🎯 Complete Example

```jsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

// Reusable child component
const TodoItem = ({ item, onDelete, onToggle }) => (
  <View style={styles.todoItem}>
    <TouchableOpacity
      onPress={() => onToggle(item.id)}
      style={styles.todoContent}
    >
      <Text style={[
        styles.todoText,
        item.completed && styles.todoTextCompleted,
      ]}>
        {item.text}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onDelete(item.id)}>
      <Text style={styles.deleteButton}>Delete</Text>
    </TouchableOpacity>
  </View>
);

// Main functional component
const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([
        ...todos,
        { id: Date.now().toString(), text: input, completed: false },
      ]);
      setInput('');
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Todo App</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Enter todo..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TodoItem
            item={item}
            onDelete={deleteTodo}
            onToggle={toggleTodo}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No todos yet!</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  todoItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  todoContent: {
    flex: 1,
  },
  todoText: {
    fontSize: 16,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  deleteButton: {
    color: '#ff3b30',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
    fontSize: 16,
  },
});

export default TodoApp;
```

---

## 🚀 Follow-up Questions

**Q1**: Can you use hooks in class components?
**A**: No, hooks only work in functional components. This is one reason to prefer functional components.

**Q2**: What is the rules of hooks?
**A**: 1) Only call hooks at the top level (not in loops/conditions), 2) Only call hooks in functional components or custom hooks.

**Q3**: How do you share logic between components?
**A**: Create custom hooks that encapsulate reusable logic.

**Q4**: Are functional components faster than class components?
**A**: Yes, slightly. They have less overhead and no instance creation.

---

## ✅ Common Mistakes

❌ **Mistake 1**: Calling hooks conditionally
```jsx
// ❌ Wrong
if (condition) {
  const [state, setState] = useState(0);
}

// ✅ Correct
const [state, setState] = useState(0);
if (condition) {
  // Use state here
}
```

❌ **Mistake 2**: Forgetting dependencies in useEffect
```jsx
// ❌ Wrong - infinite loop
useEffect(() => {
  setCount(count + 1);
});

// ✅ Correct
useEffect(() => {
  setCount(count + 1);
}, []); // Empty array = run once
```

❌ **Mistake 3**: Modifying state directly
```jsx
// ❌ Wrong
user.name = 'New Name';

// ✅ Correct
setUser({ ...user, name: 'New Name' });
```

---

**Difficulty**: 🟢 Easy
**Estimated Time**: 10-12 minutes
**Next Problem**: [#012: Props Passing →](./problem-012-props-passing.md)

---

*This problem is part of the React Native Interview Problems Collection*
