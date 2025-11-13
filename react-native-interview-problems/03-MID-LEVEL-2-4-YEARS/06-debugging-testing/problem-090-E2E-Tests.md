# Problem #090: E2E Tests

**Difficulty**: 🔴 Hard
**Category**: Debugging & Testing
**Time**: 18-20 minutes

---

## 📝 Problem Statement

**Question 1**: How do you use E2E Tests?
**Question 2**: Write comprehensive tests for React Native.
**Question 3**: Debug complex issues effectively.

---

## ✅ Complete Answer

```jsx
import { render, fireEvent } from '@testing-library/react-native';

describe('Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Component />);
    expect(getByText('Hello')).toBeTruthy();
  });

  it('handles press', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button onPress={onPress} />);
    fireEvent.press(getByText('Click'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

---

**Difficulty**: 🔴 Hard
**Estimated Time**: 18-20 minutes

---

*This problem is part of the React Native Interview Problems Collection*
