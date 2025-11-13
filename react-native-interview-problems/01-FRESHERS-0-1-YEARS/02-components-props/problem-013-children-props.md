# Problem #013: Children Props Pattern

**Difficulty**: 🟢 Easy
**Category**: Components & Props
**Time**: 8-10 minutes

---

## 📝 Problem Statement

**Question 1**: What is the children prop and how do you use it?

**Question 2**: How do you create wrapper/container components using children?

**Question 3**: When should you use children vs explicit props?

---

## ✅ Complete Answer

### Question 1: Children Prop Basics

```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Component that uses children
const Card = ({ children, title }) => {
  return (
    <View style={styles.card}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
};

// Usage
const App = () => {
  return (
    <View style={styles.container}>
      <Card title="User Info">
        <Text>Name: John Doe</Text>
        <Text>Email: john@example.com</Text>
      </Card>

      <Card>
        <Text>Any content can go here</Text>
        <Text>Multiple children are supported</Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  card: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
});
```

---

### Question 2: Wrapper Components

```jsx
import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';

// Reusable container with shadow
const ShadowCard = ({ children }) => {
  return (
    <View style={styles.shadowCard}>
      {children}
    </View>
  );
};

// Reusable section with header
const Section = ({ title, children }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );
};

// Usage
const ProfileScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <ShadowCard>
        <Section title="Personal Information">
          <Text>Name: John Doe</Text>
          <Text>Age: 30</Text>
        </Section>
      </ShadowCard>

      <ShadowCard>
        <Section title="Contact">
          <Text>Email: john@example.com</Text>
          <Text>Phone: +1234567890</Text>
        </Section>
      </ShadowCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  shadowCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: { marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  sectionContent: { paddingLeft: 10 },
});

export default ProfileScreen;
```

---

### Question 3: Children vs Explicit Props

```jsx
// ✅ Good use of children: Flexible content
const Modal = ({ children, visible, onClose }) => {
  if (!visible) return null;
  return (
    <View style={styles.modal}>
      <View style={styles.modalContent}>
        {children}
      </View>
      <TouchableOpacity onPress={onClose}>
        <Text>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

// ✅ Good use of explicit props: Specific structure
const UserCard = ({ name, email, avatar, isActive }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: avatar }} style={styles.avatar} />
      <Text>{name}</Text>
      <Text>{email}</Text>
      {isActive && <Text>Active</Text>}
    </View>
  );
};
```

---

**Difficulty**: 🟢 Easy
**Estimated Time**: 8-10 minutes

---

*This problem is part of the React Native Interview Problems Collection*
