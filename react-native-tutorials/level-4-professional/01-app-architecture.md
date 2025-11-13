# Lesson 1: App Architecture & Design Patterns

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Understand clean architecture principles
- Implement MVVM pattern
- Organize project structure
- Separate concerns effectively
- Build scalable applications

---

## Clean Architecture Principles

**Key Concepts:**
- **Separation of Concerns**: Each module has one responsibility
- **Dependency Inversion**: Depend on abstractions, not implementations
- **Testability**: Easy to test in isolation
- **Scalability**: Easy to add new features

---

## Recommended Folder Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   └── features/       # Feature-specific components
│       ├── auth/
│       └── profile/
├── screens/            # Screen components
│   ├── HomeScreen.tsx
│   ├── ProfileScreen.tsx
│   └── SettingsScreen.tsx
├── navigation/         # Navigation setup
│   ├── RootNavigator.tsx
│   ├── AuthNavigator.tsx
│   └── types.ts
├── services/          # API and external services
│   ├── api.ts
│   ├── auth.ts
│   └── storage.ts
├── hooks/             # Custom hooks
│   ├── useAuth.ts
│   ├── useFetch.ts
│   └── useNetworkStatus.ts
├── context/           # React Context providers
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── utils/             # Utility functions
│   ├── helpers.ts
│   ├── validation.ts
│   └── constants.ts
├── types/             # TypeScript types
│   ├── models.ts
│   ├── api.ts
│   └── navigation.ts
├── config/            # App configuration
│   ├── env.ts
│   └── theme.ts
└── assets/            # Static assets
    ├── images/
    ├── fonts/
    └── icons/
```

---

## MVVM Pattern

**Model-View-ViewModel** separates UI from business logic:

### Model (Data Layer)

```typescript
// types/models.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
}
```

### Service Layer (Data Access)

```typescript
// services/userService.ts
import api from './api';
import { User } from '../types/models';

export class UserService {
  async getUser(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  }

  async searchUsers(query: string): Promise<User[]> {
    const response = await api.get<User[]>(`/users/search?q=${query}`);
    return response.data;
  }
}

export default new UserService();
```

### ViewModel (Business Logic)

```typescript
// hooks/useUserProfile.ts
import { useState, useEffect } from 'react';
import { User } from '../types/models';
import userService from '../services/userService';

export function useUserProfile(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const userData = await userService.getUser(userId);
      setUser(userData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const updated = await userService.updateUser(userId, data);
      setUser(updated);
      return updated;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    updateProfile,
    reload: loadUser,
  };
}
```

### View (UI Component)

```typescript
// screens/ProfileScreen.tsx
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useUserProfile } from '../hooks/useUserProfile';
import { Button } from '../components/common/Button';

export function ProfileScreen({ route }) {
  const { userId } = route.params;
  const { user, loading, error, updateProfile } = useUserProfile(userId);

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <Button
        title="Edit Profile"
        onPress={() => {
          /* Navigate to edit screen */
        }}
      />
    </View>
  );
}
```

---

## Repository Pattern

Abstracts data sources:

```typescript
// repositories/BaseRepository.ts
export abstract class BaseRepository<T> {
  abstract getAll(): Promise<T[]>;
  abstract getById(id: string): Promise<T>;
  abstract create(data: Omit<T, 'id'>): Promise<T>;
  abstract update(id: string, data: Partial<T>): Promise<T>;
  abstract delete(id: string): Promise<void>;
}

// repositories/UserRepository.ts
import { BaseRepository } from './BaseRepository';
import { User } from '../types/models';
import api from '../services/api';
import storage from '../services/storage';

export class UserRepository extends BaseRepository<User> {
  private cacheKey = 'users_cache';

  async getAll(): Promise<User[]> {
    try {
      const response = await api.get<User[]>('/users');
      await storage.setObject(this.cacheKey, response.data);
      return response.data;
    } catch (error) {
      const cached = await storage.getObject<User[]>(this.cacheKey);
      return cached || [];
    }
  }

  async getById(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  }

  async create(data: Omit<User, 'id'>): Promise<User> {
    const response = await api.post<User>('/users', data);
    return response.data;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }
}

export default new UserRepository();
```

---

## Feature-Based Architecture

Organize by features instead of technical layers:

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── screens/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── services/
│   │   │   └── authService.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── profile/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── hooks/
│   │   └── index.ts
│   └── posts/
│       ├── components/
│       ├── screens/
│       ├── hooks/
│       └── index.ts
└── shared/
    ├── components/
    ├── hooks/
    ├── utils/
    └── types/
```

---

## Dependency Injection

```typescript
// services/ServiceContainer.ts
import { UserRepository } from '../repositories/UserRepository';
import { PostRepository } from '../repositories/PostRepository';
import { AuthService } from './authService';
import { StorageService } from './storageService';

export class ServiceContainer {
  private static instance: ServiceContainer;
  
  public userRepository: UserRepository;
  public postRepository: PostRepository;
  public authService: AuthService;
  public storageService: StorageService;

  private constructor() {
    this.storageService = new StorageService();
    this.authService = new AuthService(this.storageService);
    this.userRepository = new UserRepository();
    this.postRepository = new PostRepository();
  }

  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }
}

// Usage in components
import { ServiceContainer } from '../services/ServiceContainer';

const services = ServiceContainer.getInstance();
const user = await services.userRepository.getById('123');
```

---

## Environment Configuration

```typescript
// config/env.ts
import Constants from 'expo-constants';

interface EnvConfig {
  API_URL: string;
  API_KEY: string;
  ENVIRONMENT: 'development' | 'staging' | 'production';
}

const ENV: EnvConfig = {
  API_URL: Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000',
  API_KEY: Constants.expoConfig?.extra?.apiKey || '',
  ENVIRONMENT: __DEV__ ? 'development' : 'production',
};

export default ENV;

// app.config.js
export default {
  expo: {
    name: 'MyApp',
    extra: {
      apiUrl: process.env.API_URL,
      apiKey: process.env.API_KEY,
    },
  },
};
```

---

## Error Boundary

```typescript
// components/ErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Text style={styles.title}>Oops! Something went wrong</Text>
          <Text style={styles.message}>
            {this.state.error?.message}
          </Text>
          <Button title="Try Again" onPress={this.resetError} />
        </View>
      );
    }

    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## 🎯 Practice Exercises

### Exercise 1: Implement Repository Pattern
Create:
- Base repository class
- Product repository
- Order repository
- Use in hooks

### Exercise 2: Feature-Based Structure
Reorganize an app to use:
- Feature folders
- Shared components
- Feature-specific hooks
- Clean exports

### Exercise 3: Build Service Layer
Create a complete service layer:
- API service
- Auth service
- Storage service
- Notification service

---

## 💡 Key Takeaways

✅ Separate business logic from UI
✅ Use MVVM or similar patterns
✅ Organize by features, not layers
✅ Abstract data sources with repositories
✅ Use dependency injection
✅ Implement error boundaries
✅ Configure environments properly
✅ Keep components simple and focused

---

## 🔗 What's Next?

[Next Lesson: Redux Toolkit →](./02-redux-toolkit.md)

---

## 📚 Additional Resources

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React Native Architecture](https://reactnative.dev/docs/architecture-overview)
- [MVVM Pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel)

---

*Happy coding! 🚀*
