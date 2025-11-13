# Lesson 2: API Integration & Data Fetching

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Fetch data from REST APIs using Fetch and Axios
- Handle async/await operations properly
- Manage loading and error states
- Implement data caching strategies
- Work with real-world API responses

---

## Fetch API Basics

The built-in Fetch API for HTTP requests:

### GET Request

```jsx
import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://jsonplaceholder.typicode.com/users/1');

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.phone}>{user.phone}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  phone: {
    fontSize: 16,
    color: '#666',
  },
  error: {
    color: '#ff3b30',
    fontSize: 16,
  },
});
```

### POST Request

```jsx
const createPost = async (postData) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error('Failed to create post');
    }

    const data = await response.json();
    console.log('Created post:', data);
    return data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Usage
const handleSubmit = async () => {
  const newPost = {
    title: 'My Post',
    body: 'This is the content',
    userId: 1,
  };

  try {
    setLoading(true);
    const result = await createPost(newPost);
    Alert.alert('Success', 'Post created!');
  } catch (error) {
    Alert.alert('Error', error.message);
  } finally {
    setLoading(false);
  }
};
```

### PUT/PATCH Request

```jsx
const updateUser = async (userId, updates) => {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}`,
      {
        method: 'PATCH',  // or 'PUT' for full replacement
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
```

### DELETE Request

```jsx
const deletePost = async (postId) => {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete post');
    }

    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};
```

---

## Axios Library

More powerful alternative to Fetch with better features:

### Installation

```bash
npm install axios
```

### Basic Axios Usage

```jsx
import axios from 'axios';

// GET request
const fetchPosts = async () => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    return response.data;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};

// POST request
const createPost = async (postData) => {
  try {
    const response = await axios.post(
      'https://jsonplaceholder.typicode.com/posts',
      postData
    );
    return response.data;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};

// PUT request
const updatePost = async (postId, updates) => {
  try {
    const response = await axios.put(
      `https://jsonplaceholder.typicode.com/posts/${postId}`,
      updates
    );
    return response.data;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};

// DELETE request
const deletePost = async (postId) => {
  try {
    await axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
    return true;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};
```

### Axios Instance with Base Configuration

```jsx
import axios from 'axios';

// Create instance with default config
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor (e.g., for auth tokens)
api.interceptors.request.use(
  (config) => {
    // Get token from storage
    const token = 'your-auth-token';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor (e.g., for error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('Response error:', error.response.data);
      console.error('Status:', error.response.status);
    } else if (error.request) {
      // Request made but no response
      console.error('Network error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Usage
export const getUsers = () => api.get('/users');
export const createUser = (data) => api.post('/users', data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
```

---

## Complete Example: Posts App with API

```jsx
import { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com';

export default function PostsApp() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/posts`);
      setPosts(response.data.slice(0, 20)); // Limit to 20 posts
    } catch (err) {
      setError(err.message);
      Alert.alert('Error', 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const deletePost = async (postId) => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/posts/${postId}`);
              setPosts(posts.filter(post => post.id !== postId));
              Alert.alert('Success', 'Post deleted');
            } catch (err) {
              Alert.alert('Error', 'Failed to delete post');
            }
          },
        },
      ]
    );
  };

  const renderPost = ({ item }) => (
    <TouchableOpacity
      style={styles.postCard}
      onLongPress={() => deletePost(item.id)}
    >
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postBody} numberOfLines={2}>
        {item.body}
      </Text>
      <Text style={styles.postId}>Post #{item.id}</Text>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading posts...</Text>
      </View>
    );
  }

  if (error && !posts.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchPosts}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Posts</Text>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No posts available</Text>
        )}
        contentContainerStyle={styles.listContent}
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
    backgroundColor: '#007AFF',
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  listContent: {
    padding: 16,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  postBody: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  postId: {
    fontSize: 12,
    color: '#999',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 50,
  },
});
```

---

## Handling Different Response Types

### JSON Response

```jsx
const response = await fetch(url);
const data = await response.json();
```

### Text Response

```jsx
const response = await fetch(url);
const text = await response.text();
```

### Blob Response (for images, files)

```jsx
const response = await fetch(imageUrl);
const blob = await response.blob();
```

---

## Error Handling Patterns

### Comprehensive Error Handling

```jsx
const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await axios.get(url);
    setData(response.data);
  } catch (error) {
    let errorMessage = 'An error occurred';

    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 400:
          errorMessage = 'Bad request';
          break;
        case 401:
          errorMessage = 'Unauthorized';
          break;
        case 404:
          errorMessage = 'Not found';
          break;
        case 500:
          errorMessage = 'Server error';
          break;
        default:
          errorMessage = error.response.data.message || errorMessage;
      }
    } else if (error.request) {
      // Request made but no response
      errorMessage = 'Network error. Please check your connection.';
    } else {
      // Something else happened
      errorMessage = error.message;
    }

    setError(errorMessage);
    Alert.alert('Error', errorMessage);
  } finally {
    setLoading(false);
  }
};
```

---

## Pagination

```jsx
import { useState, useEffect } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';

export default function PaginatedList() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPage(page);
  }, [page]);

  const fetchPage = async (pageNum) => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.example.com/posts?page=${pageNum}&limit=10`
      );

      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setData([...data, ...response.data]);
      }
    } catch (error) {
      console.error('Error fetching page:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(page + 1);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="small" color="#007AFF" />;
  };

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <ItemComponent item={item} />}
      keyExtractor={(item, index) => index.toString()}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />
  );
}
```

---

## Data Caching Strategy

```jsx
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'posts_cache';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export default function CachedDataComponent() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Try to load from cache first
      const cached = await AsyncStorage.getItem(CACHE_KEY);

      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;

        // Use cache if not expired
        if (age < CACHE_EXPIRY) {
          setPosts(data);
          setLoading(false);
          return;
        }
      }

      // Fetch fresh data if no cache or expired
      await fetchFreshData();
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const fetchFreshData = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      const data = response.data;

      // Update state
      setPosts(data);

      // Save to cache
      await AsyncStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async () => {
    await AsyncStorage.removeItem(CACHE_KEY);
    await fetchFreshData();
  };

  return (
    <View>
      {/* Your UI */}
    </View>
  );
}
```

---

## API Service Pattern

Create a centralized API service:

```jsx
// services/api.js
import axios from 'axios';

const API_BASE_URL = 'https://api.example.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Posts API
export const postsAPI = {
  getAll: () => api.get('/posts'),
  getById: (id) => api.get(`/posts/${id}`),
  create: (data) => api.post('/posts', data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
};

// Comments API
export const commentsAPI = {
  getByPost: (postId) => api.get(`/posts/${postId}/comments`),
  create: (data) => api.post('/comments', data),
};

export default api;
```

Usage:

```jsx
import { postsAPI, usersAPI } from './services/api';

const fetchData = async () => {
  try {
    const posts = await postsAPI.getAll();
    const user = await usersAPI.getById(1);

    setPosts(posts.data);
    setUser(user.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 🎯 Practice Exercises

### Exercise 1: Weather App
Build a weather app that:
- Fetches weather data from OpenWeatherMap API
- Shows current weather and 5-day forecast
- Implements pull-to-refresh
- Handles loading and error states
- Caches data for 10 minutes

### Exercise 2: Todo App with API
Create a todo app that:
- Fetches todos from JSONPlaceholder
- Adds new todos (POST)
- Updates todo completion status (PATCH)
- Deletes todos (DELETE)
- Shows loading indicators for each action

### Exercise 3: User Directory
Build a user directory with:
- Paginated user list
- Search functionality
- User detail view
- Pull-to-refresh
- Error retry mechanism
- Offline cache

---

## 💡 Key Takeaways

✅ Use async/await for cleaner async code
✅ Always handle loading and error states
✅ Axios provides better features than Fetch
✅ Use interceptors for auth and error handling
✅ Implement pull-to-refresh for better UX
✅ Cache data to reduce API calls
✅ Create API service layer for organization
✅ Handle different HTTP status codes properly

---

## 🔗 What's Next?

In the next lesson, we'll learn about:
- Context API for global state
- useReducer for complex state logic
- State management patterns
- Prop drilling solutions

[Next Lesson: State Management →](./03-state-management.md)

---

## 📚 Additional Resources

- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) - Free fake API
- [REST API Best Practices](https://restfulapi.net/)

---

*Happy coding! 🚀*
