# Problem #082: Offline Queue

**Difficulty**: 🔴 Hard
**Category**: Offline-First
**Time**: 18-20 minutes

---

## 📝 Problem Statement

**Question 1**: How do you implement Offline Queue?
**Question 2**: Handle offline scenarios gracefully.
**Question 3**: Sync data when connection restored.

---

## ✅ Complete Answer

```jsx
import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

const useOffline = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });
    return unsubscribe;
  }, []);

  return isOffline;
};
```

---

**Difficulty**: 🔴 Hard
**Estimated Time**: 18-20 minutes

---

*This problem is part of the React Native Interview Problems Collection*
