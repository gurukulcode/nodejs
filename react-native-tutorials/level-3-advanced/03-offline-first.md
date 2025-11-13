# Lesson 3: Offline-First Architecture

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Build offline-capable applications
- Detect network connectivity changes
- Implement offline queue management
- Synchronize data between local and server
- Handle conflict resolution

---

## Why Offline-First?

Benefits of offline-first apps:
- ✅ Works without internet
- ✅ Better user experience
- ✅ Faster perceived performance
- ✅ Resilient to poor connectivity
- ✅ Reduced server load

---

## Network Detection

### Using NetInfo

```bash
npm install @react-native-community/netinfo
```

```jsx
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export default function NetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
    });

    // Get initial state
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.status}>
        Status: {isConnected ? 'Online' : 'Offline'}
      </Text>
      <Text>Connection Type: {connectionType}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  status: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
```

---

## Network Status Hook

Create a reusable hook:

```jsx
// hooks/useNetworkStatus.js
import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
      setConnectionType(state.type);
    });

    return () => unsubscribe();
  }, []);

  return { isConnected, connectionType };
}

// Usage
function MyComponent() {
  const { isConnected } = useNetworkStatus();

  if (!isConnected) {
    return <OfflineBanner />;
  }

  return <OnlineContent />;
}
```

---

## Offline Banner Component

```jsx
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useNetworkStatus } from './hooks/useNetworkStatus';

export default function OfflineBanner() {
  const { isConnected } = useNetworkStatus();
  const [slideAnim] = useState(new Animated.Value(-50));

  useEffect(() => {
    if (!isConnected) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isConnected]);

  return (
    <Animated.View
      style={[
        styles.banner,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.text}>No Internet Connection</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ff3b30',
    padding: 10,
    alignItems: 'center',
    zIndex: 1000,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});
```

---

## Offline Queue Manager

```jsx
// utils/offlineQueue.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_KEY = 'offline_queue';

export class OfflineQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  async init() {
    const stored = await AsyncStorage.getItem(QUEUE_KEY);
    this.queue = stored ? JSON.parse(stored) : [];
  }

  async add(action) {
    const item = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      ...action,
    };

    this.queue.push(item);
    await this.save();
    return item.id;
  }

  async remove(id) {
    this.queue = this.queue.filter(item => item.id !== id);
    await this.save();
  }

  async save() {
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(this.queue));
  }

  async process(processFunc) {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const item = this.queue[0];

      try {
        await processFunc(item);
        await this.remove(item.id);
      } catch (error) {
        console.error('Failed to process queue item:', error);
        break; // Stop processing on error
      }
    }

    this.processing = false;
  }

  getQueue() {
    return this.queue;
  }

  async clear() {
    this.queue = [];
    await this.save();
  }
}
```

---

## Offline-First Data Service

```jsx
// services/dataService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { OfflineQueue } from '../utils/offlineQueue';
import api from './api';

class DataService {
  constructor() {
    this.queue = new OfflineQueue();
    this.init();
  }

  async init() {
    await this.queue.init();

    // Listen for network changes
    NetInfo.addEventListener(state => {
      if (state.isConnected) {
        this.syncQueue();
      }
    });
  }

  async get(endpoint, cacheKey) {
    try {
      // Try to fetch from server
      const response = await api.get(endpoint);
      const data = response.data;

      // Cache the data
      if (cacheKey) {
        await AsyncStorage.setItem(
          cacheKey,
          JSON.stringify({
            data,
            timestamp: Date.now(),
          })
        );
      }

      return data;
    } catch (error) {
      // If offline, return cached data
      if (cacheKey) {
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
          const { data } = JSON.parse(cached);
          return data;
        }
      }
      throw error;
    }
  }

  async post(endpoint, data, options = {}) {
    const netInfo = await NetInfo.fetch();

    if (netInfo.isConnected && !options.forceQueue) {
      // Online: send immediately
      try {
        const response = await api.post(endpoint, data);
        return response.data;
      } catch (error) {
        // If failed, queue it
        await this.queueAction('POST', endpoint, data);
        throw error;
      }
    } else {
      // Offline: queue for later
      await this.queueAction('POST', endpoint, data);
      return { queued: true };
    }
  }

  async queueAction(method, endpoint, data) {
    await this.queue.add({
      method,
      endpoint,
      data,
    });
  }

  async syncQueue() {
    await this.queue.process(async (item) => {
      const { method, endpoint, data } = item;

      if (method === 'POST') {
        await api.post(endpoint, data);
      } else if (method === 'PUT') {
        await api.put(endpoint, data);
      } else if (method === 'DELETE') {
        await api.delete(endpoint);
      }
    });
  }

  getQueuedItems() {
    return this.queue.getQueue();
  }
}

export default new DataService();
```

---

## Complete Example: Offline Todo App

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
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import dataService from './services/dataService';

const LOCAL_TODOS_KEY = 'local_todos';

export default function OfflineTodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');
  const [syncing, setSyncing] = useState(false);
  const { isConnected } = useNetworkStatus();

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (isConnected) {
      syncTodos();
    }
  }, [isConnected]);

  const loadTodos = async () => {
    try {
      // Load from local storage
      const local = await AsyncStorage.getItem(LOCAL_TODOS_KEY);
      if (local) {
        setTodos(JSON.parse(local));
      }

      // Try to fetch from server
      if (isConnected) {
        const serverTodos = await dataService.get('/todos', LOCAL_TODOS_KEY);
        setTodos(serverTodos);
        await AsyncStorage.setItem(LOCAL_TODOS_KEY, JSON.stringify(serverTodos));
      }
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  };

  const saveTodosLocally = async (newTodos) => {
    await AsyncStorage.setItem(LOCAL_TODOS_KEY, JSON.stringify(newTodos));
  };

  const addTodo = async () => {
    if (!inputText.trim()) return;

    const newTodo = {
      id: Date.now().toString(),
      text: inputText.trim(),
      completed: false,
      synced: false,
      createdAt: new Date().toISOString(),
    };

    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
    setInputText('');
    await saveTodosLocally(newTodos);

    // Try to sync with server
    try {
      await dataService.post('/todos', newTodo);
      // Mark as synced
      const syncedTodos = newTodos.map(t =>
        t.id === newTodo.id ? { ...t, synced: true } : t
      );
      setTodos(syncedTodos);
      await saveTodosLocally(syncedTodos);
    } catch (error) {
      console.log('Will sync later');
    }
  };

  const toggleTodo = async (id) => {
    const newTodos = todos.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed, synced: false }
        : todo
    );
    setTodos(newTodos);
    await saveTodosLocally(newTodos);

    const todo = newTodos.find(t => t.id === id);
    try {
      await dataService.post(`/todos/${id}/toggle`, { completed: todo.completed });
      const syncedTodos = newTodos.map(t =>
        t.id === id ? { ...t, synced: true } : t
      );
      setTodos(syncedTodos);
      await saveTodosLocally(syncedTodos);
    } catch (error) {
      console.log('Will sync later');
    }
  };

  const deleteTodo = async (id) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);
    await saveTodosLocally(newTodos);

    try {
      await dataService.post(`/todos/${id}`, {}, { method: 'DELETE' });
    } catch (error) {
      console.log('Will sync later');
    }
  };

  const syncTodos = async () => {
    setSyncing(true);
    try {
      await dataService.syncQueue();
      await loadTodos(); // Reload from server
      Alert.alert('Success', 'Todos synced with server');
    } catch (error) {
      Alert.alert('Error', 'Failed to sync todos');
    } finally {
      setSyncing(false);
    }
  };

  const renderTodo = ({ item }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity
        style={styles.todoContent}
        onPress={() => toggleTodo(item.id)}
      >
        <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={[styles.todoText, item.completed && styles.todoTextCompleted]}>
          {item.text}
        </Text>
        {!item.synced && <Text style={styles.syncIndicator}>●</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteTodo(item.id)}>
        <Text style={styles.deleteButton}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  const unsyncedCount = todos.filter(t => !t.synced).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Offline Todos</Text>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isConnected ? '#34C759' : '#ff3b30' },
            ]}
          />
          <Text style={styles.statusText}>
            {isConnected ? 'Online' : 'Offline'}
          </Text>
          {unsyncedCount > 0 && (
            <Text style={styles.unsyncedText}>
              {unsyncedCount} unsynced
            </Text>
          )}
        </View>
      </View>

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

      {isConnected && unsyncedCount > 0 && (
        <TouchableOpacity
          style={styles.syncButton}
          onPress={syncTodos}
          disabled={syncing}
        >
          <Text style={styles.syncButtonText}>
            {syncing ? 'Syncing...' : 'Sync Now'}
          </Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={todos}
        renderItem={renderTodo}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No todos yet</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  unsyncedText: {
    fontSize: 12,
    color: '#ff9500',
    marginLeft: 10,
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
  syncButton: {
    backgroundColor: '#34C759',
    margin: 20,
    marginTop: 0,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  syncButtonText: {
    color: 'white',
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
  syncIndicator: {
    color: '#ff9500',
    fontSize: 8,
    marginLeft: 5,
  },
  deleteButton: {
    fontSize: 24,
    color: '#ff3b30',
    padding: 5,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
  },
});
```

---

## 🎯 Practice Exercises

### Exercise 1: Offline Notes App
Build a notes app with:
- Create, edit, delete notes offline
- Sync with server when online
- Conflict resolution (last-write-wins)
- Show sync status for each note

### Exercise 2: Offline Photo Gallery
Create a photo gallery:
- Take photos offline
- Queue uploads for when online
- Show upload progress
- Retry failed uploads

### Exercise 3: Offline Shopping Cart
Build a shopping cart that:
- Works completely offline
- Queues orders for submission
- Syncs inventory from server
- Handles out-of-stock conflicts

---

## 💡 Key Takeaways

✅ Always design for offline-first
✅ Use NetInfo for connectivity detection
✅ Cache data locally with AsyncStorage
✅ Implement queue for offline actions
✅ Sync when connection restored
✅ Show clear sync status to users
✅ Handle conflicts gracefully
✅ Test thoroughly in offline mode

---

## 🔗 What's Next?

In the next lesson, we'll learn about:
- Push notifications
- Firebase Cloud Messaging
- Local notifications
- Notification handling

[Next Lesson: Push Notifications →](./04-push-notifications.md)

---

## 📚 Additional Resources

- [NetInfo Documentation](https://github.com/react-native-netinfo/react-native-netinfo)
- [Offline First](https://offlinefirst.org/)
- [Redux Offline](https://github.com/redux-offline/redux-offline)
- [WatermelonDB](https://nozbe.github.io/WatermelonDB/) - Offline database

---

*Happy coding! 🚀*
