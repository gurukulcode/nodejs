# Lesson 5: Testing React Native Applications

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Write unit tests with Jest
- Test components with React Native Testing Library
- Mock native modules and APIs
- Implement integration tests
- Understand testing best practices

---

## Why Test?

Benefits of testing:
- ✅ Catch bugs early
- ✅ Refactor with confidence
- ✅ Document code behavior
- ✅ Improve code quality
- ✅ Faster development in long run

---

## Jest Setup

Jest comes pre-configured with React Native:

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "preset": "react-native",
    "setupFilesAfterEnv": ["<rootDir>/jest.setup.js"]
  }
}
```

---

## React Native Testing Library

### Installation

```bash
npm install --save-dev @testing-library/react-native
npm install --save-dev @testing-library/jest-native
```

### Setup

```js
// jest.setup.js
import '@testing-library/jest-native/extend-expect';
```

---

## Basic Component Testing

### Simple Component Test

```jsx
// Button.js
import { TouchableOpacity, Text } from 'react-native';

export function Button({ onPress, title }) {
  return (
    <TouchableOpacity onPress={onPress} testID="button">
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}

// Button.test.js
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button title="Click me" />);
    expect(getByText('Click me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByTestID } = render(
      <Button title="Click me" onPress={onPressMock} />
    );

    fireEvent.press(getByTestID('button'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
```

---

## Testing Hooks

```jsx
// useCounter.js
import { useState } from 'react';

export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}

// useCounter.test.js
import { renderHook, act } from '@testing-library/react-native';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('initializes with custom value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('increments count', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('decrements count', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });

  it('resets to initial value', () => {
    const { result } = renderHook(() => useCounter(10));

    act(() => {
      result.current.increment();
      result.current.increment();
      result.current.reset();
    });

    expect(result.current.count).toBe(10);
  });
});
```

---

## Mocking Native Modules

```jsx
// __mocks__/@react-native-async-storage/async-storage.js
export default {
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
};

// StorageService.test.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveUser, getUser } from './storageService';

describe('Storage Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('saves user to storage', async () => {
    const user = { id: 1, name: 'John' };

    await saveUser(user);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify(user)
    );
  });

  it('retrieves user from storage', async () => {
    const user = { id: 1, name: 'John' };
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(user));

    const result = await getUser();

    expect(result).toEqual(user);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('user');
  });
});
```

---

## Testing API Calls

```jsx
// userService.js
import axios from 'axios';

export async function fetchUser(userId) {
  const response = await axios.get(`/users/${userId}`);
  return response.data;
}

// userService.test.js
import axios from 'axios';
import { fetchUser } from './userService';

jest.mock('axios');

describe('User Service', () => {
  it('fetches user successfully', async () => {
    const mockUser = { id: 1, name: 'John Doe' };
    axios.get.mockResolvedValueOnce({ data: mockUser });

    const result = await fetchUser(1);

    expect(result).toEqual(mockUser);
    expect(axios.get).toHaveBeenCalledWith('/users/1');
  });

  it('handles fetch error', async () => {
    const error = new Error('Network error');
    axios.get.mockRejectedValueOnce(error);

    await expect(fetchUser(1)).rejects.toThrow('Network error');
  });
});
```

---

## Testing Context

```jsx
// AuthContext.test.js
import { renderHook, act } from '@testing-library/react-native';
import { AuthProvider, useAuth } from './AuthContext';

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe('AuthContext', () => {
  it('provides initial state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('logs in user', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeTruthy();
  });

  it('logs out user', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@example.com', 'password');
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
```

---

## Snapshot Testing

```jsx
// ProfileCard.test.js
import { render } from '@testing-library/react-native';
import { ProfileCard } from './ProfileCard';

describe('ProfileCard', () => {
  it('matches snapshot', () => {
    const user = {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://example.com/avatar.jpg',
    };

    const { toJSON } = render(<ProfileCard user={user} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
```

---

## Testing Forms

```jsx
// LoginForm.test.js
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('validates email format', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginForm />);

    const emailInput = getByPlaceholderText('Email');
    fireEvent.changeText(emailInput, 'invalid-email');

    const submitButton = getByText('Login');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText('Invalid email address')).toBeTruthy();
    });
  });

  it('requires password', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginForm />);

    const emailInput = getByPlaceholderText('Email');
    fireEvent.changeText(emailInput, 'test@example.com');

    const submitButton = getByText('Login');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText('Password is required')).toBeTruthy();
    });
  });

  it('submits form with valid data', async () => {
    const onSubmit = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <LoginForm onSubmit={onSubmit} />
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
```

---

## Integration Testing

```jsx
// TodoApp.test.js
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { TodoApp } from './TodoApp';

describe('TodoApp Integration', () => {
  it('adds and displays a new todo', async () => {
    const { getByPlaceholderText, getByText, getByTestID } = render(<TodoApp />);

    // Type in input
    const input = getByPlaceholderText('Add a todo...');
    fireEvent.changeText(input, 'Buy groceries');

    // Press add button
    const addButton = getByText('Add');
    fireEvent.press(addButton);

    // Verify todo was added
    await waitFor(() => {
      expect(getByText('Buy groceries')).toBeTruthy();
    });

    // Verify input was cleared
    expect(input.props.value).toBe('');
  });

  it('toggles todo completion', async () => {
    const { getByText, getByTestID } = render(<TodoApp />);

    // Add a todo
    const input = getByPlaceholderText('Add a todo...');
    fireEvent.changeText(input, 'Test todo');
    fireEvent.press(getByText('Add'));

    // Wait for todo to appear
    await waitFor(() => {
      expect(getByText('Test todo')).toBeTruthy();
    });

    // Toggle completion
    const todoItem = getByTestID('todo-item-0');
    fireEvent.press(todoItem);

    // Check completed style applied
    await waitFor(() => {
      expect(todoItem).toHaveStyle({ opacity: 0.5 });
    });
  });
});
```

---

## Complete Test Suite Example

```jsx
// Counter.js
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export function Counter({ initialValue = 0, onCountChange }) {
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    onCountChange?.(newCount);
  };

  const decrement = () => {
    const newCount = count - 1;
    setCount(newCount);
    onCountChange?.(newCount);
  };

  const reset = () => {
    setCount(initialValue);
    onCountChange?.(initialValue);
  };

  return (
    <View style={styles.container} testID="counter">
      <Text style={styles.count} testID="count-value">
        {count}
      </Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.button}
          onPress={decrement}
          testID="decrement-button"
        >
          <Text>-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={reset}
          testID="reset-button"
        >
          <Text>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={increment}
          testID="increment-button"
        >
          <Text>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Counter.test.js
import { render, fireEvent } from '@testing-library/react-native';
import { Counter } from './Counter';

describe('Counter Component', () => {
  describe('Rendering', () => {
    it('renders with default value', () => {
      const { getByTestID } = render(<Counter />);
      expect(getByTestID('count-value')).toHaveTextContent('0');
    });

    it('renders with custom initial value', () => {
      const { getByTestID } = render(<Counter initialValue={10} />);
      expect(getByTestID('count-value')).toHaveTextContent('10');
    });

    it('renders all buttons', () => {
      const { getByTestID } = render(<Counter />);
      expect(getByTestID('increment-button')).toBeTruthy();
      expect(getByTestID('decrement-button')).toBeTruthy();
      expect(getByTestID('reset-button')).toBeTruthy();
    });
  });

  describe('Functionality', () => {
    it('increments count', () => {
      const { getByTestID } = render(<Counter />);

      fireEvent.press(getByTestID('increment-button'));
      expect(getByTestID('count-value')).toHaveTextContent('1');

      fireEvent.press(getByTestID('increment-button'));
      expect(getByTestID('count-value')).toHaveTextContent('2');
    });

    it('decrements count', () => {
      const { getByTestID } = render(<Counter initialValue={5} />);

      fireEvent.press(getByTestID('decrement-button'));
      expect(getByTestID('count-value')).toHaveTextContent('4');
    });

    it('resets to initial value', () => {
      const { getByTestID } = render(<Counter initialValue={10} />);

      fireEvent.press(getByTestID('increment-button'));
      fireEvent.press(getByTestID('increment-button'));
      expect(getByTestID('count-value')).toHaveTextContent('12');

      fireEvent.press(getByTestID('reset-button'));
      expect(getByTestID('count-value')).toHaveTextContent('10');
    });
  });

  describe('Callbacks', () => {
    it('calls onCountChange when incrementing', () => {
      const onCountChange = jest.fn();
      const { getByTestID } = render(
        <Counter onCountChange={onCountChange} />
      );

      fireEvent.press(getByTestID('increment-button'));

      expect(onCountChange).toHaveBeenCalledWith(1);
    });

    it('calls onCountChange when decrementing', () => {
      const onCountChange = jest.fn();
      const { getByTestID } = render(
        <Counter initialValue={5} onCountChange={onCountChange} />
      );

      fireEvent.press(getByTestID('decrement-button'));

      expect(onCountChange).toHaveBeenCalledWith(4);
    });
  });

  describe('Snapshots', () => {
    it('matches snapshot', () => {
      const { toJSON } = render(<Counter />);
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
```

---

## Testing Best Practices

### 1. Use testID for Elements

```jsx
// Good
<TouchableOpacity testID="submit-button">
  <Text>Submit</Text>
</TouchableOpacity>

// In test
const button = getByTestID('submit-button');
```

### 2. Test Behavior, Not Implementation

```jsx
// Bad - Testing implementation
it('updates state correctly', () => {
  const { result } = renderHook(() => useCounter());
  expect(result.current.count).toBe(0); // Internal state
});

// Good - Testing behavior
it('displays incremented count', () => {
  const { getByText } = render(<Counter />);
  fireEvent.press(getByText('Increment'));
  expect(getByText('Count: 1')).toBeTruthy();
});
```

### 3. Cleanup After Tests

```jsx
afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});
```

---

## Coverage Reports

```bash
# Run tests with coverage
npm test -- --coverage

# Generate HTML report
npm test -- --coverage --coverageReporters=html
```

---

## 🎯 Practice Exercises

### Exercise 1: Test a Login Form
Write tests for:
- Email validation
- Password requirements
- Form submission
- Error handling
- Loading states

### Exercise 2: Test Todo List
Create integration tests for:
- Adding todos
- Marking complete
- Deleting todos
- Filtering todos
- Local storage persistence

### Exercise 3: Test API Service
Write tests for:
- Successful API calls
- Error handling
- Retry logic
- Request/response interceptors
- Timeout handling

---

## 💡 Key Takeaways

✅ Write tests for critical functionality
✅ Use React Native Testing Library for components
✅ Mock native modules and external dependencies
✅ Test user interactions, not implementation
✅ Aim for high coverage of business logic
✅ Use testID for reliable element selection
✅ Keep tests simple and focused
✅ Run tests in CI/CD pipeline

---

## 🔗 What's Next?

In the next lesson, we'll learn about:
- TypeScript with React Native
- Type safety
- Props typing
- Hooks typing

[Next Lesson: TypeScript →](./06-typescript.md)

---

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Detox E2E Testing](https://wix.github.io/Detox/)

---

*Happy coding! 🚀*
