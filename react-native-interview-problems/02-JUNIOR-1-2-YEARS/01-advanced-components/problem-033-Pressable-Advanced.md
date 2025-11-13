# Problem #033: Pressable Advanced

**Difficulty**: 🟡 Medium
**Category**: Advanced Components
**Time**: 12-15 minutes

---

## 📝 Problem Statement

**Question 1**: How do you implement Pressable Advanced in React Native?
**Question 2**: What are advanced patterns and use cases?
**Question 3**: Handle edge cases and platform differences.

---

## ✅ Complete Answer

### Implementation

```jsx
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const Component = () => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Text>Show Modal</Text>
      </TouchableOpacity>
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <Text>Pressable Advanced Example</Text>
          <TouchableOpacity onPress={() => setVisible(false)}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
});
```

---

**Difficulty**: 🟡 Medium
**Estimated Time**: 12-15 minutes

---

*This problem is part of the React Native Interview Problems Collection*
