# Problem #077: Platform Modules

**Difficulty**: 🔴 Hard
**Category**: Native Modules
**Time**: 18-20 minutes

---

## 📝 Problem Statement

**Question 1**: How do you work with Platform Modules?
**Question 2**: Integrate native functionality into React Native.
**Question 3**: Handle platform-specific implementations.

---

## ✅ Complete Answer

```jsx
import { NativeModules, Platform } from 'react-native';
import { request, PERMISSIONS } from 'react-native-permissions';

const requestPermission = async () => {
  const permission = Platform.select({
    ios: PERMISSIONS.IOS.CAMERA,
    android: PERMISSIONS.ANDROID.CAMERA,
  });

  const result = await request(permission);
  return result === 'granted';
};
```

---

**Difficulty**: 🔴 Hard
**Estimated Time**: 18-20 minutes

---

*This problem is part of the React Native Interview Problems Collection*
