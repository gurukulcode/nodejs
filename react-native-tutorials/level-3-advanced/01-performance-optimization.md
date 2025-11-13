# Lesson 1: Performance Optimization

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Optimize FlatList rendering performance
- Use React.memo and useMemo effectively
- Prevent unnecessary re-renders
- Profile and measure app performance
- Apply optimization best practices

---

## Understanding Performance Issues

Common performance problems:
- **Slow lists**: Large lists rendering slowly
- **Unnecessary re-renders**: Components updating when they shouldn't
- **Heavy computations**: Blocking the main thread
- **Large bundle size**: Slow app startup
- **Memory leaks**: Growing memory usage

---

## FlatList Optimization

### Basic Optimizations

```jsx
import { FlatList, View, Text, StyleSheet } from 'react-native';

export default function OptimizedList({ data }) {
  const renderItem = ({ item }) => <ItemComponent item={item} />;

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}

      // PERFORMANCE OPTIMIZATIONS
      removeClippedSubviews={true}            // Unmount offscreen views
      maxToRenderPerBatch={10}                 // Render 10 items per batch
      updateCellsBatchingPeriod={50}          // Update every 50ms
      initialNumToRender={10}                  // Render 10 items initially
      windowSize={5}                           // Keep 5 screens worth of items

      // Only if needed
      getItemLayout={(data, index) => ({      // For fixed height items
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
    />
  );
}
```

### Memoized List Items

```jsx
import React, { memo } from 'react';

// ❌ BAD: Re-renders on every list update
function ItemComponent({ item, onPress }) {
  console.log('Rendering:', item.id);
  return (
    <TouchableOpacity onPress={() => onPress(item.id)}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );
}

// ✅ GOOD: Only re-renders when props change
const ItemComponent = memo(({ item, onPress }) => {
  console.log('Rendering:', item.id);
  return (
    <TouchableOpacity onPress={() => onPress(item.id)}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );
});

// ✅ EVEN BETTER: Custom comparison
const ItemComponent = memo(
  ({ item, onPress }) => {
    return (
      <TouchableOpacity onPress={() => onPress(item.id)}>
        <Text>{item.name}</Text>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (don't re-render)
    return prevProps.item.id === nextProps.item.id &&
           prevProps.item.name === nextProps.item.name;
  }
);
```

### useCallback for Handlers

```jsx
import { useState, useCallback } from 'react';

function ParentComponent() {
  const [items, setItems] = useState([...]);

  // ❌ BAD: New function on every render
  const handlePress = (id) => {
    console.log('Pressed:', id);
  };

  // ✅ GOOD: Memoized function
  const handlePress = useCallback((id) => {
    console.log('Pressed:', id);
  }, []); // Empty deps = never changes

  return (
    <FlatList
      data={items}
      renderItem={({ item }) => (
        <ItemComponent item={item} onPress={handlePress} />
      )}
    />
  );
}
```

---

## useMemo Hook

Memoize expensive computations:

```jsx
import { useMemo } from 'react';

function ExpensiveComponent({ items, filter }) {
  // ❌ BAD: Filters on every render
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  // ✅ GOOD: Only recomputes when items or filter changes
  const filteredItems = useMemo(() => {
    console.log('Filtering...');
    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  return (
    <FlatList
      data={filteredItems}
      renderItem={({ item }) => <Text>{item.name}</Text>}
    />
  );
}
```

### Complex Calculations

```jsx
function DataProcessor({ data }) {
  // Expensive calculation
  const processedData = useMemo(() => {
    console.log('Processing data...');
    return data.map(item => ({
      ...item,
      total: item.price * item.quantity,
      tax: item.price * item.quantity * 0.1,
      grandTotal: item.price * item.quantity * 1.1,
    }));
  }, [data]);

  const total = useMemo(() => {
    return processedData.reduce((sum, item) => sum + item.grandTotal, 0);
  }, [processedData]);

  return (
    <View>
      <Text>Total: ${total.toFixed(2)}</Text>
      {/* ... */}
    </View>
  );
}
```

---

## React.memo

Prevent component re-renders:

```jsx
import React, { memo } from 'react';

// Component without memo - re-renders when parent updates
function Header({ title }) {
  console.log('Header rendered');
  return <Text style={styles.header}>{title}</Text>;
}

// With memo - only re-renders when title changes
const Header = memo(({ title }) => {
  console.log('Header rendered');
  return <Text style={styles.header}>{title}</Text>;
});

// Parent component
function App() {
  const [count, setCount] = useState(0);

  return (
    <View>
      {/* Header won't re-render when count changes */}
      <Header title="My App" />
      <Text>Count: {count}</Text>
      <Button title="Increment" onPress={() => setCount(count + 1)} />
    </View>
  );
}
```

---

## Image Optimization

### Optimized Image Component

```jsx
import { Image } from 'react-native';
import FastImage from 'react-native-fast-image';

// ❌ BAD: Standard Image component
<Image
  source={{ uri: imageUrl }}
  style={{ width: 100, height: 100 }}
/>

// ✅ GOOD: FastImage with caching
<FastImage
  source={{
    uri: imageUrl,
    priority: FastImage.priority.normal,
    cache: FastImage.cacheControl.immutable,
  }}
  style={{ width: 100, height: 100 }}
  resizeMode={FastImage.resizeMode.cover}
/>

// ✅ BETTER: Specify dimensions in source
<Image
  source={{
    uri: imageUrl,
    width: 100,
    height: 100,
  }}
  style={{ width: 100, height: 100 }}
/>
```

### Image Prefetching

```jsx
import { useEffect } from 'react';
import FastImage from 'react-native-fast-image';

function Gallery({ images }) {
  useEffect(() => {
    // Prefetch images
    const uris = images.map(img => ({ uri: img.url }));
    FastImage.preload(uris);
  }, [images]);

  return (
    <FlatList
      data={images}
      renderItem={({ item }) => (
        <FastImage source={{ uri: item.url }} style={styles.image} />
      )}
    />
  );
}
```

---

## Complete Optimized List Example

```jsx
import { useState, useCallback, useMemo, memo } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const ITEM_HEIGHT = 80;

// Memoized list item
const ListItem = memo(({ item, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => onPress(item.id)}
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.email}>{item.email}</Text>
    </TouchableOpacity>
  );
}, (prev, next) => {
  return prev.item.id === next.item.id;
});

export default function OptimizedContactList() {
  const [contacts, setContacts] = useState(generateContacts(1000));
  const [search, setSearch] = useState('');

  // Memoized filtered list
  const filteredContacts = useMemo(() => {
    if (!search) return contacts;

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(search.toLowerCase()) ||
      contact.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [contacts, search]);

  // Memoized callbacks
  const handlePress = useCallback((id) => {
    console.log('Pressed:', id);
  }, []);

  const renderItem = useCallback(
    ({ item }) => <ListItem item={item} onPress={handlePress} />,
    [handlePress]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  const getItemLayout = useCallback(
    (data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search contacts..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredContacts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={15}
        windowSize={5}
      />
    </SafeAreaView>
  );
}

// Helper function
function generateContacts(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${i}`,
    name: `Contact ${i + 1}`,
    email: `contact${i + 1}@example.com`,
  }));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchInput: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingHorizontal: 15,
    fontSize: 16,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
});
```

---

## Debugging Performance

### React DevTools Profiler

```jsx
import { Profiler } from 'react';

function onRenderCallback(
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
}

<Profiler id="MyComponent" onRender={onRenderCallback}>
  <MyComponent />
</Profiler>
```

### Performance Monitor

```jsx
import { PerformanceObserver, performance } from 'react-native-performance';

// Monitor app startup time
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}ms`);
  });
});

observer.observe({ entryTypes: ['measure'] });

performance.mark('app-start');
// ... app initialization
performance.mark('app-ready');
performance.measure('app-startup', 'app-start', 'app-ready');
```

---

## Bundle Size Optimization

### Code Splitting with Dynamic Imports

```jsx
import { lazy, Suspense } from 'react';

// Instead of regular import
// import HeavyComponent from './HeavyComponent';

// Use lazy loading
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Remove Console Logs in Production

```jsx
// babel.config.js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // Remove console.log in production
    ['transform-remove-console', { exclude: ['error', 'warn'] }],
  ],
};
```

---

## Memory Leak Prevention

### Cleanup Event Listeners

```jsx
function MyComponent() {
  useEffect(() => {
    const subscription = someAPI.subscribe(callback);

    // ✅ GOOD: Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);
}
```

### Abort Fetch Requests

```jsx
function DataFetcher() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    fetch(url, { signal: abortController.signal })
      .then(res => res.json())
      .then(setData)
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Fetch error:', err);
        }
      });

    // ✅ Cleanup: abort on unmount
    return () => abortController.abort();
  }, [url]);

  return <View>{/* ... */}</View>;
}
```

---

## Performance Checklist

### Before Optimization

✅ Profile your app first
✅ Identify actual bottlenecks
✅ Set performance goals
✅ Measure baseline performance

### FlatList

✅ Use `keyExtractor` with stable IDs
✅ Memoize `renderItem` with `useCallback`
✅ Use `getItemLayout` for fixed-height items
✅ Enable `removeClippedSubviews`
✅ Set appropriate `windowSize`
✅ Use `React.memo` for list items

### Components

✅ Use `React.memo` for pure components
✅ Use `useMemo` for expensive calculations
✅ Use `useCallback` for event handlers
✅ Avoid inline object/array creation in render
✅ Split large components into smaller ones

### Images

✅ Use FastImage for better performance
✅ Specify image dimensions
✅ Implement image caching
✅ Lazy load images
✅ Use appropriate image sizes

### General

✅ Remove console.logs in production
✅ Use Hermes engine
✅ Enable ProGuard on Android
✅ Optimize bundle size
✅ Prevent memory leaks

---

## 🎯 Practice Exercises

### Exercise 1: Optimize a Slow List
Take a list with 10,000 items and:
- Implement all FlatList optimizations
- Memoize list items
- Add search with useMemo
- Measure performance improvement

### Exercise 2: Prevent Re-renders
Create an app with multiple components:
- Identify unnecessary re-renders
- Apply React.memo where needed
- Use useMemo and useCallback
- Verify with React DevTools

### Exercise 3: Image Gallery Optimization
Build an optimized image gallery:
- Load 100+ images
- Implement lazy loading
- Add image caching
- Prefetch next images
- Measure scroll performance

---

## 💡 Key Takeaways

✅ Profile before optimizing
✅ FlatList has many built-in optimizations
✅ React.memo prevents unnecessary re-renders
✅ useMemo for expensive calculations
✅ useCallback for stable function references
✅ Always cleanup subscriptions and timers
✅ Optimize images with FastImage
✅ Remove console.logs in production
✅ Test on real devices, not just emulators

---

## 🔗 What's Next?

In the next lesson, we'll learn about:
- Advanced animations with Reanimated 2
- Gesture handling
- Complex animations
- 60 FPS animations

[Next Lesson: Advanced Animations →](./02-advanced-animations.md)

---

## 📚 Additional Resources

- [React Native Performance](https://reactnative.dev/docs/performance)
- [Optimizing FlatList](https://reactnative.dev/docs/optimizing-flatlist-configuration)
- [React Performance](https://react.dev/reference/react/memo)
- [Hermes Engine](https://reactnative.dev/docs/hermes)

---

*Happy coding! 🚀*
