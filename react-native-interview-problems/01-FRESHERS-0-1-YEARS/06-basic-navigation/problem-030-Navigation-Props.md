# Problem #030: Navigation Props

**Difficulty**: 🟢 Easy
**Category**: Basic Navigation
**Time**: 10-12 minutes

---

## 📝 Problem Statement

**Question 1**: What is Navigation Props in React Navigation?
**Question 2**: How do you set up and use it?
**Question 3**: Demonstrate navigation between screens.

---

## ✅ Complete Answer

### Setup

```jsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
```

### Navigation

```jsx
const HomeScreen = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate('Details')}>
    <Text>Go to Details</Text>
  </TouchableOpacity>
);
```

---

**Difficulty**: 🟢 Easy
**Estimated Time**: 10-12 minutes

---

*This problem is part of the React Native Interview Problems Collection*
