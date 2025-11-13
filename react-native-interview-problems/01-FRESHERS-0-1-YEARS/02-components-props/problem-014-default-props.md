# Problem #014: Default Props and PropTypes

**Difficulty**: 🟢 Easy
**Category**: Components & Props
**Time**: 8-10 minutes

---

## 📝 Problem Statement

**Question 1**: How do you set default values for props?

**Question 2**: What is PropTypes and why should you use it?

**Question 3**: How do you validate prop types in React Native?

---

## ✅ Complete Answer

### Question 1: Default Props

```jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Method 1: ES6 default parameters
const Button = ({
  title = 'Click Me',
  onPress = () => {},
  disabled = false,
  variant = 'primary',
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, styles[variant]]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

// Method 2: defaultProps (legacy but still valid)
Button.defaultProps = {
  title: 'Click Me',
  disabled: false,
  variant: 'primary',
};

// Usage
const App = () => (
  <View>
    <Button />  {/* Uses all defaults */}
    <Button title="Submit" />  {/* Override title */}
    <Button variant="secondary" disabled />  {/* Override multiple */}
  </View>
);

const styles = StyleSheet.create({
  button: { padding: 15, borderRadius: 8, margin: 5 },
  primary: { backgroundColor: '#007AFF' },
  secondary: { backgroundColor: '#666' },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
```

---

### Question 2: PropTypes Validation

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet } from 'react-native';

const UserCard = ({ name, age, email, avatar, isActive, role }) => {
  return (
    <View style={styles.card}>
      {avatar && <Image source={{ uri: avatar }} style={styles.avatar} />}
      <Text style={styles.name}>{name}</Text>
      <Text>Age: {age}</Text>
      <Text>Email: {email}</Text>
      <Text>Role: {role}</Text>
      {isActive && <Text style={styles.badge}>Active</Text>}
    </View>
  );
};

// PropTypes validation
UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  email: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  isActive: PropTypes.bool,
  role: PropTypes.oneOf(['admin', 'user', 'guest']),
  metadata: PropTypes.shape({
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }),
  tags: PropTypes.arrayOf(PropTypes.string),
};

// Default props
UserCard.defaultProps = {
  isActive: false,
  role: 'user',
  tags: [],
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8 },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  name: { fontSize: 18, fontWeight: 'bold' },
  badge: { color: 'green', fontWeight: '600' },
});

export default UserCard;
```

---

### Question 3: TypeScript Alternative (Modern Approach)

```typescript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Define prop types with TypeScript interface
interface ButtonProps {
  title?: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

// Component with typed props and defaults
const Button: React.FC<ButtonProps> = ({
  title = 'Click Me',
  onPress = () => {},
  disabled = false,
  variant = 'primary',
  size = 'medium',
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        styles[variant],
        styles[`size_${size}`],
      ]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { borderRadius: 8, alignItems: 'center' },
  primary: { backgroundColor: '#007AFF' },
  secondary: { backgroundColor: '#666' },
  danger: { backgroundColor: '#ff3b30' },
  size_small: { padding: 8, fontSize: 12 },
  size_medium: { padding: 12, fontSize: 14 },
  size_large: { padding: 16, fontSize: 16 },
  buttonText: { color: '#fff', fontWeight: '600' },
});

export default Button;
```

---

**Difficulty**: 🟢 Easy
**Estimated Time**: 8-10 minutes

---

*This problem is part of the React Native Interview Problems Collection*
