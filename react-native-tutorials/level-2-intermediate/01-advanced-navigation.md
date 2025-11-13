# Lesson 1: Advanced Navigation Patterns

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Implement Drawer Navigator for side menus
- Create complex nested navigation structures
- Handle deep linking and URL schemes
- Pass and update navigation params dynamically
- Master advanced navigation patterns

---

## Drawer Navigator

Side menu navigation popular in apps like Gmail, Slack.

### Installation

```bash
npm install @react-navigation/drawer
npm install react-native-gesture-handler react-native-reanimated
```

### Basic Drawer Navigator

```jsx
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, Button, StyleSheet } from 'react-native';

const Drawer = createDrawerNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Button
        title="Open Drawer"
        onPress={() => navigation.openDrawer()}
      />
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings Screen</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#f5f5f5',
            width: 280,
          },
          drawerActiveTintColor: '#007AFF',
          drawerInactiveTintColor: '#666',
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
```

---

## Custom Drawer Content

```jsx
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet } from 'react-native';

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>john@example.com</Text>
      </View>

      {/* Default Drawer Items */}
      <DrawerItemList {...props} />

      {/* Custom Drawer Items */}
      <DrawerItem
        label="Help & Support"
        onPress={() => props.navigation.navigate('Help')}
        icon={({ color, size }) => (
          <Ionicons name="help-circle-outline" size={size} color={color} />
        )}
      />

      <DrawerItem
        label="Logout"
        onPress={() => {
          // Handle logout
          Alert.alert('Logout', 'Are you sure?');
        }}
        icon={({ color, size }) => (
          <Ionicons name="log-out-outline" size={size} color={color} />
        )}
        labelStyle={{ color: '#ff3b30' }}
      />
    </DrawerContentScrollView>
  );
}

// Use in Drawer.Navigator
<Drawer.Navigator
  drawerContent={(props) => <CustomDrawerContent {...props} />}
>
  {/* Your screens */}
</Drawer.Navigator>

const styles = StyleSheet.create({
  profileSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
```

---

## Complex Nested Navigation

Combining Drawer, Stack, and Tab Navigators:

```jsx
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Home Stack
function FeedScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feed</Text>
      <Button
        title="View Post"
        onPress={() => navigation.navigate('PostDetail', { id: 1 })}
      />
    </View>
  );
}

function PostDetailScreen({ route }) {
  const { id } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Post {id}</Text>
    </View>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Feed" component={FeedScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
    </Stack.Navigator>
  );
}

// Profile Stack
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

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileMain" component={ProfileMainScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}

// Tab Navigator containing Stacks
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

// Settings Screen (standalone)
function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
    </View>
  );
}

// Main App with Drawer
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen
          name="Home"
          component={HomeTabs}
          options={{ headerShown: true }}
        />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
```

---

## Advanced Parameter Handling

### Passing Complex Data

```jsx
function ProductListScreen({ navigation }) {
  const product = {
    id: 1,
    name: 'Wireless Headphones',
    price: 99.99,
    description: 'High-quality wireless headphones',
    images: ['url1', 'url2'],
    specifications: {
      battery: '30 hours',
      bluetooth: '5.0',
    },
  };

  return (
    <Button
      title="View Product"
      onPress={() => navigation.navigate('ProductDetail', { product })}
    />
  );
}

function ProductDetailScreen({ route }) {
  const { product } = route.params;

  return (
    <View>
      <Text>{product.name}</Text>
      <Text>${product.price}</Text>
      <Text>{product.description}</Text>
      <Text>Battery: {product.specifications.battery}</Text>
    </View>
  );
}
```

### Updating Parent Screen from Child

```jsx
function ParentScreen({ navigation, route }) {
  const [count, setCount] = useState(0);

  // Listen for updates from child screen
  useEffect(() => {
    if (route.params?.updatedCount) {
      setCount(route.params.updatedCount);
    }
  }, [route.params?.updatedCount]);

  return (
    <View style={styles.container}>
      <Text>Count: {count}</Text>
      <Button
        title="Update Count"
        onPress={() => {
          navigation.navigate('Child', {
            currentCount: count,
            onUpdate: (newCount) => {
              navigation.setParams({ updatedCount: newCount });
            },
          });
        }}
      />
    </View>
  );
}

function ChildScreen({ route, navigation }) {
  const { currentCount, onUpdate } = route.params;
  const [localCount, setLocalCount] = useState(currentCount);

  const handleSave = () => {
    // Call parent's update function
    if (onUpdate) {
      onUpdate(localCount);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text>Count: {localCount}</Text>
      <Button title="+1" onPress={() => setLocalCount(localCount + 1)} />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}
```

---

## Modal Navigation

```jsx
<Stack.Navigator>
  <Stack.Group>
    {/* Regular screens */}
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Details" component={DetailsScreen} />
  </Stack.Group>

  <Stack.Group screenOptions={{ presentation: 'modal' }}>
    {/* Modal screens */}
    <Stack.Screen name="CreatePost" component={CreatePostScreen} />
    <Stack.Screen name="ShareModal" component={ShareModalScreen} />
  </Stack.Group>

  <Stack.Group screenOptions={{ presentation: 'transparentModal' }}>
    {/* Transparent modals */}
    <Stack.Screen name="ImageViewer" component={ImageViewerScreen} />
  </Stack.Group>
</Stack.Navigator>
```

---

## Navigation Guards

Preventing navigation based on conditions:

```jsx
function EditProfileScreen({ navigation }) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!hasUnsavedChanges) {
        return;
      }

      // Prevent default behavior
      e.preventDefault();

      // Show confirmation dialog
      Alert.alert(
        'Discard changes?',
        'You have unsaved changes. Are you sure you want to leave?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, hasUnsavedChanges]);

  return (
    <View>
      <TextInput
        placeholder="Name"
        onChangeText={() => setHasUnsavedChanges(true)}
      />
      <Button
        title="Save"
        onPress={() => {
          setHasUnsavedChanges(false);
          navigation.goBack();
        }}
      />
    </View>
  );
}
```

---

## Deep Linking

Handle URLs that open specific screens:

```jsx
// App.js
import { Linking } from 'react-native';

const linking = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: {
      Home: 'home',
      Profile: 'profile/:userId',
      Post: 'post/:postId',
      Settings: {
        path: 'settings',
        screens: {
          General: 'general',
          Privacy: 'privacy',
        },
      },
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Post" component={PostScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// URLs will work like:
// myapp://profile/123 -> ProfileScreen with userId: '123'
// https://myapp.com/post/456 -> PostScreen with postId: '456'
```

### Getting Deep Link Parameters

```jsx
function ProfileScreen({ route }) {
  const { userId } = route.params;

  useEffect(() => {
    // Fetch user data using userId from URL
    fetchUserData(userId);
  }, [userId]);

  return (
    <View>
      <Text>User ID: {userId}</Text>
    </View>
  );
}
```

---

## Navigation State Persistence

Save and restore navigation state:

```jsx
import AsyncStorage from '@react-native-async-storage/async-storage';

const PERSISTENCE_KEY = 'NAVIGATION_STATE';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();

  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = savedStateString ? JSON.parse(savedStateString) : undefined;

        setInitialState(state);
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={(state) =>
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }
    >
      {/* Your navigators */}
    </NavigationContainer>
  );
}
```

---

## Complete Example: Social Media App

```jsx
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Sample Data
const POSTS = [
  { id: '1', author: 'John Doe', content: 'Hello World!', likes: 42 },
  { id: '2', author: 'Jane Smith', content: 'React Native is awesome!', likes: 128 },
];

// Feed Screen
function FeedScreen({ navigation }) {
  const renderPost = ({ item }) => (
    <TouchableOpacity
      style={styles.post}
      onPress={() => navigation.navigate('PostDetail', { post: item })}
    >
      <Text style={styles.author}>{item.author}</Text>
      <Text style={styles.content}>{item.content}</Text>
      <Text style={styles.likes}>{item.likes} likes</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={POSTS}
        renderItem={renderPost}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

// Post Detail Screen
function PostDetailScreen({ route, navigation }) {
  const { post } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.author}>{post.author}</Text>
      <Text style={styles.content}>{post.content}</Text>
      <Text style={styles.likes}>{post.likes} likes</Text>
    </View>
  );
}

// Create Post Screen (Modal)
function CreatePostScreen({ navigation }) {
  const [content, setContent] = useState('');

  const handlePost = () => {
    // Save post
    console.log('New post:', content);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <Button title="Post" onPress={handlePost} />
    </View>
  );
}

// Feed Stack
function FeedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Feed" component={FeedScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}

// Profile Stack
function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>
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

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}

// Bottom Tabs
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'FeedTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="FeedTab" component={FeedStack} options={{ title: 'Feed' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

// Settings
function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
    </View>
  );
}

// Main App
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={MainTabs} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  post: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  author: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  content: {
    fontSize: 14,
    marginBottom: 10,
  },
  likes: {
    fontSize: 12,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    margin: 20,
    height: 150,
  },
});
```

---

## 🎯 Practice Exercises

### Exercise 1: E-commerce Navigation
Create an app with:
- Drawer with: Home, Orders, Settings
- Bottom tabs: Products, Cart, Profile
- Stack in Products: List, Detail, Reviews
- Modal for Add to Cart
- Pass product data between screens

### Exercise 2: Banking App Navigation
Build navigation for:
- Login stack (Login, Register, Forgot Password)
- Main drawer after login (Accounts, Transfers, Settings)
- Accounts tab with stack (List, Details, Transactions)
- Navigation guard on logout

### Exercise 3: Blog App with Deep Linking
Create:
- Article list and detail screens
- Category navigation
- Deep links for: /article/:id, /category/:name
- Save navigation state
- Share article with deep link

---

## 💡 Key Takeaways

✅ Drawer Navigator for side menus
✅ Combine multiple navigator types for complex apps
✅ Use Stack.Group for modals
✅ Pass functions as params to update parent screens
✅ Implement navigation guards for unsaved changes
✅ Deep linking opens specific screens from URLs
✅ Persist navigation state for better UX
✅ Custom drawer content for branding

---

## 🔗 What's Next?

In the next lesson, we'll learn about:
- API integration with Fetch and Axios
- Async/await patterns
- Loading and error states
- Data caching strategies

[Next Lesson: API Integration →](./02-api-integration.md)

---

## 📚 Additional Resources

- [Drawer Navigator](https://reactnavigation.org/docs/drawer-navigator)
- [Nesting Navigators](https://reactnavigation.org/docs/nesting-navigators)
- [Deep Linking](https://reactnavigation.org/docs/deep-linking)
- [Navigation State](https://reactnavigation.org/docs/navigation-state)

---

*Happy coding! 🚀*
