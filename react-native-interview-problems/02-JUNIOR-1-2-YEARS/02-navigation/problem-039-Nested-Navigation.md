# Problem #039: Nested Navigation

**Difficulty**: 🟡 Medium
**Category**: Navigation
**Time**: 12-15 minutes

---

## 📝 Problem Statement

**Question 1**: How do you implement Nested Navigation?
**Question 2**: What are configuration options?
**Question 3**: Show practical navigation patterns.

---

## ✅ Complete Answer

```jsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const AppNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);
```

---

**Difficulty**: 🟡 Medium
**Estimated Time**: 12-15 minutes

---

*This problem is part of the React Native Interview Problems Collection*
