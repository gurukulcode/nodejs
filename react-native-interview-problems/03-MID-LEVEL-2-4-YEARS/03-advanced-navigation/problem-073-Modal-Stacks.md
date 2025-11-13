# Problem #073: Modal Stacks

**Difficulty**: 🔴 Hard
**Category**: Advanced Navigation
**Time**: 18-20 minutes

---

## 📝 Problem Statement

**Question 1**: How do you implement Modal Stacks?
**Question 2**: Handle complex navigation scenarios.
**Question 3**: Show real-world navigation patterns.

---

## ✅ Complete Answer

```jsx
import { NavigationContainer, CommonActions } from '@react-navigation/native';

const linking = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      Home: 'home',
      Profile: 'profile/:id',
    },
  },
};

const App = () => (
  <NavigationContainer linking={linking}>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
```

---

**Difficulty**: 🔴 Hard
**Estimated Time**: 18-20 minutes

---

*This problem is part of the React Native Interview Problems Collection*
