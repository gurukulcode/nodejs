# Problem #094: Async Actions

**Difficulty**: 🔴 Hard
**Category**: Advanced State
**Time**: 18-20 minutes

---

## 📝 Problem Statement

**Question 1**: How do you implement Async Actions?
**Question 2**: Manage complex application state.
**Question 3**: Show Redux patterns and best practices.

---

## ✅ Complete Answer

```jsx
import { createSlice, configureStore } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, loading: false },
  reducers: {
    setUser: (state, action) => {
      state.data = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

const store = configureStore({
  reducer: { user: userSlice.reducer },
});
```

---

**Difficulty**: 🔴 Hard
**Estimated Time**: 18-20 minutes

---

*This problem is part of the React Native Interview Problems Collection*
