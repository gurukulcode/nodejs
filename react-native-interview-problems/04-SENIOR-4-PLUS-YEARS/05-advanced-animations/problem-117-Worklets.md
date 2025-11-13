# Problem #117: Worklets

**Difficulty**: 🔴 Hard
**Category**: Advanced Animations
**Time**: 20-25 minutes

---

## 📝 Problem Statement

**Question 1**: How do you create Worklets with Reanimated 2?
**Question 2**: Implement 60fps animations.
**Question 3**: Show complex gesture-based animations.

---

## ✅ Complete Answer

```jsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const Component = () => {
  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withSpring(offset.value) }],
    };
  });

  return (
    <Animated.View style={animatedStyles}>
      <Text>Animated</Text>
    </Animated.View>
  );
};
```

### Reanimated Benefits
- ✅ Runs on UI thread
- ✅ 60fps animations
- ✅ Better performance
- ✅ Advanced gestures

---

**Difficulty**: 🔴 Hard
**Estimated Time**: 20-25 minutes

---

*This problem is part of the React Native Interview Problems Collection*
