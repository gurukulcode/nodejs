# Lesson 6: TypeScript with React Native

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Set up TypeScript in React Native
- Type components and props correctly
- Use TypeScript with hooks
- Type navigation and routes
- Apply TypeScript best practices

---

## Why TypeScript?

Benefits:
- ✅ Catch errors at compile time
- ✅ Better IDE autocomplete
- ✅ Self-documenting code
- ✅ Easier refactoring
- ✅ Better team collaboration

---

## Setup TypeScript

### New Project with TypeScript

```bash
# Expo
npx create-expo-app MyApp --template expo-template-blank-typescript

# React Native CLI
npx react-native init MyApp --template react-native-template-typescript
```

### Add to Existing Project

```bash
npm install --save-dev typescript @types/react @types/react-native

# Generate tsconfig.json
npx tsc --init
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "lib": ["es2017"],
    "jsx": "react-native",
    "strict": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "exclude": [
    "node_modules",
    "babel.config.js",
    "metro.config.js",
    "jest.config.js"
  ]
}
```

---

## Basic Types

```typescript
// Primitives
const name: string = 'John';
const age: number = 30;
const isActive: boolean = true;

// Arrays
const numbers: number[] = [1, 2, 3];
const names: Array<string> = ['John', 'Jane'];

// Objects
const user: {
  name: string;
  age: number;
  email?: string; // Optional property
} = {
  name: 'John',
  age: 30,
};

// Functions
const greet = (name: string): string => {
  return `Hello, ${name}`;
};

// Union Types
let id: string | number = 1;
id = 'abc'; // Also valid

// Type Alias
type User = {
  id: number;
  name: string;
  email: string;
};

const user: User = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
};

// Interface
interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
}

const product: Product = {
  id: 1,
  name: 'Laptop',
  price: 999,
};
```

---

## Typing Components

### Function Components with Props

```typescript
import { View, Text, StyleSheet } from 'react-native';

// Props interface
interface GreetingProps {
  name: string;
  age?: number;
  onPress?: () => void;
}

// Function component
const Greeting: React.FC<GreetingProps> = ({ name, age, onPress }) => {
  return (
    <View style={styles.container}>
      <Text>Hello, {name}!</Text>
      {age && <Text>Age: {age}</Text>}
    </View>
  );
};

// Alternative syntax (recommended)
function Greeting({ name, age, onPress }: GreetingProps) {
  return (
    <View style={styles.container}>
      <Text>Hello, {name}!</Text>
      {age && <Text>Age: {age}</Text>}
    </View>
  );
}
```

### Props with Children

```typescript
interface CardProps {
  title: string;
  children: React.ReactNode;
}

function Card({ title, children }: CardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}
```

---

## Typing Hooks

### useState

```typescript
import { useState } from 'react';

// Type inference
const [count, setCount] = useState(0); // inferred as number

// Explicit type
const [user, setUser] = useState<User | null>(null);

// With initial value
const [users, setUsers] = useState<User[]>([]);

// Complex state
interface FormState {
  email: string;
  password: string;
  rememberMe: boolean;
}

const [formData, setFormData] = useState<FormState>({
  email: '',
  password: '',
  rememberMe: false,
});
```

### useRef

```typescript
import { useRef } from 'react';
import { TextInput } from 'react-native';

// Ref to component
const inputRef = useRef<TextInput>(null);

// Ref to value
const countRef = useRef<number>(0);

// Usage
inputRef.current?.focus();
countRef.current = 10;
```

### useEffect

```typescript
import { useEffect } from 'react';

useEffect(() => {
  // Effect code

  // Cleanup function (optional)
  return () => {
    // Cleanup code
  };
}, []); // Dependencies
```

### Custom Hooks

```typescript
import { useState, useEffect } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// Usage
interface User {
  id: number;
  name: string;
}

const { data, loading, error } = useFetch<User>('/api/user');
```

---

## Typing Events

```typescript
import { View, TextInput, TouchableOpacity } from 'react-native';
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';

function MyComponent() {
  // Text input change
  const handleChange = (text: string) => {
    console.log(text);
  };

  // Press event
  const handlePress = () => {
    console.log('Pressed');
  };

  // Change event (full event object)
  const handleChangeEvent = (
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    console.log(e.nativeEvent.text);
  };

  return (
    <View>
      <TextInput
        onChangeText={handleChange}
        onChange={handleChangeEvent}
      />
      <TouchableOpacity onPress={handlePress}>
        <Text>Press me</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## Typing Navigation

```typescript
// types/navigation.ts
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Define your route params
export type RootStackParamList = {
  Home: undefined; // No params
  Profile: { userId: string };
  Post: { postId: number; title: string };
};

// Create props type for each screen
export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;

export type ProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Profile'
>;

// Use in screens
import { HomeScreenProps } from './types/navigation';

function HomeScreen({ navigation, route }: HomeScreenProps) {
  const goToProfile = () => {
    navigation.navigate('Profile', { userId: '123' });
  };

  return (
    <TouchableOpacity onPress={goToProfile}>
      <Text>Go to Profile</Text>
    </TouchableOpacity>
  );
}

function ProfileScreen({ route }: ProfileScreenProps) {
  const { userId } = route.params;
  return <Text>User ID: {userId}</Text>;
}
```

---

## Typing API Responses

```typescript
// types/api.ts
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// services/api.ts
import axios from 'axios';
import { User, Post, ApiResponse } from '../types/api';

export async function getUser(id: number): Promise<User> {
  const response = await axios.get<User>(`/users/${id}`);
  return response.data;
}

export async function getPosts(): Promise<Post[]> {
  const response = await axios.get<Post[]>('/posts');
  return response.data;
}

export async function createPost(
  post: Omit<Post, 'id'>
): Promise<ApiResponse<Post>> {
  const response = await axios.post<ApiResponse<Post>>('/posts', post);
  return response.data;
}
```

---

## Typing Context

```typescript
import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Login logic
    const user: User = { id: 1, name: 'John', email };
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## Utility Types

```typescript
// Partial - Make all properties optional
interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; }

// Required - Make all properties required
type RequiredUser = Required<PartialUser>;

// Pick - Select specific properties
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: number; name: string; }

// Omit - Exclude specific properties
type UserWithoutId = Omit<User, 'id'>;
// { name: string; email: string; }

// Record - Create object type with specific keys
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;
// { [key: string]: 'admin' | 'user' | 'guest'; }
```

---

## Complete TypeScript Example

```typescript
// types/index.ts
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export type TodoFilter = 'all' | 'active' | 'completed';

// App.tsx
import { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import type { Todo, TodoFilter } from './types';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [filter, setFilter] = useState<TodoFilter>('all');

  const addTodo = (): void => {
    if (inputText.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: inputText.trim(),
        completed: false,
        createdAt: new Date(),
      };
      setTodos([...todos, newTodo]);
      setInputText('');
    }
  };

  const toggleTodo = (id: string): void => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string): void => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos: Todo[] = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const renderTodo = ({ item }: { item: Todo }) => (
    <TouchableOpacity
      style={styles.todoItem}
      onPress={() => toggleTodo(item.id)}
    >
      <Text
        style={[styles.todoText, item.completed && styles.todoTextCompleted]}
      >
        {item.text}
      </Text>
      <TouchableOpacity onPress={() => deleteTodo(item.id)}>
        <Text style={styles.deleteButton}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>TypeScript Todos</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Add a todo..."
          onSubmitEditing={addTodo}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        {(['all', 'active', 'completed'] as TodoFilter[]).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterButton, filter === f && styles.activeFilter]}
            onPress={() => setFilter(f)}
          >
            <Text>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTodos}
        renderItem={renderTodo}
        keyExtractor={item => item.id}
      />
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
  },
  filters: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  filterButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  activeFilter: {
    backgroundColor: '#007AFF',
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 8,
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
    fontSize: 20,
  },
});
```

---

## 🎯 Practice Exercises

### Exercise 1: Type a User Profile Component
Create types for:
- User interface with multiple fields
- Props for ProfileCard component
- Navigation params
- API response types

### Exercise 2: Type a Shopping Cart
Build typed cart system with:
- Product interface
- Cart item interface
- Cart context with TypeScript
- Add/remove/update operations

### Exercise 3: Type an API Service
Create fully typed API service:
- Request/response types
- Error types
- Generic fetch function
- Specific endpoint functions

---

## 💡 Key Takeaways

✅ TypeScript catches errors before runtime
✅ Use interfaces for object shapes
✅ Type all props and state
✅ Leverage type inference when possible
✅ Use utility types (Partial, Pick, Omit)
✅ Type navigation params
✅ Create types for API responses
✅ Use strict mode for better type safety

---

## 🔗 What's Next?

In the next lesson, we'll learn about:
- App architecture patterns
- Clean code principles
- Folder structure
- MVVM pattern

[Next Lesson: App Architecture →](../level-4-professional/01-app-architecture.md)

---

## 📚 Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript with React Native](https://reactnative.dev/docs/typescript)
- [Definitely Typed](https://github.com/DefinitelyTyped/DefinitelyTyped)

---

*Happy coding! 🚀*
