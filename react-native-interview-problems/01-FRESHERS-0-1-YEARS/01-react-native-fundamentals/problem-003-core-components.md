# Problem #003: Core Components in React Native

**Difficulty**: 🟢 Easy
**Category**: React Native Fundamentals
**Time**: 12-15 minutes

---

## 📝 Problem Statement

**Question 1**: What are the essential core components in React Native and what are they used for?

**Question 2**: Explain the difference between View, Text, Image, and ScrollView components.

**Question 3**: Create a practical example using at least 5 core components together.

---

## 🎯 What Interviewers Look For

- Knowledge of fundamental React Native components
- Understanding when to use each component
- Awareness of component props and behavior
- Practical implementation skills

---

## ✅ Complete Answer

### Question 1: Essential Core Components

React Native provides platform-agnostic native components that map to native UI elements on iOS and Android.

#### 📦 Most Important Core Components:

**1. View** - Container component
```jsx
import { View } from 'react-native';

<View style={styles.container}>
  {/* Other components go here */}
</View>
```
- Equivalent to: `<div>` (web)
- Maps to: `UIView` (iOS), `View` (Android)
- Purpose: Layout container, flexbox support

**2. Text** - Text display
```jsx
import { Text } from 'react-native';

<Text style={styles.text}>Hello World</Text>
```
- Equivalent to: `<p>`, `<span>`, `<h1>` (web)
- Maps to: `UILabel` (iOS), `TextView` (Android)
- Purpose: Display text (ALL text must be in Text component)

**3. Image** - Image display
```jsx
import { Image } from 'react-native';

<Image
  source={{ uri: 'https://example.com/image.jpg' }}
  style={styles.image}
/>
```
- Equivalent to: `<img>` (web)
- Maps to: `UIImageView` (iOS), `ImageView` (Android)
- Purpose: Display local or remote images

**4. TextInput** - Text input
```jsx
import { TextInput } from 'react-native';

<TextInput
  value={text}
  onChangeText={setText}
  placeholder="Enter text"
/>
```
- Equivalent to: `<input>`, `<textarea>` (web)
- Maps to: `UITextField` (iOS), `EditText` (Android)
- Purpose: User text input

**5. ScrollView** - Scrollable container
```jsx
import { ScrollView } from 'react-native';

<ScrollView>
  <Text>Lots of content...</Text>
</ScrollView>
```
- Equivalent to: `overflow: scroll` (web)
- Maps to: `UIScrollView` (iOS), `ScrollView` (Android)
- Purpose: Scrollable content

**6. FlatList** - Optimized lists
```jsx
import { FlatList } from 'react-native';

<FlatList
  data={items}
  renderItem={({ item }) => <Text>{item.name}</Text>}
  keyExtractor={item => item.id}
/>
```
- Purpose: Efficient rendering of large lists
- Only renders visible items

**7. TouchableOpacity** - Touchable wrapper
```jsx
import { TouchableOpacity } from 'react-native';

<TouchableOpacity onPress={handlePress}>
  <Text>Click Me</Text>
</TouchableOpacity>
```
- Equivalent to: `<button>` (web)
- Purpose: Make any component touchable

**8. Button** - Basic button
```jsx
import { Button } from 'react-native';

<Button title="Press Me" onPress={handlePress} />
```
- Purpose: Platform-specific styled button
- Limited customization

**9. SafeAreaView** - Safe area container
```jsx
import { SafeAreaView } from 'react-native';

<SafeAreaView style={styles.container}>
  {/* Content safe from notches/status bar */}
</SafeAreaView>
```
- Purpose: Avoid device notches, status bars
- iOS 11+ safe areas

**10. ActivityIndicator** - Loading spinner
```jsx
import { ActivityIndicator } from 'react-native';

<ActivityIndicator size="large" color="#0000ff" />
```
- Purpose: Loading state indicator

---

### Question 2: Component Differences Explained

#### **View vs Text:**

```jsx
// ❌ This won't work - text must be in Text component
<View>Hello World</View>

// ✅ Correct
<View>
  <Text>Hello World</Text>
</View>

// View is for layout
<View style={{ flexDirection: 'row', padding: 10 }}>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</View>
```

**Key Differences:**
- **View**: Container, no text content directly
- **Text**: Text content, can be nested, supports styling

#### **Image vs View with background:**

```jsx
// Image component for actual images
<Image
  source={require('./logo.png')}
  style={{ width: 100, height: 100 }}
/>

// View with backgroundColor for colored backgrounds
<View style={{ backgroundColor: 'blue', width: 100, height: 100 }} />

// Image with children not supported in React Native
// ❌ This won't work
<Image source={...}>
  <Text>Overlay</Text>
</Image>

// ✅ Use View wrapper instead
<View>
  <Image source={...} style={styles.image} />
  <Text style={styles.overlay}>Overlay</Text>
</View>
```

#### **ScrollView vs FlatList:**

```jsx
// ScrollView: Renders ALL children immediately
<ScrollView>
  {items.map(item => (
    <Text key={item.id}>{item.name}</Text>
  ))}
</ScrollView>

// FlatList: Renders only visible items (virtualized)
<FlatList
  data={items}
  renderItem={({ item }) => <Text>{item.name}</Text>}
  keyExtractor={item => item.id}
/>
```

**When to use:**
- **ScrollView**: Small lists (< 100 items), complex layouts
- **FlatList**: Large lists, better performance

#### **TouchableOpacity vs Button:**

```jsx
// Button: Platform-specific, limited styling
<Button
  title="Submit"
  onPress={handlePress}
  color="#841584"  // Limited to color only
/>

// TouchableOpacity: Full custom styling
<TouchableOpacity
  style={styles.customButton}
  onPress={handlePress}
  activeOpacity={0.7}
>
  <Text style={styles.buttonText}>Submit</Text>
  <Icon name="arrow-right" />
</TouchableOpacity>
```

---

### Question 3: Practical Example

```jsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const UserProfileForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      console.log('Profile submitted:', { name, email, bio });
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header with Image */}
        <View style={styles.header}>
          <Image
            source={{
              uri: 'https://via.placeholder.com/100',
            }}
            style={styles.avatar}
          />
          <Text style={styles.title}>Edit Profile</Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          {/* Name Input */}
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#999"
          />

          {/* Email Input */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
          />

          {/* Bio Input */}
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself"
            multiline
            numberOfLines={4}
            placeholderTextColor="#999"
          />

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Save Profile</Text>
            )}
          </TouchableOpacity>

          {/* Info Text */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Your profile information will be visible to other users.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  infoText: {
    color: '#1976D2',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default UserProfileForm;
```

**This example demonstrates:**
1. ✅ **SafeAreaView**: Prevents content from being hidden by notch
2. ✅ **ScrollView**: Makes entire form scrollable
3. ✅ **View**: Layout containers for sections
4. ✅ **Text**: Labels and informational text
5. ✅ **Image**: User avatar display
6. ✅ **TextInput**: Form fields (single and multi-line)
7. ✅ **TouchableOpacity**: Custom styled button
8. ✅ **ActivityIndicator**: Loading state during submit

---

## 🎯 Component Props Reference

### View Props:
```jsx
<View
  style={styles.container}
  onLayout={(event) => {}}
  pointerEvents="auto"
  accessible={true}
  testID="view-test-id"
/>
```

### Text Props:
```jsx
<Text
  style={styles.text}
  numberOfLines={2}
  ellipsizeMode="tail"
  onPress={() => {}}
  selectable={true}
/>
```

### Image Props:
```jsx
<Image
  source={{ uri: 'https://...' }}
  style={styles.image}
  resizeMode="cover"
  onLoad={() => {}}
  onError={(error) => {}}
/>
```

### TextInput Props:
```jsx
<TextInput
  value={text}
  onChangeText={setText}
  placeholder="Placeholder"
  secureTextEntry={false}
  keyboardType="default"
  autoCapitalize="sentences"
  maxLength={100}
/>
```

---

## 🚀 Follow-up Questions

**Q1**: Why can't you put text directly in a View?
**A**: React Native enforces that all text must be wrapped in a Text component for consistent typography, styling, and platform-specific text rendering.

**Q2**: What's the difference between TouchableOpacity, TouchableHighlight, and Pressable?
**A**: TouchableOpacity reduces opacity, TouchableHighlight darkens background, Pressable (newer) offers more control with pressIn/pressOut states.

**Q3**: When should you use Image vs ImageBackground?
**A**: Use Image for standalone images, ImageBackground when you need to render children over the image.

**Q4**: Can you nest Text components?
**A**: Yes! Text components can be nested for inline styling.
```jsx
<Text>
  Hello <Text style={{ fontWeight: 'bold' }}>World</Text>
</Text>
```

**Q5**: What's the difference between source={require(...)} and source={{ uri: ... }}?
**A**: require() is for local images (bundled), uri is for remote images or local file system paths.

---

## ✅ Common Mistakes

❌ **Mistake 1**: Text outside Text component
```jsx
// ❌ Won't work
<View>Hello</View>

// ✅ Correct
<View><Text>Hello</Text></View>
```

❌ **Mistake 2**: Using div/span instead of View/Text
```jsx
// ❌ Wrong - HTML elements don't work
<div><span>Text</span></div>

// ✅ Correct
<View><Text>Text</Text></View>
```

❌ **Mistake 3**: Forgetting Image dimensions
```jsx
// ❌ Won't show - needs dimensions
<Image source={{ uri: 'https://...' }} />

// ✅ Correct
<Image
  source={{ uri: 'https://...' }}
  style={{ width: 200, height: 200 }}
/>
```

❌ **Mistake 4**: Using ScrollView for large lists
```jsx
// ❌ Poor performance
<ScrollView>
  {bigArray.map(item => <Item />)}
</ScrollView>

// ✅ Better performance
<FlatList data={bigArray} renderItem={...} />
```

---

## 📊 Core Components Summary

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| **View** | Container/layout | style, onLayout |
| **Text** | Display text | style, numberOfLines, onPress |
| **Image** | Display images | source, style, resizeMode |
| **TextInput** | Text input | value, onChangeText, placeholder |
| **ScrollView** | Scrollable container | horizontal, contentContainerStyle |
| **FlatList** | Optimized lists | data, renderItem, keyExtractor |
| **TouchableOpacity** | Touch feedback | onPress, activeOpacity |
| **Button** | Platform button | title, onPress, color |
| **SafeAreaView** | Safe area padding | style |
| **ActivityIndicator** | Loading spinner | size, color |

---

## 📚 Additional Reading

- [Core Components Official Docs](https://reactnative.dev/docs/components-and-apis)
- [View Component](https://reactnative.dev/docs/view)
- [Text Component](https://reactnative.dev/docs/text)
- [Image Component](https://reactnative.dev/docs/image)

---

## ✅ Interview Tips

**Do:**
- ✅ Explain the native mapping (UIView, TextView, etc.)
- ✅ Mention performance considerations (FlatList vs ScrollView)
- ✅ Show practical examples from experience
- ✅ Discuss platform differences when relevant

**Don't:**
- ❌ Confuse with HTML elements
- ❌ Forget that all text needs Text wrapper
- ❌ Overlook image dimension requirements
- ❌ Ignore SafeAreaView for modern devices

---

**Difficulty**: 🟢 Easy
**Estimated Time**: 12-15 minutes
**Next Problem**: [#004: Styling Differences →](./problem-004-styling-differences.md)

---

*This problem is part of the React Native Interview Problems Collection*
