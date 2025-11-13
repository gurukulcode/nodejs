# Problem #015: Prop Validation and Type Checking

**Difficulty**: 🟢 Easy
**Category**: Components & Props
**Time**: 8-10 minutes

---

## 📝 Problem Statement

**Question 1**: Why is prop validation important in React Native?

**Question 2**: What are the different PropTypes validators available?

**Question 3**: How do you create custom prop validators?

---

## ✅ Complete Answer

### Question 1: Importance of Prop Validation

**Benefits:**
- ✅ Catch bugs early during development
- ✅ Document component API
- ✅ Better IntelliSense in editors
- ✅ Improve code maintainability
- ✅ Help other developers understand your components

```jsx
import PropTypes from 'prop-types';

// Without validation - bugs can occur
const UserCard = ({ user }) => {
  return <Text>{user.name.toUpperCase()}</Text>;  // Crashes if name is undefined
};

// With validation - warns in development
const UserCard = ({ user }) => {
  return <Text>{user.name.toUpperCase()}</Text>;
};

UserCard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};
```

---

### Question 2: PropTypes Validators

```jsx
import PropTypes from 'prop-types';

const Component = ({ props }) => {
  // Component implementation
};

Component.propTypes = {
  // Basic types
  string: PropTypes.string,
  number: PropTypes.number,
  bool: PropTypes.bool,
  func: PropTypes.func,
  object: PropTypes.object,
  array: PropTypes.array,
  symbol: PropTypes.symbol,

  // Required prop
  requiredString: PropTypes.string.isRequired,

  // Specific types
  element: PropTypes.element,  // React element
  elementType: PropTypes.elementType,  // Component type
  node: PropTypes.node,  // Anything renderable

  // Enum
  status: PropTypes.oneOf(['pending', 'success', 'error']),

  // Union types
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),

  // Array of specific type
  numbers: PropTypes.arrayOf(PropTypes.number),
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })),

  // Object with specific shape
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string,
  }),

  // Object with only specific type values
  scores: PropTypes.objectOf(PropTypes.number),

  // Any type (not recommended)
  anything: PropTypes.any,

  // Instance of class
  date: PropTypes.instanceOf(Date),

  // Custom validator
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        `Invalid prop \`${propName}\` supplied to \`${componentName}\`. Validation failed.`
      );
    }
  },
};
```

---

### Question 3: Custom Validators

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const FormInput = ({ value, onChange, type, maxLength, pattern }) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={type}
        maxLength={maxLength}
        style={styles.input}
      />
    </View>
  );
};

// Custom email validator
const emailValidator = (props, propName, componentName) => {
  const email = props[propName];
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Error(
      `Invalid email in prop \`${propName}\` supplied to \`${componentName}\`.`
    );
  }
};

// Custom phone validator
const phoneValidator = (props, propName, componentName) => {
  const phone = props[propName];
  if (phone && !/^\+?[\d\s-()]+$/.test(phone)) {
    return new Error(
      `Invalid phone number in prop \`${propName}\` supplied to \`${componentName}\`.`
    );
  }
};

// Custom range validator
const rangeValidator = (min, max) => {
  return (props, propName, componentName) => {
    const value = props[propName];
    if (value < min || value > max) {
      return new Error(
        `Prop \`${propName}\` in \`${componentName}\` must be between ${min} and ${max}.`
      );
    }
  };
};

FormInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['default', 'email-address', 'numeric', 'phone-pad']),
  maxLength: PropTypes.number,
  pattern: PropTypes.instanceOf(RegExp),
  // Custom validators
  email: emailValidator,
  phone: phoneValidator,
  age: rangeValidator(0, 120),
};

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 5,
    fontSize: 16,
  },
});

export default FormInput;
```

---

**Difficulty**: 🟢 Easy
**Estimated Time**: 8-10 minutes

---

*This problem is part of the React Native Interview Problems Collection*
