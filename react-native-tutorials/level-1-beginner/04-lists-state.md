# Lesson 4: Lists & State Management

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Render efficient lists with FlatList and SectionList
- Manage component state with useState
- Handle side effects with useEffect
- Understand props and data flow
- Build dynamic, data-driven UIs

---

## Understanding React Hooks

### useState Hook

`useState` allows you to add state to functional components.

```jsx
import { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Counter() {
  // Declare state variable
  const [count, setCount] = useState(0);  // Initial value: 0

  return (
    <View style={styles.container}>
      <Text style={styles.count}>Count: {count}</Text>
      <Button title="Increment" onPress={() => setCount(count + 1)} />
      <Button title="Decrement" onPress={() => setCount(count - 1)} />
      <Button title="Reset" onPress={() => setCount(0)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  count: {
    fontSize: 48,
    fontWeight: 'bold',
  },
});
```

### Multiple State Variables

```jsx
import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Text style={styles.output}>
        Name: {name}, Email: {email}, Age: {age}
      </Text>
    </View>
  );
}
```

### State with Objects

```jsx
import { useState } from 'react';

export default function UserProfile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0,
  });

  const updateName = (name) => {
    setUser({ ...user, name });  // Spread operator to keep other properties
  };

  const updateEmail = (email) => {
    setUser({ ...user, email });
  };

  return (
    <View>
      <TextInput
        placeholder="Name"
        value={user.name}
        onChangeText={updateName}
      />
      <TextInput
        placeholder="Email"
        value={user.email}
        onChangeText={updateEmail}
      />
    </View>
  );
}
```

---

## FlatList Component

**FlatList** is for rendering large lists efficiently (virtualization).

### Basic FlatList

```jsx
import { FlatList, View, Text, StyleSheet } from 'react-native';

const DATA = [
  { id: '1', title: 'First Item' },
  { id: '2', title: 'Second Item' },
  { id: '3', title: 'Third Item' },
];

export default function BasicList() {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );

  return (
    <FlatList
      data={DATA}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
  },
});
```

### FlatList with State

```jsx
import { useState } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TodoList() {
  const [todos, setTodos] = useState([
    { id: '1', text: 'Learn React Native', completed: false },
    { id: '2', text: 'Build an app', completed: false },
    { id: '3', text: 'Deploy to store', completed: false },
  ]);

  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.todoItem}
      onPress={() => toggleTodo(item.id)}
    >
      <Text
        style={[
          styles.todoText,
          item.completed && styles.completedText
        ]}
      >
        {item.text}
      </Text>
      <Text style={styles.status}>
        {item.completed ? '✓' : '○'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Todos</Text>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    padding: 20,
    backgroundColor: 'white',
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  todoText: {
    fontSize: 16,
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  status: {
    fontSize: 24,
    marginLeft: 10,
  },
});
```

### Advanced FlatList Features

```jsx
<FlatList
  data={data}
  renderItem={renderItem}
  keyExtractor={item => item.id}

  // Separator
  ItemSeparatorComponent={() => <View style={styles.separator} />}

  // Empty state
  ListEmptyComponent={() => (
    <Text style={styles.empty}>No items found</Text>
  )}

  // Header
  ListHeaderComponent={() => (
    <Text style={styles.header}>My List</Text>
  )}

  // Footer
  ListFooterComponent={() => (
    <Text style={styles.footer}>End of list</Text>
  )}

  // Performance
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={10}
  windowSize={5}

  // Pull to refresh
  refreshing={refreshing}
  onRefresh={onRefresh}

  // Infinite scroll
  onEndReached={loadMore}
  onEndReachedThreshold={0.5}
/>
```

### Horizontal FlatList

```jsx
import { FlatList, View, Text, Image, StyleSheet } from 'react-native';

const PHOTOS = [
  { id: '1', uri: 'https://picsum.photos/200/200?1' },
  { id: '2', uri: 'https://picsum.photos/200/200?2' },
  { id: '3', uri: 'https://picsum.photos/200/200?3' },
  { id: '4', uri: 'https://picsum.photos/200/200?4' },
];

export default function HorizontalGallery() {
  const renderItem = ({ item }) => (
    <Image source={{ uri: item.uri }} style={styles.photo} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Photo Gallery</Text>
      <FlatList
        data={PHOTOS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  photo: {
    width: 200,
    height: 200,
    marginRight: 10,
    borderRadius: 8,
  },
});
```

---

## SectionList Component

For lists with sections/categories.

```jsx
import { SectionList, View, Text, StyleSheet } from 'react-native';

const DATA = [
  {
    title: 'Fruits',
    data: ['Apple', 'Banana', 'Orange', 'Mango'],
  },
  {
    title: 'Vegetables',
    data: ['Carrot', 'Tomato', 'Cucumber', 'Lettuce'],
  },
  {
    title: 'Dairy',
    data: ['Milk', 'Cheese', 'Yogurt', 'Butter'],
  },
];

export default function GroceryList() {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item}</Text>
    </View>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );

  return (
    <SectionList
      sections={DATA}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={(item, index) => item + index}
      stickySectionHeadersEnabled={true}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#007AFF',
    padding: 15,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 1,
    marginHorizontal: 16,
  },
  itemText: {
    fontSize: 16,
  },
});
```

---

## useEffect Hook

Handles side effects (API calls, subscriptions, timers).

### Basic useEffect

```jsx
import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

export default function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // This runs after every render
    console.log('Component updated');
  });

  useEffect(() => {
    // This runs only once (on mount)
    console.log('Component mounted');
  }, []);  // Empty dependency array

  useEffect(() => {
    // This runs when 'seconds' changes
    console.log('Seconds changed:', seconds);
  }, [seconds]);  // Dependency array with 'seconds'

  return (
    <View>
      <Text>Seconds: {seconds}</Text>
    </View>
  );
}
```

### useEffect with Cleanup

```jsx
import { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function StopwatchApp() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }

    // Cleanup function
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{seconds}s</Text>
      <View style={styles.buttons}>
        <Button
          title={isRunning ? 'Pause' : 'Start'}
          onPress={() => setIsRunning(!isRunning)}
        />
        <Button
          title="Reset"
          onPress={() => {
            setSeconds(0);
            setIsRunning(false);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
  },
});
```

---

## Complete Example: Contact List App

```jsx
import { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

export default function ContactsApp() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [contacts, setContacts] = useState([
    { id: '1', name: 'John Doe', phone: '555-0101' },
    { id: '2', name: 'Jane Smith', phone: '555-0102' },
  ]);

  const addContact = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const newContact = {
      id: Date.now().toString(),
      name: name.trim(),
      phone: phone.trim(),
    };

    setContacts([...contacts, newContact]);
    setName('');
    setPhone('');
  };

  const deleteContact = (id) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setContacts(contacts.filter(c => c.id !== id)),
        },
      ]
    );
  };

  const renderContact = ({ item }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onLongPress={() => deleteContact(item.id)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Contacts</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.addButton} onPress={addContact}>
          <Text style={styles.addButtonText}>Add Contact</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={item => item.id}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No contacts yet</Text>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    padding: 20,
    backgroundColor: 'white',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 50,
  },
});
```

---

## 🎯 Practice Exercises

### Exercise 1: Shopping Cart
Build a shopping cart with:
- List of products (name, price)
- Add to cart button for each
- Display cart items with quantities
- Show total price
- Remove from cart functionality

### Exercise 2: Notes App
Create a notes app with:
- Add new note with title and content
- Display notes in FlatList
- Delete notes (swipe or long press)
- Empty state when no notes
- Timestamp for each note

### Exercise 3: Color Palette Generator
Build an app that:
- Has a button to generate random colors
- Displays colors in a FlatList
- Each color shows hex code
- Tap to copy hex code to clipboard (use Alert for now)
- Clear all colors button

---

## 💡 Key Takeaways

✅ Use `useState` for component state
✅ `useEffect` for side effects (timers, API calls)
✅ `FlatList` for large lists (efficient, virtualized)
✅ `SectionList` for categorized data
✅ Always provide `keyExtractor` for lists
✅ State updates trigger re-renders
✅ Cleanup functions prevent memory leaks

---

## 🔗 What's Next?

In the next lesson, we'll learn about:
- React Navigation setup
- Stack Navigator for screen transitions
- Tab Navigator for bottom tabs
- Passing data between screens

[Next Lesson: Navigation Basics →](./05-navigation-basics.md)

---

## 📚 Additional Resources

- [React Hooks Documentation](https://react.dev/reference/react)
- [FlatList API Reference](https://reactnative.dev/docs/flatlist)
- [SectionList API Reference](https://reactnative.dev/docs/sectionlist)
- [Using the State Hook](https://react.dev/reference/react/useState)

---

*Happy coding! 🚀*
