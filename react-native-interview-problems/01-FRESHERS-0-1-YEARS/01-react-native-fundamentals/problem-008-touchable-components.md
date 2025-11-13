# Problem #008: Touchable Components

**Difficulty**: 🟢 Easy
**Category**: React Native Fundamentals
**Time**: 10-12 minutes

---

## 📝 Problem Statement

**Question 1**: What are the different Touchable components in React Native and when should you use each?

**Question 2**: Explain the difference between TouchableOpacity, TouchableHighlight, and Pressable.

**Question 3**: How do you handle press events and implement custom touch feedback?

---

## 🎯 What Interviewers Look For

- Knowledge of all Touchable component types
- Understanding when to use each variant
- Awareness of Pressable (newer API)
- Touch feedback customization skills

---

## ✅ Complete Answer

### Question 1: Touchable Components Overview

React Native provides several components to handle touch interactions:

1. **TouchableOpacity** - Reduces opacity on press
2. **TouchableHighlight** - Darkens background on press
3. **TouchableWithoutFeedback** - No visual feedback
4. **Pressable** - Modern, flexible API (recommended)

#### **TouchableOpacity**

```jsx
import { TouchableOpacity, Text } from 'react-native';

<TouchableOpacity
  onPress={() => console.log('Pressed')}
  activeOpacity={0.7}  // 0-1, default 0.2
  disabled={false}
  style={styles.button}
>
  <Text>Press Me</Text>
</TouchableOpacity>
```

**Use when:**
- ✅ Most common use case
- ✅ Simple opacity feedback works
- ✅ Any component needs to be touchable

#### **TouchableHighlight**

```jsx
import { TouchableHighlight, Text, View } from 'react-native';

<TouchableHighlight
  onPress={() => console.log('Pressed')}
  underlayColor="#ddd"  // Background color when pressed
  onShowUnderlay={() => {}}
  onHideUnderlay={() => {}}
>
  <View style={styles.button}>
    <Text>Press Me</Text>
  </View>
</TouchableHighlight>
```

**Use when:**
- ✅ Need background color feedback
- ✅ Simulating native button behavior
- ⚠️ Must have exactly ONE child

#### **TouchableWithoutFeedback**

```jsx
import { TouchableWithoutFeedback, View, Text } from 'react-native';

<TouchableWithoutFeedback
  onPress={() => console.log('Pressed')}
>
  <View style={styles.button}>
    <Text>Press Me</Text>
  </View>
</TouchableWithoutFeedback>
```

**Use when:**
- ✅ Need to detect touch without visual feedback
- ✅ Dismissing keyboard on background tap
- ❌ Avoid for most UI elements (poor UX without feedback)

#### **Pressable (Recommended)**

```jsx
import { Pressable, Text } from 'react-native';

<Pressable
  onPress={() => console.log('Pressed')}
  onPressIn={() => console.log('Press started')}
  onPressOut={() => console.log('Press ended')}
  onLongPress={() => console.log('Long press')}
  disabled={false}
  style={({ pressed }) => [
    styles.button,
    pressed && styles.pressed
  ]}
>
  {({ pressed }) => (
    <Text style={pressed && styles.textPressed}>
      {pressed ? 'Pressed!' : 'Press Me'}
    </Text>
  )}
</Pressable>
```

**Use when:**
- ✅ Need fine-grained control
- ✅ Custom press states
- ✅ Building new components (modern API)
- ✅ Advanced touch interactions

---

### Question 2: Detailed Comparison

#### **TouchableOpacity vs TouchableHighlight**

```jsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';

const ComparisonDemo = () => {
  return (
    <View style={styles.container}>
      {/* TouchableOpacity - Opacity change */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => console.log('Opacity')}
        activeOpacity={0.6}
      >
        <Text style={styles.buttonText}>TouchableOpacity</Text>
      </TouchableOpacity>

      {/* TouchableHighlight - Background change */}
      <TouchableHighlight
        style={styles.button}
        onPress={() => console.log('Highlight')}
        underlayColor="#0056b3"
      >
        <Text style={styles.buttonText}>TouchableHighlight</Text>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

#### **Pressable Advanced Example**

```jsx
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

const PressableButton = ({ title, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={() => console.log('Long pressed')}
      delayLongPress={500}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
      android_ripple={{
        color: 'rgba(255, 255, 255, 0.3)',
        borderless: false,
      }}
    >
      {({ pressed }) => (
        <Text style={[
          styles.text,
          pressed && styles.textPressed,
        ]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: '#0056b3',
    transform: [{ scale: 0.96 }],
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  textPressed: {
    opacity: 0.7,
  },
});
```

---

### Question 3: Press Events and Custom Feedback

#### **All Press Events**

```jsx
<Pressable
  // Basic press
  onPress={() => console.log('Pressed')}

  // Long press
  onLongPress={() => console.log('Long pressed')}
  delayLongPress={500}  // ms before long press triggers

  // Press lifecycle
  onPressIn={() => console.log('Touch started')}
  onPressOut={() => console.log('Touch ended')}

  // Hover (web/desktop)
  onHoverIn={() => console.log('Hover started')}
  onHoverOut={() => console.log('Hover ended')}

  // Focus (web/desktop)
  onFocus={() => console.log('Focused')}
  onBlur={() => console.log('Blurred')}

  // Disabled state
  disabled={false}
>
  <Text>Interactive Button</Text>
</Pressable>
```

#### **Custom Touch Feedback**

```jsx
import React, { useState } from 'react';
import {
  Pressable,
  Text,
  View,
  Animated,
  StyleSheet,
} from 'react-native';

const CustomButton = ({ title, onPress }) => {
  const [scale] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.button,
          { transform: [{ scale }] },
        ]}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

---

## 💡 Complete Interactive Example

```jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Pressable,
  Keyboard,
  StyleSheet,
} from 'react-native';

const TouchableShowcase = () => {
  const [pressCount, setPressCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Touchable Components</Text>
      <Text style={styles.counter}>Pressed: {pressCount} times</Text>

      {/* TouchableOpacity */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setPressCount(pressCount + 1)}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>TouchableOpacity</Text>
      </TouchableOpacity>

      {/* TouchableHighlight */}
      <TouchableHighlight
        style={styles.button}
        onPress={() => setPressCount(pressCount + 1)}
        underlayColor="#0056b3"
      >
        <Text style={styles.buttonText}>TouchableHighlight</Text>
      </TouchableHighlight>

      {/* Pressable with custom feedback */}
      <Pressable
        onPress={() => setPressCount(pressCount + 1)}
        onLongPress={() => setPressCount(0)}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        {({ pressed }) => (
          <Text style={styles.buttonText}>
            Pressable (Long press to reset)
          </Text>
        )}
      </Pressable>

      {/* TouchableWithoutFeedback - Dismiss keyboard */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.dismissArea}>
          <Text style={styles.dismissText}>
            Tap here to dismiss keyboard
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  counter: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonPressed: {
    backgroundColor: '#0056b3',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  dismissArea: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  dismissText: {
    textAlign: 'center',
    color: '#666',
  },
});

export default TouchableShowcase;
```

---

## 🎯 Component Comparison Table

| Feature | TouchableOpacity | TouchableHighlight | Pressable |
|---------|-----------------|-------------------|-----------|
| **Feedback Type** | Opacity change | Background color | Custom |
| **activeOpacity** | ✅ Yes | ❌ No | Custom |
| **underlayColor** | ❌ No | ✅ Yes | Custom |
| **Children Function** | ❌ No | ❌ No | ✅ Yes |
| **Style Function** | ❌ No | ❌ No | ✅ Yes |
| **Android Ripple** | ❌ No | ❌ No | ✅ Yes |
| **Hover Events** | ❌ No | ❌ No | ✅ Yes |
| **Hit Slop** | ✅ Yes | ✅ Yes | ✅ Yes |
| **React Recommended** | Legacy | Legacy | ✅ Modern API |

---

## 🚀 Follow-up Questions

**Q1**: What is hitSlop and why is it important?
**A**: hitSlop extends the touchable area beyond the visible bounds, important for small touchable elements to meet accessibility guidelines (minimum 44x44 points).

**Q2**: What's the difference between onPress and onPressIn?
**A**: onPress fires when touch is released inside the bounds. onPressIn fires immediately when touch starts.

**Q3**: How do you prevent accidental double presses?
**A**: Disable the button after first press, use debouncing, or track press timestamps.

**Q4**: What is android_ripple?
**A**: A Pressable prop that creates Android's native ripple effect on touch.

---

## ✅ Common Mistakes

❌ **Mistake 1**: Multiple children in TouchableHighlight
```jsx
// ❌ Won't work - needs single child
<TouchableHighlight>
  <Text>Button</Text>
  <Icon name="arrow" />
</TouchableHighlight>

// ✅ Wrap in View
<TouchableHighlight>
  <View>
    <Text>Button</Text>
    <Icon name="arrow" />
  </View>
</TouchableHighlight>
```

❌ **Mistake 2**: Not setting hitSlop for small buttons
```jsx
// ❌ Hard to tap
<TouchableOpacity style={{ width: 20, height: 20 }}>
  <Icon name="close" size={20} />
</TouchableOpacity>

// ✅ Easier to tap
<TouchableOpacity
  style={{ width: 20, height: 20 }}
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
>
  <Icon name="close" size={20} />
</TouchableOpacity>
```

❌ **Mistake 3**: Using TouchableWithoutFeedback for buttons
```jsx
// ❌ Poor UX - no feedback
<TouchableWithoutFeedback onPress={submit}>
  <View style={styles.button}>
    <Text>Submit</Text>
  </View>
</TouchableWithoutFeedback>

// ✅ Visual feedback
<TouchableOpacity onPress={submit}>
  <View style={styles.button}>
    <Text>Submit</Text>
  </View>
</TouchableOpacity>
```

---

**Difficulty**: 🟢 Easy
**Estimated Time**: 10-12 minutes
**Next Problem**: [#009: ScrollView Basics →](./problem-009-scrollview-basics.md)

---

*This problem is part of the React Native Interview Problems Collection*
