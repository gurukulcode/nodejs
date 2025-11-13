# Lesson 2: Core Components & User Interactions

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Master essential React Native components
- Handle user touch interactions
- Work with ScrollView and lists
- Build interactive UIs
- Understand touchable components

---

## Core Components Overview

React Native provides a rich set of built-in components. Let's explore the most important ones.

---

## 1. TouchableOpacity

Makes any component touchable with opacity feedback.

```jsx
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

function CustomButton() {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => alert('Button pressed!')}
      activeOpacity={0.7}  // Opacity when pressed (0-1)
    >
      <Text style={styles.buttonText}>Press Me</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

---

## 2. TouchableHighlight

Similar to TouchableOpacity but shows highlight color when pressed.

```jsx
import { TouchableHighlight, Text } from 'react-native';

<TouchableHighlight
  style={styles.button}
  onPress={() => console.log('Pressed')}
  underlayColor="#0056b3"  // Color when pressed
>
  <Text style={styles.buttonText}>Click Me</Text>
</TouchableHighlight>
```

---

## 3. Pressable (Modern Approach - Recommended)

Most flexible touchable component with more control over press states.

```jsx
import { Pressable, Text, StyleSheet } from 'react-native';

<Pressable
  onPress={() => console.log('Pressed')}
  onLongPress={() => console.log('Long pressed')}
  onPressIn={() => console.log('Press started')}
  onPressOut={() => console.log('Press ended')}
  style={({ pressed }) => [
    styles.button,
    pressed && styles.buttonPressed  // Style when pressed
  ]}
>
  {({ pressed }) => (
    <Text style={styles.buttonText}>
      {pressed ? 'Pressed!' : 'Press Me'}
    </Text>
  )}
</Pressable>

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
  },
  buttonPressed: {
    backgroundColor: '#0056b3',
  },
});
```

---

## 4. ScrollView

For scrollable content (use for small lists).

```jsx
import { ScrollView, Text, View, StyleSheet } from 'react-native';

export default function App() {
  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={true}
      bounces={true}  // iOS bounce effect
    >
      <Text style={styles.title}>Scrollable Content</Text>
      {[...Array(50)].map((_, index) => (
        <View key={index} style={styles.item}>
          <Text>Item {index + 1}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
  },
  item: {
    padding: 20,
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
});
```

### Horizontal ScrollView

```jsx
<ScrollView
  horizontal={true}
  showsHorizontalScrollIndicator={false}
  style={styles.horizontalScroll}
>
  {['Red', 'Green', 'Blue', 'Yellow', 'Purple'].map((color) => (
    <View
      key={color}
      style={[styles.box, { backgroundColor: color.toLowerCase() }]}
    >
      <Text style={styles.boxText}>{color}</Text>
    </View>
  ))}
</ScrollView>

const styles = StyleSheet.create({
  horizontalScroll: {
    paddingVertical: 20,
  },
  box: {
    width: 150,
    height: 150,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  boxText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

---

## 5. TextInput

For user text input.

```jsx
import { useState } from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';

export default function App() {
  const [text, setText] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Enter your name"
        autoCapitalize="words"
      />

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
        secureTextEntry={true}
      />

      <Text style={styles.output}>
        Hello, {text}! Your email is {email}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  output: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});
```

### TextInput Props

| Prop | Description | Example |
|------|-------------|---------|
| `placeholder` | Placeholder text | `"Enter name"` |
| `keyboardType` | Keyboard type | `"email-address"`, `"numeric"`, `"phone-pad"` |
| `secureTextEntry` | Hide text (passwords) | `true` |
| `autoCapitalize` | Auto-capitalize | `"none"`, `"words"`, `"sentences"` |
| `multiline` | Multiple lines | `true` |
| `maxLength` | Max characters | `50` |
| `editable` | Can be edited | `true`/`false` |

---

## 6. Switch

Toggle switch component.

```jsx
import { useState } from 'react';
import { Switch, Text, View, StyleSheet } from 'react-native';

export default function App() {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Dark Mode: {isEnabled ? 'ON' : 'OFF'}
      </Text>
      <Switch
        value={isEnabled}
        onValueChange={setIsEnabled}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isEnabled ? '#007AFF' : '#f4f3f4'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
});
```

---

## 7. ActivityIndicator

Loading spinner.

```jsx
import { ActivityIndicator, View, StyleSheet } from 'react-native';

<View style={styles.loadingContainer}>
  <ActivityIndicator size="large" color="#007AFF" />
</View>

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

---

## 8. Modal

Overlay modal component.

```jsx
import { useState } from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Button
        title="Show Modal"
        onPress={() => setModalVisible(true)}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"  // 'slide', 'fade', 'none'
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Hello Modal!</Text>
            <Text style={styles.modalText}>
              This is a modal dialog
            </Text>
            <Button
              title="Close"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 30,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});
```

---

## 9. Alert

Native alert dialogs.

```jsx
import { Alert, Button, View } from 'react-native';

// Simple alert
<Button
  title="Simple Alert"
  onPress={() => Alert.alert('Alert Title', 'Alert message')}
/>

// Alert with buttons
<Button
  title="Alert with Buttons"
  onPress={() =>
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => console.log('Deleted'), style: 'destructive' }
      ]
    )
  }
/>

// Alert with input (iOS only)
<Button
  title="Prompt"
  onPress={() =>
    Alert.prompt(
      'Enter Name',
      'What is your name?',
      (text) => console.log('Name:', text)
    )
  }
/>
```

---

## 10. SafeAreaView

Renders content within safe area boundaries (important for iPhone notch).

```jsx
import { SafeAreaView, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Content is safe from notch/status bar</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
```

---

## Complete Example: Interactive App

Let's build a simple Todo-style app using these components:

```jsx
import { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { id: Date.now(), text: task }]);
      setTask('');
    } else {
      Alert.alert('Error', 'Please enter a task');
    }
  };

  const deleteTask = (id) => {
    Alert.alert(
      'Delete Task',
      'Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => setTasks(tasks.filter(t => t.id !== id)),
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Tasks</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={task}
          onChangeText={setTask}
          placeholder="Enter a task..."
          onSubmitEditing={addTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.taskList}>
        {tasks.length === 0 ? (
          <Text style={styles.emptyText}>No tasks yet. Add one!</Text>
        ) : (
          tasks.map((item) => (
            <View key={item.id} style={styles.taskItem}>
              <Text style={styles.taskText}>{item.text}</Text>
              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Text style={styles.deleteButton}>×</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  taskList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 50,
  },
  taskItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
    flex: 1,
  },
  deleteButton: {
    fontSize: 32,
    color: '#ff3b30',
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
});
```

---

## 🎯 Practice Exercises

### Exercise 1: Login Form
Create a login screen with:
- Email TextInput
- Password TextInput (secure)
- Login Button
- Show Alert on button press

### Exercise 2: Counter with Reset
Build a counter app with:
- Display count
- Increment/Decrement buttons using TouchableOpacity
- Reset button that shows Alert before resetting

### Exercise 3: Color Switcher
Create an app with:
- Switch component
- Changes background color when toggled
- Shows "Light Mode" or "Dark Mode" text

---

## 💡 Key Takeaways

✅ Use `TouchableOpacity` or `Pressable` for custom buttons
✅ `ScrollView` for small lists, `FlatList` for large lists
✅ Always wrap text input in controlled components with `useState`
✅ Use `SafeAreaView` to avoid notch/status bar overlap
✅ `Alert.alert()` for native dialogs
✅ `Modal` for custom overlays
✅ `ActivityIndicator` for loading states

---

## 🔗 What's Next?

In the next lesson, we'll learn about:
- Styling in depth (Flexbox, dimensions)
- Creating beautiful layouts
- Responsive design

[Next Lesson: Styling & Layouts →](./03-styling-layouts.md)

---

## 📚 Additional Resources

- [React Native Components Docs](https://reactnative.dev/docs/components-and-apis)
- [Handling Touches](https://reactnative.dev/docs/handling-touches)
- [Using List Views](https://reactnative.dev/docs/using-a-listview)

---

*Happy coding! 🚀*
