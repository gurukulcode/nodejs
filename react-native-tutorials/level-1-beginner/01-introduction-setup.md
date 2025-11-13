# Lesson 1: Introduction to React Native & Environment Setup

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Understand what React Native is and how it differs from React
- Set up your React Native development environment
- Create your first React Native application
- Run your app on iOS Simulator/Android Emulator
- Understand the basic structure of a React Native app

---

## What is React Native?

React Native is a **framework** for building native mobile applications using JavaScript and React. Created by Facebook (Meta) in 2015, it allows you to write code once and deploy to both iOS and Android.

### React vs React Native

| Feature | React | React Native |
|---------|-------|--------------|
| **Platform** | Web (browser) | Mobile (iOS/Android) |
| **Output** | HTML DOM | Native UI components |
| **Styling** | CSS | JavaScript StyleSheet |
| **Components** | `<div>`, `<span>`, `<input>` | `<View>`, `<Text>`, `<TextInput>` |
| **Navigation** | React Router | React Navigation |
| **Runs on** | Browser | Mobile device/simulator |

### Why Use React Native?

✅ **Cross-Platform**: Write once, run on iOS and Android
✅ **Native Performance**: Real native components, not WebView
✅ **Hot Reload**: See changes instantly without rebuilding
✅ **JavaScript**: Use familiar JS/React knowledge
✅ **Large Ecosystem**: Thousands of libraries and tools
✅ **Cost-Effective**: One codebase = two platforms
✅ **Fast Development**: Faster than separate native development

---

## Setting Up Your Environment

### Prerequisites

You need Node.js installed (v18+ recommended):

```bash
# Check if Node.js is installed
node --version

# Check if npm is installed
npm --version
```

If not installed, download from [nodejs.org](https://nodejs.org/)

---

## Development Environment Options

### Option 1: Expo (Recommended for Beginners)

**Pros**: Easy setup, no Xcode/Android Studio needed initially
**Cons**: Some limitations with native modules

```bash
# Install Expo CLI globally
npm install -g expo-cli

# Create new project
npx create-expo-app MyFirstApp

# Navigate to project
cd MyFirstApp

# Start development server
npx expo start
```

You can scan QR code with:
- **iOS**: Expo Go app from App Store
- **Android**: Expo Go app from Google Play

### Option 2: React Native CLI (For Full Control)

**Pros**: Full access to native code
**Cons**: More complex setup

```bash
# Install React Native CLI
npm install -g react-native-cli

# Create new project
npx react-native init MyFirstApp

# Navigate to project
cd MyFirstApp

# Run on iOS (Mac only)
npx react-native run-ios

# Run on Android
npx react-native run-android
```

**Required for React Native CLI:**
- **Mac**: Xcode (for iOS development)
- **Windows/Mac/Linux**: Android Studio (for Android development)

---

## Project Structure (Expo)

```
MyFirstApp/
├── .expo/              # Expo configuration
├── assets/             # Images, fonts, icons
├── node_modules/       # Dependencies
├── App.js             # Main entry component
├── app.json           # App configuration
├── babel.config.js    # Babel configuration
└── package.json       # Project dependencies
```

---

## Your First React Native App

### App.js (Expo Default)

```jsx
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, React Native!</Text>
      <Text style={styles.subtitle}>Welcome to mobile development</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
```

---

## Core Components You'll Use

### 1. View
The basic building block (like `<div>` in web)

```jsx
<View style={{ padding: 20, backgroundColor: '#f0f0f0' }}>
  <Text>Content goes here</Text>
</View>
```

### 2. Text
For displaying text (ALL text must be in `<Text>`)

```jsx
<Text style={{ fontSize: 18, color: 'blue' }}>
  Hello World
</Text>
```

### 3. Image
For displaying images

```jsx
import { Image } from 'react-native';

// Local image
<Image
  source={require('./assets/logo.png')}
  style={{ width: 100, height: 100 }}
/>

// Remote image
<Image
  source={{ uri: 'https://example.com/image.jpg' }}
  style={{ width: 100, height: 100 }}
/>
```

### 4. Button
Simple button component

```jsx
import { Button } from 'react-native';

<Button
  title="Click Me"
  onPress={() => alert('Button pressed!')}
  color="#841584"
/>
```

---

## Understanding React Native Styling

React Native uses **JavaScript StyleSheet**, NOT CSS!

```jsx
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,                    // Flexbox (default)
    backgroundColor: '#fff',     // camelCase properties
    padding: 20,                // Numbers (no 'px')
    alignItems: 'center',       // Flexbox properties
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,               // Number, not string
    fontWeight: 'bold',         // String values in quotes
    color: '#333',
    marginTop: 10,
  }
});
```

### Key Differences from CSS:

- ❌ No `px`, `em`, `rem` - just numbers
- ❌ No kebab-case - use camelCase (`backgroundColor` not `background-color`)
- ❌ No shorthand - write full properties (`marginTop`, `marginBottom` separately)
- ✅ Flexbox is default layout system
- ✅ All dimensions are in density-independent pixels (dp)

---

## Running Your App

### Expo:
```bash
# Start development server
npx expo start

# Run on iOS simulator (Mac)
press 'i'

# Run on Android emulator
press 'a'

# Scan QR code with Expo Go app on physical device
```

### React Native CLI:
```bash
# iOS (Mac only)
npx react-native run-ios

# Android
npx react-native run-android
```

---

## Debugging Your App

### 1. Developer Menu

**iOS Simulator**: `Cmd + D`
**Android Emulator**: `Cmd + M` (Mac) or `Ctrl + M` (Windows/Linux)
**Physical Device**: Shake the device

### 2. Console Logs

```jsx
console.log('Debug message');
console.warn('Warning message');
console.error('Error message');
```

### 3. React DevTools

```bash
npm install -g react-devtools
react-devtools
```

---

## 🎯 Practice Exercises

### Exercise 1: Personal Info Card
Create an app that displays:
- Your name (large, bold)
- Your role (e.g., "Mobile Developer")
- A brief bio (2-3 sentences)
- Style it with colors and spacing

### Exercise 2: Image Gallery
Create an app with:
- A title at the top
- 3 images in a vertical layout
- Captions under each image

### Exercise 3: Button Counter
Create an app with:
- A text showing "Count: 0"
- Two buttons: "Increment" and "Decrement"
- Clicking buttons changes the count (use `useState`)

```jsx
import { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.countText}>Count: {count}</Text>
      <Button title="Increment" onPress={() => setCount(count + 1)} />
      <Button title="Decrement" onPress={() => setCount(count - 1)} />
    </View>
  );
}
```

---

## 💡 Key Takeaways

✅ React Native builds **real native apps**, not hybrid apps
✅ Uses JavaScript but renders **native UI components**
✅ Expo is easier for beginners, React Native CLI gives more control
✅ Components: `<View>`, `<Text>`, `<Image>`, `<Button>`
✅ Styling uses JavaScript, not CSS
✅ Flexbox is the default layout system
✅ Hot Reload makes development fast

---

## 🚨 Common Beginner Mistakes

❌ **Mistake**: Putting text directly in `<View>`
```jsx
<View>Hello</View>  // ❌ Wrong
```
✅ **Correct**: Always wrap text in `<Text>`
```jsx
<View>
  <Text>Hello</Text>  // ✅ Correct
</View>
```

❌ **Mistake**: Using CSS syntax
```jsx
fontSize: '16px'  // ❌ Wrong
```
✅ **Correct**: Use numbers
```jsx
fontSize: 16  // ✅ Correct
```

❌ **Mistake**: Using HTML tags
```jsx
<div><span>Text</span></div>  // ❌ Wrong
```
✅ **Correct**: Use React Native components
```jsx
<View><Text>Text</Text></View>  // ✅ Correct
```

---

## 🔗 What's Next?

In the next lesson, we'll learn about:
- More core components (`ScrollView`, `FlatList`, `TouchableOpacity`)
- Handling user interactions
- Building a more complex UI

[Next Lesson: Core Components & Interactions →](./02-core-components.md)

---

## 📚 Additional Resources

- [React Native Official Docs](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Express](https://www.reactnative.express/)
- [React Native Directory](https://reactnative.directory/) - Component libraries

---

*Happy coding! 🚀*
