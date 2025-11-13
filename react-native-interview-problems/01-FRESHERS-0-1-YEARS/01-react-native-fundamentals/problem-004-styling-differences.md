# Problem #004: Styling Differences from Web

**Difficulty**: 🟢 Easy
**Category**: React Native Fundamentals
**Time**: 12-15 minutes

---

## 📝 Problem Statement

**Question 1**: How does styling in React Native differ from CSS in web development?

**Question 2**: Explain the StyleSheet API and its benefits over inline styles.

**Question 3**: What CSS properties are not available in React Native and what are the alternatives?

---

## 🎯 What Interviewers Look For

- Understanding of StyleSheet API
- Knowledge of supported and unsupported CSS properties
- Awareness of flexbox differences
- Practical styling implementation skills

---

## ✅ Complete Answer

### Question 1: Styling Differences

#### **No CSS Files**

**Web (CSS):**
```css
/* styles.css */
.container {
  display: flex;
  background-color: #fff;
  padding: 20px;
}

.title {
  font-size: 24px;
  color: #333;
}
```

**React Native (JavaScript):**
```jsx
// No external CSS files - use StyleSheet API
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#333',
  },
});
```

#### **Camel Case Properties**

```jsx
// ❌ Web CSS (kebab-case)
{
  'background-color': '#fff',
  'font-size': '16px',
  'text-align': 'center'
}

// ✅ React Native (camelCase)
{
  backgroundColor: '#fff',
  fontSize: 16,  // No 'px' suffix!
  textAlign: 'center'
}
```

#### **No Units (Mostly)**

```jsx
// Web
{
  fontSize: '16px',
  width: '100%',
  padding: '10px 20px'
}

// React Native
{
  fontSize: 16,        // Numbers are density-independent pixels
  width: '100%',       // Percentages work
  padding: 10,         // Single value or...
  paddingVertical: 10,
  paddingHorizontal: 20
}
```

#### **Flexbox by Default**

```jsx
// Web: Must specify display
<div style={{ display: 'flex' }}>

// React Native: Flexbox by default
<View>  {/* Already flex container */}

// Web: flex-direction defaults to 'row'
// React Native: flex-direction defaults to 'column'
```

#### **Limited Box Model**

**Web has many display options:**
```css
display: block;
display: inline;
display: inline-block;
display: grid;
display: table;
```

**React Native only has flexbox:**
```jsx
// Only flexbox layout
// No display: grid, table, inline, etc.
{
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center'
}
```

---

### Question 2: StyleSheet API

#### **Basic Usage**

```jsx
import { StyleSheet, View, Text } from 'react-native';

// Define styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

// Use styles
function MyComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello</Text>
    </View>
  );
}
```

#### **StyleSheet.create() Benefits**

**1. Validation:**
```jsx
const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    colour: 'red',  // ⚠️ Warning: typo detected
  },
});
```

**2. Performance:**
```jsx
// ❌ Inline styles (recreated on every render)
<View style={{ flex: 1, padding: 20 }} />

// ✅ StyleSheet (created once, referenced by ID)
<View style={styles.container} />
```

**3. Code Organization:**
```jsx
// Keep styles separate from JSX
const Component = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Title</Text>
    <Text style={styles.subtitle}>Subtitle</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#666' },
});
```

#### **Multiple Styles**

```jsx
// Array of styles (right-most takes precedence)
<View style={[styles.base, styles.large]} />

// Conditional styles
<View style={[
  styles.base,
  isActive && styles.active,
  { marginTop: customMargin }  // Dynamic inline style
]} />

// Example
const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: '#007AFF',
  },
  disabled: {
    backgroundColor: '#ccc',
    opacity: 0.5,
  },
});

<TouchableOpacity
  style={[styles.button, disabled && styles.disabled]}
  disabled={disabled}
>
  <Text>Submit</Text>
</TouchableOpacity>
```

#### **Dynamic Styles**

```jsx
// With variables
const HEADER_HEIGHT = 60;
const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
};

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: COLORS.primary,
  },
});

// With functions
const createStyles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.background,
  },
  text: {
    color: theme.text,
  },
});

// Usage
const styles = createStyles(darkMode ? darkTheme : lightTheme);
```

---

### Question 3: Unsupported CSS Properties

#### **❌ Not Available in React Native**

**1. No Float:**
```jsx
// ❌ Doesn't exist
float: 'left';
clear: 'both';

// ✅ Use flexbox instead
{
  flexDirection: 'row',
  justifyContent: 'space-between'
}
```

**2. No Display Options:**
```jsx
// ❌ Only flexbox
display: 'grid';
display: 'inline';
display: 'block';

// ✅ Everything is flex
{
  flex: 1,
  flexDirection: 'column'
}
```

**3. No Position: Fixed:**
```jsx
// ❌ Limited position support
position: 'fixed';

// ✅ Available: 'relative' and 'absolute'
{
  position: 'absolute',
  top: 0,
  left: 0
}
```

**4. No CSS Animations:**
```jsx
// ❌ No @keyframes or transition
transition: 'all 0.3s ease';
animation: slideIn 0.5s;

// ✅ Use Animated API
import { Animated } from 'react-native';
const fadeAnim = new Animated.Value(0);

Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 500,
}).start();
```

**5. No Box Shadow (Android):**
```jsx
// ✅ iOS shadow properties
{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
}

// ✅ Android elevation
{
  elevation: 5,
}

// ✅ Platform-specific
import { Platform } from 'react-native';

{
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
}
```

**6. Limited Transform:**
```jsx
// ❌ Not all CSS transforms
transform: rotateX(45deg);
skew(30deg);

// ✅ Supported transforms
{
  transform: [
    { translateX: 10 },
    { translateY: 20 },
    { rotate: '45deg' },
    { scale: 1.5 },
  ]
}
```

---

## 💡 Complete Styling Example

```jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';

const StyledCard = () => {
  const [liked, setLiked] = useState(false);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Styled Card</Text>
        <Text style={styles.badge}>NEW</Text>
      </View>

      {/* Content */}
      <Text style={styles.description}>
        This card demonstrates various styling techniques in React Native.
      </Text>

      {/* Tags */}
      <View style={styles.tagContainer}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>React Native</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>Styling</Text>
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={[styles.button, liked && styles.buttonLiked]}
        onPress={() => setLiked(!liked)}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, liked && styles.buttonTextLiked]}>
          {liked ? '❤️ Liked' : '🤍 Like'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Card Container with shadow
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    // Platform-specific shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  // Header with flexbox
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  // Title text
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },

  // Badge with absolute positioning
  badge: {
    backgroundColor: '#FF6B6B',
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',  // Ensures borderRadius clips content
  },

  // Description text
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },

  // Flexbox row for tags
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },

  // Individual tag
  tag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },

  tagText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '500',
  },

  // Button with multiple states
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonLiked: {
    backgroundColor: '#FF6B6B',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  buttonTextLiked: {
    // Text color stays white
  },
});

export default StyledCard;
```

---

## 🎯 Key Styling Differences Summary

| Feature | Web CSS | React Native |
|---------|---------|--------------|
| **Format** | CSS files | JavaScript objects |
| **Property Names** | kebab-case | camelCase |
| **Units** | px, em, rem, % | Numbers (dp), % |
| **Flexbox Default** | No | Yes (column) |
| **Box Model** | Full | Flexbox only |
| **Shadow** | box-shadow | iOS: shadow*, Android: elevation |
| **Animations** | CSS animations | Animated API |
| **Media Queries** | @media | Dimensions API |
| **Selectors** | Classes, IDs, etc. | Style objects |
| **Cascade** | Yes | No |

---

## 🚀 Follow-up Questions

**Q1**: How do you handle responsive design in React Native?
**A**: Use Dimensions API, useWindowDimensions hook, or percentage values. Also consider using responsive libraries like react-native-responsive-screen.

**Q2**: Can you use Sass or Less in React Native?
**A**: No, because React Native doesn't use CSS. You can use TypeScript or create JavaScript style utilities instead.

**Q3**: How do you create reusable style themes?
**A**: Create a theme object and reference it in your styles, or use Context API to manage theme state globally.

**Q4**: What's the performance impact of inline styles vs StyleSheet?
**A**: Inline styles are recreated on every render. StyleSheet.create optimizes by creating style IDs that can be reused.

---

## ✅ Common Mistakes

❌ **Mistake 1**: Using CSS syntax
```jsx
// ❌ Wrong
{ 'font-size': '16px' }

// ✅ Correct
{ fontSize: 16 }
```

❌ **Mistake 2**: Adding 'px' to numbers
```jsx
// ❌ Wrong
{ width: '100px' }

// ✅ Correct
{ width: 100 }
```

❌ **Mistake 3**: Using unsupported properties
```jsx
// ❌ Won't work
{ display: 'grid', float: 'left' }

// ✅ Use flexbox
{ flexDirection: 'row', flex: 1 }
```

❌ **Mistake 4**: Forgetting platform differences
```jsx
// ❌ Shadow won't work on Android
{ shadowColor: '#000', shadowRadius: 5 }

// ✅ Use Platform.select
{
  ...Platform.select({
    ios: { shadowColor: '#000', shadowRadius: 5 },
    android: { elevation: 5 },
  })
}
```

---

## 📊 Flexbox Default Values

| Property | Web Default | RN Default |
|----------|-------------|------------|
| **flexDirection** | row | column |
| **position** | static | relative |
| **display** | block/inline | flex |
| **flexShrink** | 1 | 0 |

---

## 📚 Additional Reading

- [React Native Styling](https://reactnative.dev/docs/style)
- [StyleSheet API](https://reactnative.dev/docs/stylesheet)
- [Flexbox Layout](https://reactnative.dev/docs/flexbox)
- [Platform Specific Code](https://reactnative.dev/docs/platform-specific-code)

---

## ✅ Interview Tips

**Do:**
- ✅ Emphasize StyleSheet.create benefits
- ✅ Explain platform differences (shadows, etc.)
- ✅ Show understanding of flexbox defaults
- ✅ Mention performance considerations

**Don't:**
- ❌ Claim it's "just like CSS"
- ❌ Forget camelCase property names
- ❌ Use CSS units (px, em, rem)
- ❌ Ignore platform-specific styling needs

---

**Difficulty**: 🟢 Easy
**Estimated Time**: 12-15 minutes
**Next Problem**: [#005: View vs Div →](./problem-005-view-vs-div.md)

---

*This problem is part of the React Native Interview Problems Collection*
