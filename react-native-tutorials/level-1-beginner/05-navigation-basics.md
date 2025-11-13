# Lesson 5: Navigation Basics with React Navigation

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Install and configure React Navigation
- Implement Stack Navigator for screen transitions
- Create Tab Navigator for bottom navigation
- Pass data between screens
- Understand navigation patterns in mobile apps

---

## What is React Navigation?

**React Navigation** is the most popular navigation library for React Native. It provides:
- Stack navigation (push/pop screens)
- Tab navigation (bottom tabs)
- Drawer navigation (side menu)
- Native-like transitions and gestures

---

## Installation

```bash
# Install core library
npm install @react-navigation/native

# Install dependencies
npm install react-native-screens react-native-safe-area-context

# For Stack Navigator
npm install @react-navigation/native-stack

# For Tab Navigator
npm install @react-navigation/bottom-tabs

# For Expo projects, also run:
npx expo install react-native-screens react-native-safe-area-context
```

---

## Setting Up Navigation Container

Wrap your app with `NavigationContainer`:

```jsx
// App.js
import { NavigationContainer } from '@react-navigation/native';
import { View, Text } from 'react-native';

export default function App() {
  return (
    <NavigationContainer>
      <Text>Navigation is ready!</Text>
    </NavigationContainer>
  );
}
```

---

## Stack Navigator

Stack Navigator manages a stack of screens (like a browser history).

### Basic Stack Navigator

```jsx
// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button, StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();

// Home Screen
function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

// Details Screen
function DetailsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details Screen</Text>
      <Button
        title="Go Back"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
```

---

## Navigation Methods

```jsx
function MyScreen({ navigation }) {
  return (
    <View>
      {/* Navigate to a screen */}
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile')}
      />

      {/* Push same screen multiple times */}
      <Button
        title="Push Details"
        onPress={() => navigation.push('Details')}
      />

      {/* Go back */}
      <Button
        title="Go Back"
        onPress={() => navigation.goBack()}
      />

      {/* Go to first screen in stack */}
      <Button
        title="Go to Home"
        onPress={() => navigation.popToTop()}
      />

      {/* Replace current screen */}
      <Button
        title="Replace with Login"
        onPress={() => navigation.replace('Login')}
      />
    </View>
  );
}
```

---

## Passing Parameters Between Screens

### Sending Parameters

```jsx
function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Button
        title="Go to Profile"
        onPress={() => {
          navigation.navigate('Profile', {
            userId: 123,
            userName: 'John Doe',
            email: 'john@example.com',
          });
        }}
      />
    </View>
  );
}
```

### Receiving Parameters

```jsx
function ProfileScreen({ route, navigation }) {
  // Access parameters from route.params
  const { userId, userName, email } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      <Text>User ID: {userId}</Text>
      <Text>Name: {userName}</Text>
      <Text>Email: {email}</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}
```

### Updating Parameters

```jsx
function EditProfileScreen({ route, navigation }) {
  const [name, setName] = useState(route.params?.userName || '');

  const saveProfile = () => {
    // Update parameters
    navigation.setParams({
      userName: name,
    });
  };

  return (
    <View>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
      />
      <Button title="Save" onPress={saveProfile} />
    </View>
  );
}
```

---

## Customizing Header

```jsx
<Stack.Navigator
  screenOptions={{
    headerStyle: {
      backgroundColor: '#007AFF',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }}
>
  <Stack.Screen
    name="Home"
    component={HomeScreen}
    options={{
      title: 'My Home',
      headerRight: () => (
        <Button
          onPress={() => alert('Info')}
          title="Info"
          color="#fff"
        />
      ),
    }}
  />

  <Stack.Screen
    name="Profile"
    component={ProfileScreen}
    options={({ route }) => ({
      title: route.params.userName,
    })}
  />
</Stack.Navigator>
```

### Dynamic Header with setOptions

```jsx
function EditScreen({ navigation }) {
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Save"
          disabled={!hasChanges}
          onPress={() => console.log('Saving...')}
        />
      ),
    });
  }, [navigation, hasChanges]);

  return <View>{/* Your form */}</View>;
}
```

---

## Tab Navigator

Bottom tab navigation like Instagram, Twitter apps.

```jsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Tab</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Tab</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings Tab</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

---

## Combining Stack and Tab Navigators

Nested navigation (Stack inside Tabs):

```jsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Home Stack Screens
function HomeListScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home List</Text>
      <Button
        title="View Details"
        onPress={() => navigation.navigate('HomeDetails', { id: 1 })}
      />
    </View>
  );
}

function HomeDetailsScreen({ route }) {
  const { id } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details for item {id}</Text>
    </View>
  );
}

// Home Stack Navigator
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeList" component={HomeListScreen} />
      <Stack.Screen name="HomeDetails" component={HomeDetailsScreen} />
    </Stack.Navigator>
  );
}

// Profile Stack Screens
function ProfileMainScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Button
        title="Edit Profile"
        onPress={() => navigation.navigate('EditProfile')}
      />
    </View>
  );
}

function EditProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
    </View>
  );
}

// Profile Stack Navigator
function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileMain" component={ProfileMainScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}

// Settings Screen
function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
    </View>
  );
}

// Main App with Tabs
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,  // Hide tab navigator header
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Profile" component={ProfileStack} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
```

---

## Navigation Lifecycle

```jsx
import { useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

function MyScreen({ navigation }) {
  // Runs when component mounts
  useEffect(() => {
    console.log('Screen mounted');
    return () => console.log('Screen unmounted');
  }, []);

  // Runs every time screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('Screen focused');
      // Fetch fresh data here

      return () => {
        console.log('Screen blurred');
      };
    }, [])
  );

  return <View>{/* Your content */}</View>;
}
```

---

## Complete Example: Blog App

```jsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const Stack = createNativeStackNavigator();

// Sample blog data
const BLOG_POSTS = [
  {
    id: '1',
    title: 'Getting Started with React Native',
    author: 'John Doe',
    excerpt: 'Learn the basics of React Native development...',
    content: 'React Native is a framework for building mobile apps...',
    date: '2024-01-15',
  },
  {
    id: '2',
    title: 'Advanced Navigation Patterns',
    author: 'Jane Smith',
    excerpt: 'Master complex navigation in your apps...',
    content: 'Navigation is a crucial part of any mobile app...',
    date: '2024-01-20',
  },
  {
    id: '3',
    title: 'State Management Best Practices',
    author: 'Bob Johnson',
    excerpt: 'Learn how to manage state effectively...',
    content: 'State management can make or break your app...',
    date: '2024-01-25',
  },
];

// Blog List Screen
function BlogListScreen({ navigation }) {
  const renderPost = ({ item }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => navigation.navigate('BlogPost', { post: item })}
    >
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postAuthor}>By {item.author}</Text>
      <Text style={styles.postExcerpt}>{item.excerpt}</Text>
      <Text style={styles.postDate}>{item.date}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={BLOG_POSTS}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

// Blog Post Detail Screen
function BlogPostScreen({ route, navigation }) {
  const { post } = route.params;

  useEffect(() => {
    navigation.setOptions({
      title: 'Article',
    });
  }, [navigation]);

  return (
    <ScrollView style={styles.postDetail}>
      <Text style={styles.detailTitle}>{post.title}</Text>
      <View style={styles.meta}>
        <Text style={styles.author}>{post.author}</Text>
        <Text style={styles.date}>{post.date}</Text>
      </View>
      <Text style={styles.content}>{post.content}</Text>
    </ScrollView>
  );
}

// Main App
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="BlogList"
          component={BlogListScreen}
          options={{ title: 'Blog Posts' }}
        />
        <Stack.Screen
          name="BlogPost"
          component={BlogPostScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  postAuthor: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 8,
  },
  postExcerpt: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  postDate: {
    fontSize: 12,
    color: '#999',
  },
  postDetail: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  author: {
    fontSize: 16,
    color: '#007AFF',
  },
  date: {
    fontSize: 14,
    color: '#999',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});
```

---

## 🎯 Practice Exercises

### Exercise 1: User Profile Navigator
Create an app with:
- Home screen with user list
- Profile detail screen (receives user data)
- Edit profile screen
- Use Stack Navigator
- Pass user data between screens

### Exercise 2: E-commerce Tabs
Build a tab navigator with:
- Products tab (list of products)
- Cart tab (shows cart items)
- Profile tab (user info)
- Add icons to tabs
- Badge on cart tab showing item count

### Exercise 3: Notes App with Navigation
Create a notes app:
- List screen (all notes)
- Detail screen (view note)
- Edit/Create screen
- Use Stack Navigator
- Pass note data between screens
- Update list when note is edited

---

## 💡 Key Takeaways

✅ React Navigation is the standard for RN navigation
✅ Stack Navigator for screen history (push/pop)
✅ Tab Navigator for bottom navigation
✅ Combine navigators for complex apps
✅ Pass data with `navigation.navigate('Screen', { params })`
✅ Access params with `route.params`
✅ Customize headers with `options` prop
✅ Use `useFocusEffect` for screen focus events

---

## 🔗 What's Next?

In the next lesson, we'll learn about:
- Building forms with validation
- Handling user input
- Form libraries and best practices
- Input validation patterns

[Next Lesson: Forms & Validation →](./06-forms-validation.md)

---

## 📚 Additional Resources

- [React Navigation Docs](https://reactnavigation.org/docs/getting-started)
- [Navigation Patterns](https://reactnavigation.org/docs/navigating)
- [Stack Navigator](https://reactnavigation.org/docs/stack-navigator)
- [Tab Navigator](https://reactnavigation.org/docs/tab-based-navigation)

---

*Happy coding! 🚀*
