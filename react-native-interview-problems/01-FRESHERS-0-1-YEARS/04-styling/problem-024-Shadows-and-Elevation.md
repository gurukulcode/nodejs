# Problem #024: Shadows and Elevation

**Difficulty**: 🟢 Easy
**Category**: Styling
**Time**: 8-10 minutes

---

## 📝 Problem Statement

**Question 1**: How does Shadows and Elevation work in React Native?
**Question 2**: What are the key features and best practices?
**Question 3**: Demonstrate practical implementation.

---

## ✅ Complete Answer

### Basic Implementation

```jsx
import { StyleSheet, View, Text } from 'react-native';

const Component = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Shadows and Elevation Example</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    fontSize: 16,
  },
});
```

### Key Points

- ✅ Use StyleSheet.create for performance
- ✅ Camel case property names
- ✅ Platform-specific when needed
- ❌ Avoid inline styles in loops

---

**Difficulty**: 🟢 Easy
**Estimated Time**: 8-10 minutes

---

*This problem is part of the React Native Interview Problems Collection*
