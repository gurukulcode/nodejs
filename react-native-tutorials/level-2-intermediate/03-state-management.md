# Lesson 3: State Management with Context API & useReducer

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Understand the Context API for global state
- Use useReducer for complex state logic
- Avoid prop drilling with Context
- Implement common state management patterns
- Build scalable state architecture

---

## The Problem: Prop Drilling

Passing props through multiple levels is cumbersome:

```jsx
// BAD: Prop drilling through multiple components
function App() {
  const [user, setUser] = useState(null);

  return <Dashboard user={user} setUser={setUser} />;
}

function Dashboard({ user, setUser }) {
  return <Sidebar user={user} setUser={setUser} />;
}

function Sidebar({ user, setUser }) {
  return <UserProfile user={user} setUser={setUser} />;
}

function UserProfile({ user, setUser }) {
  return <Text>{user.name}</Text>;
}
```

**Solution**: Context API!

---

## Context API Basics

### Creating a Context

```jsx
import { createContext, useState, useContext } from 'react';

// Create Context
const UserContext = createContext();

// Create Provider Component
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Create custom hook for easy access
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
```

### Using Context

```jsx
// App.js - Wrap with Provider
import { UserProvider } from './contexts/UserContext';

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

// Any component can now access user context
import { useUser } from './contexts/UserContext';

function ProfileScreen() {
  const { user, logout } = useUser();

  if (!user) {
    return <Text>Please login</Text>;
  }

  return (
    <View>
      <Text>Welcome, {user.name}!</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
```

---

## useReducer Hook

For complex state logic with multiple actions:

### Basic useReducer

```jsx
import { useReducer } from 'react';

// Define initial state
const initialState = {
  count: 0,
};

// Define reducer function
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    case 'set':
      return { count: action.payload };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

// Use in component
export default function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <View style={styles.container}>
      <Text style={styles.count}>Count: {state.count}</Text>
      <Button
        title="Increment"
        onPress={() => dispatch({ type: 'increment' })}
      />
      <Button
        title="Decrement"
        onPress={() => dispatch({ type: 'decrement' })}
      />
      <Button
        title="Reset"
        onPress={() => dispatch({ type: 'reset' })}
      />
      <Button
        title="Set to 100"
        onPress={() => dispatch({ type: 'set', payload: 100 })}
      />
    </View>
  );
}
```

---

## Context + useReducer Pattern

Combining both for powerful state management:

```jsx
// contexts/TodoContext.js
import { createContext, useContext, useReducer } from 'react';

const TodoContext = createContext();

// Initial State
const initialState = {
  todos: [],
  filter: 'all', // 'all', 'active', 'completed'
};

// Reducer
function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: action.payload,
            completed: false,
          },
        ],
      };

    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };

    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };

    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload,
      };

    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed),
      };

    default:
      return state;
  }
}

// Provider Component
export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const addTodo = (text) => {
    dispatch({ type: 'ADD_TODO', payload: text });
  };

  const toggleTodo = (id) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  };

  const deleteTodo = (id) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  };

  const setFilter = (filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const clearCompleted = () => {
    dispatch({ type: 'CLEAR_COMPLETED' });
  };

  // Computed values
  const filteredTodos = state.todos.filter(todo => {
    if (state.filter === 'active') return !todo.completed;
    if (state.filter === 'completed') return todo.completed;
    return true;
  });

  const value = {
    todos: state.todos,
    filteredTodos,
    filter: state.filter,
    addTodo,
    toggleTodo,
    deleteTodo,
    setFilter,
    clearCompleted,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
}

// Custom hook
export function useTodos() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within TodoProvider');
  }
  return context;
}
```

### Using the Todo Context

```jsx
// App.js
import { TodoProvider } from './contexts/TodoContext';

export default function App() {
  return (
    <TodoProvider>
      <SafeAreaView style={styles.container}>
        <TodoApp />
      </SafeAreaView>
    </TodoProvider>
  );
}

// TodoApp.js
import { useState } from 'react';
import { useTodos } from './contexts/TodoContext';

function TodoApp() {
  const [inputText, setInputText] = useState('');
  const {
    filteredTodos,
    filter,
    addTodo,
    toggleTodo,
    deleteTodo,
    setFilter,
    clearCompleted,
  } = useTodos();

  const handleAdd = () => {
    if (inputText.trim()) {
      addTodo(inputText);
      setInputText('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Todos</Text>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Add a todo..."
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'active' && styles.activeFilter]}
          onPress={() => setFilter('active')}
        >
          <Text>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'completed' && styles.activeFilter]}
          onPress={() => setFilter('completed')}
        >
          <Text>Completed</Text>
        </TouchableOpacity>
      </View>

      {/* Todo List */}
      <FlatList
        data={filteredTodos}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <TouchableOpacity
              style={styles.todoText}
              onPress={() => toggleTodo(item.id)}
            >
              <Text
                style={[
                  styles.todoTextContent,
                  item.completed && styles.completedText,
                ]}
              >
                {item.text}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTodo(item.id)}>
              <Text style={styles.deleteButton}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Clear completed */}
      <TouchableOpacity style={styles.clearButton} onPress={clearCompleted}>
        <Text>Clear Completed</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## Authentication Context Example

```jsx
// contexts/AuthContext.js
import { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  loading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };

    case 'LOGIN_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        error: null,
      };

    case 'RESTORE_TOKEN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore token on app start
  useEffect(() => {
    const restoreToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const user = await AsyncStorage.getItem('user');

        if (token && user) {
          dispatch({
            type: 'RESTORE_TOKEN',
            payload: {
              token,
              user: JSON.parse(user),
            },
          });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    restoreToken();
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // API call
      const response = await fetch('https://api.example.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save to AsyncStorage
      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: data.user,
          token: data.token,
        },
      });
    } catch (error) {
      dispatch({
        type: 'LOGIN_ERROR',
        payload: error.message,
      });
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const value = {
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    isAuthenticated: !!state.token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### Using Auth Context

```jsx
import { useAuth } from './contexts/AuthContext';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    await login(email, password);
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button
        title="Login"
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
}

function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <View>
      <Text>Welcome, {user.name}!</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

// In App.js - conditional rendering based on auth
function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
```

---

## Multiple Contexts Pattern

```jsx
// App.js
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { TodoProvider } from './contexts/TodoContext';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TodoProvider>
          <NavigationContainer>
            {/* Your app */}
          </NavigationContainer>
        </TodoProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
```

---

## Theme Context Example

```jsx
// contexts/ThemeContext.js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  const theme = {
    colors: {
      background: isDark ? '#000' : '#fff',
      text: isDark ? '#fff' : '#000',
      primary: '#007AFF',
      card: isDark ? '#1c1c1e' : '#fff',
      border: isDark ? '#38383a' : '#e5e5ea',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Usage
function MyComponent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>Hello</Text>
      <Switch value={isDark} onValueChange={toggleTheme} />
    </View>
  );
}
```

---

## 🎯 Practice Exercises

### Exercise 1: Shopping Cart Context
Create a shopping cart system with:
- Add/remove items from cart
- Update quantities
- Calculate total price
- Clear cart
- Persist cart to AsyncStorage

### Exercise 2: Settings Context
Build an app settings manager:
- Theme (light/dark)
- Language preference
- Notification settings
- Save to AsyncStorage
- Restore on app launch

### Exercise 3: Multi-user Chat Context
Create a chat state manager:
- Active conversations list
- Messages for each conversation
- Send message action
- Mark as read action
- Delete conversation action
- Use useReducer for complex state

---

## 💡 Key Takeaways

✅ Context API solves prop drilling
✅ useReducer for complex state logic
✅ Combine Context + useReducer for power
✅ Create custom hooks for cleaner access
✅ Multiple contexts for separation of concerns
✅ Always check if context exists
✅ Use computed values for derived state
✅ Persist important state to AsyncStorage

---

## 🔗 What's Next?

In the next lesson, we'll learn about:
- AsyncStorage for data persistence
- Storing and retrieving data locally
- Data encryption
- Storage best practices

[Next Lesson: AsyncStorage →](./04-async-storage.md)

---

## 📚 Additional Resources

- [Context API Documentation](https://react.dev/reference/react/useContext)
- [useReducer Documentation](https://react.dev/reference/react/useReducer)
- [State Management Patterns](https://kentcdodds.com/blog/application-state-management-with-react)
- [Context Best Practices](https://kentcdodds.com/blog/how-to-use-react-context-effectively)

---

*Happy coding! 🚀*
