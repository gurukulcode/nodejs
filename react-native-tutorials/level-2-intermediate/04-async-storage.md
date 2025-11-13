# Lesson 4: Local Data Persistence with AsyncStorage

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Store and retrieve data locally with AsyncStorage
- Implement data persistence patterns
- Handle complex data structures
- Build offline-capable applications
- Understand storage best practices

---

## What is AsyncStorage?

AsyncStorage is React Native's persistent, key-value storage system:
- **Async**: All operations are asynchronous
- **Key-Value**: Store data as string key-value pairs
- **Persistent**: Data survives app restarts
- **Simple**: Easy-to-use API
- **Cross-platform**: Works on iOS and Android

---

## Installation

```bash
npm install @react-native-async-storage/async-storage

# For Expo
npx expo install @react-native-async-storage/async-storage
```

---

## Basic Operations

### Storing Data

```jsx
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store simple value
const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log('Data saved successfully');
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

// Usage
await storeData('username', 'john_doe');
await storeData('userEmail', 'john@example.com');
```

### Retrieving Data

```jsx
const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};

// Usage
const username = await getData('username');
console.log('Username:', username);
```

### Removing Data

```jsx
const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log('Data removed successfully');
  } catch (error) {
    console.error('Error removing data:', error);
  }
};

// Usage
await removeData('username');
```

### Clear All Data

```jsx
const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    console.log('All data cleared');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};
```

---

## Storing Objects and Arrays

AsyncStorage only stores strings, so we need to serialize objects:

```jsx
// Store object
const storeObject = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error storing object:', error);
  }
};

// Retrieve object
const getObject = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving object:', error);
    return null;
  }
};

// Usage
const user = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  preferences: {
    theme: 'dark',
    notifications: true,
  },
};

await storeObject('user', user);
const retrievedUser = await getObject('user');
console.log(retrievedUser.name); // 'John Doe'
```

---

## Complete Storage Helper

Create a reusable storage utility:

```jsx
// utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  // Store string
  setItem: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
      return false;
    }
  },

  // Get string
  getItem: async (key) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      return null;
    }
  },

  // Store object/array
  setObject: async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error(`Error storing object ${key}:`, error);
      return false;
    }
  },

  // Get object/array
  getObject: async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error retrieving object ${key}:`, error);
      return null;
    }
  },

  // Remove item
  removeItem: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      return false;
    }
  },

  // Clear all
  clear: async () => {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  },

  // Get all keys
  getAllKeys: async () => {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  },

  // Get multiple items
  getMultiple: async (keys) => {
    try {
      const items = await AsyncStorage.multiGet(keys);
      return items.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    } catch (error) {
      console.error('Error getting multiple items:', error);
      return {};
    }
  },
};
```

---

## User Preferences Example

```jsx
import { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { storage } from './utils/storage';

const PREFERENCES_KEY = 'userPreferences';

export default function SettingsScreen() {
  const [preferences, setPreferences] = useState({
    darkMode: false,
    notifications: true,
    autoSave: true,
    fontSize: 'medium',
  });

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  // Save preferences whenever they change
  useEffect(() => {
    savePreferences();
  }, [preferences]);

  const loadPreferences = async () => {
    const saved = await storage.getObject(PREFERENCES_KEY);
    if (saved) {
      setPreferences(saved);
    }
  };

  const savePreferences = async () => {
    await storage.setObject(PREFERENCES_KEY, preferences);
  };

  const updatePreference = (key, value) => {
    setPreferences({
      ...preferences,
      [key]: value,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.setting}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch
          value={preferences.darkMode}
          onValueChange={(value) => updatePreference('darkMode', value)}
        />
      </View>

      <View style={styles.setting}>
        <Text style={styles.label}>Notifications</Text>
        <Switch
          value={preferences.notifications}
          onValueChange={(value) => updatePreference('notifications', value)}
        />
      </View>

      <View style={styles.setting}>
        <Text style={styles.label}>Auto Save</Text>
        <Switch
          value={preferences.autoSave}
          onValueChange={(value) => updatePreference('autoSave', value)}
        />
      </View>

      <View style={styles.fontSizes}>
        <Text style={styles.label}>Font Size</Text>
        {['small', 'medium', 'large'].map(size => (
          <TouchableOpacity
            key={size}
            style={[
              styles.fontButton,
              preferences.fontSize === size && styles.selectedFont,
            ]}
            onPress={() => updatePreference('fontSize', size)}
          >
            <Text>{size}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
  },
  fontSizes: {
    paddingVertical: 15,
  },
  fontButton: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedFont: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
});
```

---

## Todo App with Persistence

```jsx
import { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { storage } from './utils/storage';

const TODOS_KEY = 'todos';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');

  // Load todos on mount
  useEffect(() => {
    loadTodos();
  }, []);

  // Save todos whenever they change
  useEffect(() => {
    if (todos.length > 0 || todos.length === 0) {
      saveTodos();
    }
  }, [todos]);

  const loadTodos = async () => {
    const saved = await storage.getObject(TODOS_KEY);
    if (saved && Array.isArray(saved)) {
      setTodos(saved);
    }
  };

  const saveTodos = async () => {
    await storage.setObject(TODOS_KEY, todos);
  };

  const addTodo = () => {
    if (inputText.trim()) {
      const newTodo = {
        id: Date.now().toString(),
        text: inputText.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTodos([...todos, newTodo]);
      setInputText('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const renderTodo = ({ item }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity
        style={styles.todoContent}
        onPress={() => toggleTodo(item.id)}
      >
        <View
          style={[styles.checkbox, item.completed && styles.checkboxChecked]}
        >
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text
          style={[styles.todoText, item.completed && styles.todoTextCompleted]}
        >
          {item.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteTodo(item.id)}>
        <Text style={styles.deleteButton}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Todos</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Add a new todo..."
          onSubmitEditing={addTodo}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        renderItem={renderTodo}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No todos yet. Add one above!</Text>
        }
      />

      {todos.some(todo => todo.completed) && (
        <TouchableOpacity style={styles.clearButton} onPress={clearCompleted}>
          <Text style={styles.clearButtonText}>Clear Completed</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    padding: 20,
    backgroundColor: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    width: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 8,
  },
  todoContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 12,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  todoText: {
    fontSize: 16,
    flex: 1,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  deleteButton: {
    fontSize: 24,
    color: '#ff3b30',
    padding: 5,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 50,
  },
  clearButton: {
    backgroundColor: '#ff3b30',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

---

## Auth Token Storage

```jsx
// services/authStorage.js
import { storage } from '../utils/storage';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const authStorage = {
  // Save auth data
  saveAuth: async (token, user) => {
    try {
      await storage.setItem(TOKEN_KEY, token);
      await storage.setObject(USER_KEY, user);
      return true;
    } catch (error) {
      console.error('Error saving auth data:', error);
      return false;
    }
  },

  // Get auth data
  getAuth: async () => {
    try {
      const token = await storage.getItem(TOKEN_KEY);
      const user = await storage.getObject(USER_KEY);
      return { token, user };
    } catch (error) {
      console.error('Error getting auth data:', error);
      return { token: null, user: null };
    }
  },

  // Clear auth data
  clearAuth: async () => {
    try {
      await storage.removeItem(TOKEN_KEY);
      await storage.removeItem(USER_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing auth data:', error);
      return false;
    }
  },

  // Check if authenticated
  isAuthenticated: async () => {
    const token = await storage.getItem(TOKEN_KEY);
    return !!token;
  },
};

// Usage in AuthContext
import { authStorage } from './services/authStorage';

const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    const { token, user } = response.data;

    // Save to storage
    await authStorage.saveAuth(token, user);

    // Update state
    setUser(user);
    setToken(token);
  } catch (error) {
    console.error('Login error:', error);
  }
};

const logout = async () => {
  await authStorage.clearAuth();
  setUser(null);
  setToken(null);
};
```

---

## Cache Management

```jsx
// utils/cache.js
import { storage } from './storage';

export class CacheManager {
  constructor(namespace = 'cache') {
    this.namespace = namespace;
  }

  getCacheKey(key) {
    return `${this.namespace}_${key}`;
  }

  async set(key, value, expiryMinutes = 60) {
    const cacheKey = this.getCacheKey(key);
    const cacheData = {
      value,
      expiry: Date.now() + expiryMinutes * 60 * 1000,
    };
    await storage.setObject(cacheKey, cacheData);
  }

  async get(key) {
    const cacheKey = this.getCacheKey(key);
    const cacheData = await storage.getObject(cacheKey);

    if (!cacheData) {
      return null;
    }

    // Check if expired
    if (Date.now() > cacheData.expiry) {
      await this.remove(key);
      return null;
    }

    return cacheData.value;
  }

  async remove(key) {
    const cacheKey = this.getCacheKey(key);
    await storage.removeItem(cacheKey);
  }

  async clearAll() {
    const allKeys = await storage.getAllKeys();
    const cacheKeys = allKeys.filter(key => key.startsWith(this.namespace));

    await Promise.all(
      cacheKeys.map(key => storage.removeItem(key))
    );
  }
}

// Usage
const cache = new CacheManager('api');

// Store API response
await cache.set('users', usersData, 30); // Cache for 30 minutes

// Retrieve from cache
const cachedUsers = await cache.get('users');
if (cachedUsers) {
  setUsers(cachedUsers);
} else {
  // Fetch fresh data
  const freshData = await api.getUsers();
  await cache.set('users', freshData, 30);
  setUsers(freshData);
}
```

---

## Storage Best Practices

### 1. Use Keys Consistently

```jsx
// Good: Define constants
const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'auth_token',
  SETTINGS: 'user_settings',
  TODOS: 'todos',
};

// Use constants
await storage.setObject(STORAGE_KEYS.USER, userData);
```

### 2. Handle Errors Gracefully

```jsx
const loadData = async () => {
  try {
    const data = await storage.getObject('myData');
    if (data) {
      setData(data);
    } else {
      setData(defaultData);
    }
  } catch (error) {
    console.error('Error loading data:', error);
    setData(defaultData);
  }
};
```

### 3. Don't Store Sensitive Data Unencrypted

For sensitive data, use encrypted storage libraries:
- `react-native-encrypted-storage`
- `expo-secure-store` (for Expo)

```jsx
import * as SecureStore from 'expo-secure-store';

// Store sensitive data
await SecureStore.setItemAsync('password', userPassword);

// Retrieve sensitive data
const password = await SecureStore.getItemAsync('password');
```

---

## 🎯 Practice Exercises

### Exercise 1: Shopping Cart Persistence
Create a shopping cart that:
- Persists items to AsyncStorage
- Loads cart on app start
- Updates storage when items change
- Calculates and displays total

### Exercise 2: Note-Taking App
Build a notes app with:
- Create, edit, delete notes
- Store notes with timestamps
- Search notes
- Category/tag system
- Everything persisted locally

### Exercise 3: User Profile Manager
Create a profile system:
- Store user profile data
- Upload and save profile picture (as base64)
- Edit profile fields
- Settings persistence
- Clear all data option

---

## 💡 Key Takeaways

✅ AsyncStorage is key-value persistent storage
✅ All operations are asynchronous
✅ Store objects/arrays as JSON strings
✅ Create helper utilities for cleaner code
✅ Use constants for storage keys
✅ Handle errors gracefully
✅ Don't store sensitive data unencrypted
✅ Consider cache expiry for API data
✅ Clear old/unused data periodically

---

## 🔗 What's Next?

In the next lesson, we'll learn about:
- Animations with Animated API
- LayoutAnimation
- Creating smooth transitions
- Interactive gestures

[Next Lesson: Animations →](./05-animations.md)

---

## 📚 Additional Resources

- [AsyncStorage Documentation](https://react-native-async-storage.github.io/async-storage/)
- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [Data Persistence Patterns](https://reactnative.dev/docs/asyncstorage)
- [Storage Limits](https://react-native-async-storage.github.io/async-storage/docs/limits/)

---

*Happy coding! 🚀*
