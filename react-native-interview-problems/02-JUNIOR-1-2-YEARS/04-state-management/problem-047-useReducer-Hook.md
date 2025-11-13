# Problem #047: useReducer Hook

**Difficulty**: 🟡 Medium
**Category**: State Management
**Time**: 15-18 minutes

---

## 📝 Problem Statement

**Question 1**: How do you implement useReducer Hook?
**Question 2**: When should you use this approach?
**Question 3**: Show complete implementation with examples.

---

## ✅ Complete Answer

```jsx
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, setState] = useState({ user: null });

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
```

---

**Difficulty**: 🟡 Medium
**Estimated Time**: 15-18 minutes

---

*This problem is part of the React Native Interview Problems Collection*
