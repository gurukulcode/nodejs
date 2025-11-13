# Problem #058: Secure Storage

**Difficulty**: 🟡 Medium
**Category**: Storage & Persistence
**Time**: 12-15 minutes

---

## 📝 Problem Statement

**Question 1**: How do you implement Secure Storage?
**Question 2**: When should you use this storage approach?
**Question 3**: Show implementation with best practices.

---

## ✅ Complete Answer

```jsx
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Save error:', error);
  }
};

const loadData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Load error:', error);
    return null;
  }
};
```

---

**Difficulty**: 🟡 Medium
**Estimated Time**: 12-15 minutes

---

*This problem is part of the React Native Interview Problems Collection*
