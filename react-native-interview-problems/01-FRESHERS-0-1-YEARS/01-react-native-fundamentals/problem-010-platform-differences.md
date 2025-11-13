# Problem #010: Platform Differences (iOS vs Android)

**Difficulty**: 🟢 Easy
**Category**: React Native Fundamentals
**Time**: 10-15 minutes

---

## 📝 Problem Statement

**Question 1**: How do you detect and handle platform differences in React Native?

**Question 2**: What are the main UI/UX differences between iOS and Android that developers should be aware of?

**Question 3**: How do you write platform-specific code for iOS and Android?

---

## 🎯 What Interviewers Look For

- Understanding of Platform API
- Knowledge of platform-specific components and behaviors
- Awareness of iOS/Android design guidelines
- Practical implementation of platform-specific code

---

## ✅ Complete Answer

### Question 1: Detecting Platform

#### **Platform API**

```jsx
import { Platform } from 'react-native';

// Check current platform
console.log(Platform.OS);  // 'ios', 'android', 'web'
console.log(Platform.Version);  // iOS: '14.0', Android: 30

// Platform checks
if (Platform.OS === 'ios') {
  // iOS-specific code
} else if (Platform.OS === 'android') {
  // Android-specific code
}

// Platform.select method
const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
```

#### **Platform-Specific Files**

```
MyComponent.ios.js    // Used on iOS
MyComponent.android.js // Used on Android
MyComponent.js        // Fallback
```

```jsx
// React Native automatically picks the right file
import MyComponent from './MyComponent';
// Imports MyComponent.ios.js on iOS
// Imports MyComponent.android.js on Android
// Imports MyComponent.js if platform-specific file doesn't exist
```

---

### Question 2: Key Platform Differences

#### **1. Shadows**

```jsx
// iOS: Shadow properties
const iosStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
};

// Android: Elevation
const androidStyle = {
  elevation: 5,
};

// Combined platform-specific shadow
const shadowStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  android: {
    elevation: 5,
  },
});
```

#### **2. Status Bar**

```jsx
import { StatusBar, Platform } from 'react-native';

<StatusBar
  barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
  backgroundColor={Platform.OS === 'android' ? '#007AFF' : undefined}
/>

// iOS: barStyle only (background transparent)
// Android: barStyle + backgroundColor
```

#### **3. SafeAreaView**

```jsx
import { SafeAreaView } from 'react-native';

// iOS: Respects notches and safe areas
// Android: May not work as expected

// Better cross-platform solution
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaProvider>
  <SafeAreaView style={{ flex: 1 }}>
    {/* Content */}
  </SafeAreaView>
</SafeAreaProvider>
```

#### **4. Navigation Patterns**

```jsx
// iOS: Prefers tab navigation at bottom
// Android: Prefers drawer navigation or tabs at top

import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = Platform.OS === 'ios'
  ? createBottomTabNavigator()
  : createMaterialTopTabNavigator();
```

#### **5. Back Button (Android Only)**

```jsx
import { BackHandler } from 'react-native';

useEffect(() => {
  if (Platform.OS === 'android') {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // Handle back button press
        return true;  // Prevent default behavior
      }
    );

    return () => backHandler.remove();
  }
}, []);
```

---

### Question 3: Platform-Specific Implementation

#### **Example: Complete Platform-Specific Component**

```jsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';

const PlatformButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        Platform.select({
          ios: styles.buttonIOS,
          android: styles.buttonAndroid,
        }),
      ]}
      // Android ripple effect
      android_ripple={
        Platform.OS === 'android'
          ? { color: 'rgba(0, 0, 0, 0.1)' }
          : undefined
      }
    >
      <Text style={[
        styles.buttonText,
        Platform.OS === 'ios' && styles.buttonTextIOS,
      ]}>
        {title}
      </Text>
      {/* Platform-specific icon */}
      {Platform.OS === 'ios' && (
        <Text style={styles.icon}>›</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonIOS: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonAndroid: {
    backgroundColor: '#007AFF',
    // Android elevation
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextIOS: {
    color: '#007AFF',
  },
  icon: {
    fontSize: 24,
    color: '#007AFF',
  },
});

export default PlatformButton;
```

#### **Platform-Specific Styles Helper**

```jsx
import { StyleSheet, Platform } from 'react-native';

export const createPlatformStyles = (styles) => {
  const platformStyles = {};

  Object.keys(styles).forEach((key) => {
    const style = styles[key];

    // Separate platform-specific properties
    const { ios, android, ...common } = style;

    platformStyles[key] = {
      ...common,
      ...Platform.select({ ios, android }),
    };
  });

  return StyleSheet.create(platformStyles);
};

// Usage
const styles = createPlatformStyles({
  container: {
    flex: 1,
    padding: 20,
    ios: {
      backgroundColor: '#f9f9f9',
    },
    android: {
      backgroundColor: '#fff',
    },
  },
});
```

---

## 💡 Complete Cross-Platform Example

```jsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';

const PlatformDemo = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Platform Demo</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {Platform.OS} {Platform.Version}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Card with platform-specific shadow */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Platform-Specific Shadow</Text>
          <Text style={styles.cardText}>
            {Platform.OS === 'ios'
              ? 'iOS shadow properties'
              : 'Android elevation'}
          </Text>
        </View>

        {/* Platform-specific button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => console.log('Pressed')}
          android_ripple={
            Platform.OS === 'android'
              ? { color: 'rgba(255, 255, 255, 0.3)' }
              : undefined
          }
        >
          <Text style={styles.buttonText}>
            {Platform.OS === 'ios' ? 'iOS Button' : 'Android Button'}
          </Text>
        </TouchableOpacity>

        {/* Conditional rendering */}
        {Platform.OS === 'android' && (
          <Text style={styles.infoText}>
            Android-only: Back button is handled
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.select({
      ios: '#f2f2f7',
      android: '#fff',
    }),
  },
  header: {
    padding: 20,
    backgroundColor: '#007AFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: '#fff',
  },
  badge: {
    marginTop: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: Platform.OS === 'ios' ? 12 : 8,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: Platform.OS === 'ios' ? 10 : 4,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default PlatformDemo;
```

---

## 🎯 Platform Comparison Table

| Feature | iOS | Android |
|---------|-----|---------|
| **Shadows** | shadowColor, shadowOffset, shadowOpacity, shadowRadius | elevation |
| **Status Bar** | barStyle only | barStyle + backgroundColor |
| **Navigation** | Bottom tabs preferred | Top tabs or drawer preferred |
| **Back Button** | ❌ Hardware button | ✅ Hardware button |
| **Ripple Effect** | ❌ Not available | ✅ android_ripple |
| **Safe Area** | ✅ Notches/Dynamic Island | ⚠️ Limited support |
| **Font Weights** | 100-900 | 'normal', 'bold' |
| **Picker** | Scrollwheel | Dropdown |

---

## 🚀 Follow-up Questions

**Q1**: How do you handle platform-specific dependencies?
**A**: Use Platform.select(), create platform-specific files (.ios.js, .android.js), or conditionally import based on Platform.OS.

**Q2**: What is isPad and how is it used?
**A**: `Platform.isPad` (iOS only) detects if device is an iPad, useful for responsive designs.

**Q3**: How do you test platform-specific code?
**A**: Run on both iOS simulator and Android emulator, use Platform.OS in unit tests, or use snapshot testing for both platforms.

**Q4**: What about web platform?
**A**: React Native Web supports Platform.OS === 'web', allowing code sharing with web applications.

---

## ✅ Common Mistakes

❌ **Mistake 1**: Forgetting platform-specific shadows
```jsx
// ❌ Only works on iOS
{ shadowColor: '#000', shadowRadius: 5 }

// ✅ Works on both
Platform.select({
  ios: { shadowColor: '#000', shadowRadius: 5 },
  android: { elevation: 5 },
})
```

❌ **Mistake 2**: Using version as string
```jsx
// ❌ Wrong type
if (Platform.Version === '30') {}

// ✅ Correct
// iOS: string ('14.0')
// Android: number (30)
if (Platform.OS === 'ios' && parseFloat(Platform.Version) >= 14) {}
if (Platform.OS === 'android' && Platform.Version >= 30) {}
```

❌ **Mistake 3**: Ignoring Android back button
```jsx
// ❌ Back button closes app unexpectedly

// ✅ Handle it
useEffect(() => {
  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    () => {
      // Handle navigation
      return true;
    }
  );
  return () => backHandler.remove();
}, []);
```

---

## 📚 Additional Reading

- [Platform Module Docs](https://reactnative.dev/docs/platform)
- [Platform Specific Code](https://reactnative.dev/docs/platform-specific-code)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design for Android](https://material.io/design)

---

## ✅ Interview Tips

**Do:**
- ✅ Show awareness of both iOS and Android design patterns
- ✅ Demonstrate practical use of Platform API
- ✅ Mention platform-specific file extensions
- ✅ Discuss testing on both platforms

**Don't:**
- ❌ Assume one platform's behavior applies to both
- ❌ Forget about Android hardware back button
- ❌ Ignore platform-specific UX guidelines
- ❌ Overlook shadow/elevation differences

---

**Difficulty**: 🟢 Easy
**Estimated Time**: 10-15 minutes
**Next Problem**: [#011: Functional Components →](../02-components-props/problem-011-functional-components.md)

---

*This problem is part of the React Native Interview Problems Collection*
