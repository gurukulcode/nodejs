# Problem #002: React vs React Native

**Difficulty**: 🟢 Easy
**Category**: React Native Fundamentals
**Time**: 10-12 minutes

---

## 📝 Problem Statement

**Question 1**: What are the key differences between React and React Native?

**Question 2**: Can you use React components in React Native? What needs to change?

**Question 3**: Compare the rendering output and development workflow between the two.

---

## 🎯 What Interviewers Look For

- Understanding of fundamental differences in rendering targets
- Knowledge of component and styling differences
- Awareness of platform-specific APIs and limitations
- Practical experience with both technologies

---

## ✅ Complete Answer

### Question 1: Key Differences

#### 1. **Rendering Target**

**React (Web):**
```jsx
// Renders to HTML DOM
import React from 'react';

function WebComponent() {
  return (
    <div className="container">
      <h1>Hello Web</h1>
      <p>This is HTML</p>
      <button onClick={handleClick}>Click Me</button>
    </div>
  );
}
```

**React Native (Mobile):**
```jsx
// Renders to Native Components
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

function MobileComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Hello Mobile</Text>
      <Text>This is Native</Text>
      <TouchableOpacity onPress={handlePress}>
        <Text>Click Me</Text>
      </TouchableOpacity>
    </View>
  );
}
```

#### 2. **Component Comparison**

| React (Web) | React Native (Mobile) | Purpose |
|-------------|----------------------|---------|
| `<div>` | `<View>` | Container |
| `<span>`, `<p>`, `<h1>` | `<Text>` | Text display |
| `<button>` | `<TouchableOpacity>`, `<Button>` | Clickable elements |
| `<input>` | `<TextInput>` | Text input |
| `<img>` | `<Image>` | Images |
| `<ul>`, `<ol>` | `<FlatList>`, `<SectionList>` | Lists |
| `<a>` | `<TouchableOpacity>` + Navigation | Links |

#### 3. **Styling Approach**

**React (CSS):**
```jsx
// External CSS or CSS-in-JS
import './App.css';

function App() {
  return (
    <div className="container">
      <h1 style={{ color: 'blue', fontSize: '24px' }}>Title</h1>
    </div>
  );
}

// App.css
.container {
  display: flex;
  padding: 20px;
  background-color: white;
}
```

**React Native (StyleSheet):**
```jsx
// StyleSheet API (JavaScript objects)
import { StyleSheet } from 'react-native';

function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Title</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,  // Different flex behavior
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    color: 'blue',
    fontSize: 24,  // No 'px' suffix
  },
});
```

#### 4. **Navigation**

**React (Web):**
```jsx
import { BrowserRouter, Route, Link } from 'react-router-dom';

function WebNav() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/home">Home</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      <Route path="/home" component={Home} />
      <Route path="/profile" component={Profile} />
    </BrowserRouter>
  );
}
```

**React Native (Mobile):**
```jsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function MobileNav() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

#### 5. **Platform APIs**

**React (Web APIs):**
```jsx
// Access to browser APIs
useEffect(() => {
  // localStorage
  localStorage.setItem('key', 'value');

  // Fetch API
  fetch('https://api.example.com/data')
    .then(res => res.json());

  // Window size
  window.addEventListener('resize', handleResize);
}, []);
```

**React Native (Native APIs):**
```jsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions, Platform } from 'react-native';

useEffect(() => {
  // AsyncStorage (async)
  AsyncStorage.setItem('key', 'value');

  // Fetch API (same)
  fetch('https://api.example.com/data')
    .then(res => res.json());

  // Dimensions
  const { width, height } = Dimensions.get('window');

  // Platform detection
  if (Platform.OS === 'ios') {
    // iOS-specific code
  }
}, []);
```

---

### Question 2: Using React Components in React Native

#### Components That Transfer:
```jsx
// ✅ Business logic components work
import { useState, useEffect } from 'react';

// This logic is identical in both
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return { count, increment, decrement };
}

// ✅ Hooks work the same
function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}
```

#### Components That Need Changes:

**React Component:**
```jsx
function WebButton({ title, onClick }) {
  return (
    <button className="btn btn-primary" onClick={onClick}>
      {title}
    </button>
  );
}
```

**Converted to React Native:**
```jsx
function MobileButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});
```

#### What Needs to Change:

1. **HTML elements → Native components**
2. **className → style prop with StyleSheet**
3. **onClick → onPress**
4. **CSS → JavaScript objects**
5. **DOM APIs → Native APIs**

---

### Question 3: Rendering Output & Workflow

#### Rendering Output:

**React:**
```
React Component
      ↓
  Virtual DOM
      ↓
   Real DOM
      ↓
HTML in Browser
```

**React Native:**
```
React Native Component
      ↓
  Virtual DOM
      ↓
    Bridge
      ↓
Native Components
      ↓
UIView (iOS) / View (Android)
```

#### Development Workflow:

| Aspect | React | React Native |
|--------|-------|--------------|
| **Setup** | `npx create-react-app` | `npx react-native init` or Expo |
| **Run Dev** | `npm start` → Browser | `npm start` + iOS/Android emulator |
| **Hot Reload** | Fast Refresh (browser) | Fast Refresh (device/emulator) |
| **Debugging** | Browser DevTools | React Native Debugger, Flipper |
| **Build** | `npm run build` → static files | `react-native run-ios/android` |
| **Testing** | Jest + React Testing Library | Jest + React Native Testing Library |
| **Deployment** | Web server | App Store / Google Play |

---

## 💡 Code Example: Same App, Different Platforms

**React (Web) Version:**
```jsx
import React, { useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  const addTask = () => {
    setTasks([...tasks, input]);
    setInput('');
  };

  return (
    <div className="app">
      <h1>Todo App (Web)</h1>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter task"
        />
        <button onClick={addTask}>Add</button>
      </div>
      <ul className="task-list">
        {tasks.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
    </div>
  );
}
```

**React Native (Mobile) Version:**
```jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  const addTask = () => {
    setTasks([...tasks, { id: Date.now().toString(), text: input }]);
    setInput('');
  };

  return (
    <View style={styles.app}>
      <Text style={styles.title}>Todo App (Mobile)</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Enter task"
        />
        <TouchableOpacity style={styles.button} onPress={addTask}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
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
    marginRight: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
  },
  taskItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});
```

---

## 🎯 Key Differences Summary

### Similarities:
✅ Same React concepts (components, props, state, hooks)
✅ Same JavaScript/TypeScript
✅ Same state management libraries (Redux, MobX, etc.)
✅ Same testing framework (Jest)
✅ Same component lifecycle

### Differences:
❌ Different rendering targets (DOM vs Native)
❌ Different component libraries
❌ Different styling approach
❌ Different navigation solutions
❌ Different platform APIs
❌ Different deployment process

---

## 🚀 Follow-up Questions

**Q1**: Can you share code between React and React Native?
**A**: Yes, business logic, state management, utilities, and API calls can be shared. UI components need to be platform-specific. Tools like React Native Web enable some code sharing.

**Q2**: Which is easier to learn?
**A**: If you know React, React Native is easier. If starting fresh, React (web) has more resources and simpler setup. Both share the same core concepts.

**Q3**: Can you use npm packages from React in React Native?
**A**: Yes, but only packages that don't depend on browser APIs. Packages with DOM manipulation won't work. Many popular packages have React Native versions.

**Q4**: Is React Native just React for mobile?
**A**: Conceptually yes, but it's a complete separate framework with its own components, APIs, and build process. The React paradigm is the same.

---

## ✅ Common Mistakes

❌ **Mistake 1**: Using HTML elements in React Native
```jsx
// ❌ Won't work
<div><p>Text</p></div>

// ✅ Correct
<View><Text>Text</Text></View>
```

❌ **Mistake 2**: Using CSS classes in React Native
```jsx
// ❌ Won't work
<View className="container" />

// ✅ Correct
<View style={styles.container} />
```

❌ **Mistake 3**: Forgetting Text wrapper
```jsx
// ❌ Won't work
<View>Hello</View>

// ✅ Correct
<View><Text>Hello</Text></View>
```

❌ **Mistake 4**: Using browser APIs
```jsx
// ❌ Won't work in React Native
localStorage.setItem('key', 'value');
document.getElementById('element');

// ✅ Correct
AsyncStorage.setItem('key', 'value');
// Use refs for component access
```

---

## 📊 Quick Reference Table

| Feature | React | React Native |
|---------|-------|--------------|
| **Container** | `<div>` | `<View>` |
| **Text** | `<p>`, `<span>`, `<h1>` | `<Text>` |
| **Click** | `onClick` | `onPress` |
| **Input** | `onChange` | `onChangeText` |
| **Styling** | CSS, className | StyleSheet, style prop |
| **Lists** | map() or libraries | `<FlatList>` |
| **Images** | `<img src="">` | `<Image source={}>` |
| **Output** | HTML/DOM | Native UI |

---

## 📚 Additional Reading

- [React vs React Native](https://reactnative.dev/docs/getting-started)
- [Component Differences](https://reactnative.dev/docs/intro-react)
- [React Native for React Developers](https://reactnative.dev/docs/intro-react-native-components)

---

## ✅ Interview Tips

**Do:**
- ✅ Emphasize shared concepts (hooks, state, props)
- ✅ Show understanding of rendering differences
- ✅ Mention practical experience with both if applicable
- ✅ Discuss code reusability strategies

**Don't:**
- ❌ Say they're completely different frameworks
- ❌ Confuse React Native with WebView approaches
- ❌ Forget to mention the bridge architecture
- ❌ Claim 100% code sharing is possible

---

**Difficulty**: 🟢 Easy
**Estimated Time**: 10-12 minutes
**Next Problem**: [#003: Core Components →](./problem-003-core-components.md)

---

*This problem is part of the React Native Interview Problems Collection*
