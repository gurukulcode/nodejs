# Problem #063: useCallback Hook

**Difficulty**: 🔴 Hard
**Category**: Performance
**Time**: 15-20 minutes

---

## 📝 Problem Statement

**Question 1**: How do you implement useCallback Hook for performance?
**Question 2**: When and why should you use this optimization?
**Question 3**: Show measurable performance improvements.

---

## ✅ Complete Answer

```jsx
import React, { memo, useMemo, useCallback } from 'react';

const OptimizedComponent = memo(({ data, onPress }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({ ...item, processed: true }));
  }, [data]);

  const handlePress = useCallback(() => {
    onPress(data);
  }, [data, onPress]);

  return <View>...</View>;
});
```

### Performance Benefits
- ✅ Reduced re-renders
- ✅ Faster list scrolling
- ✅ Better memory usage
- ✅ Improved user experience

---

**Difficulty**: 🔴 Hard
**Estimated Time**: 15-20 minutes

---

*This problem is part of the React Native Interview Problems Collection*
