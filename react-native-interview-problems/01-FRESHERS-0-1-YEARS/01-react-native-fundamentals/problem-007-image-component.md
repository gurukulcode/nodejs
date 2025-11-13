# Problem #007: Image Component

**Difficulty**: 🟢 Easy
**Category**: React Native Fundamentals
**Time**: 10-12 minutes

---

## 📝 Problem Statement

**Question 1**: How do you display images in React Native? What are the different source types?

**Question 2**: What are the key props for controlling image display (resizeMode, etc.)?

**Question 3**: How do you handle image loading states and errors?

---

## 🎯 What Interviewers Look For

- Knowledge of Image component and source types
- Understanding of resizeMode options
- Awareness of image caching and optimization
- Error handling and loading states

---

## ✅ Complete Answer

### Question 1: Image Sources

#### **Local Images (require)**

```jsx
import { Image } from 'react-native';

// Bundled with app
<Image
  source={require('./assets/logo.png')}
  style={{ width: 100, height: 100 }}
/>

// Must know image dimensions or set them in style
```

#### **Remote Images (URI)**

```jsx
// From internet
<Image
  source={{ uri: 'https://example.com/image.jpg' }}
  style={{ width: 200, height: 200 }}
/>

// With headers
<Image
  source={{
    uri: 'https://api.example.com/image.jpg',
    headers: {
      Authorization: 'Bearer token',
    },
  }}
  style={{ width: 200, height: 200 }}
/>
```

#### **Base64 Images**

```jsx
<Image
  source={{
    uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...',
  }}
  style={{ width: 100, height: 100 }}
/>
```

#### **Local File System (iOS/Android)**

```jsx
// file:// protocol
<Image
  source={{ uri: 'file:///path/to/image.jpg' }}
  style={{ width: 200, height: 200 }}
/>
```

---

### Question 2: Image Props

```jsx
<Image
  source={{ uri: 'https://example.com/image.jpg' }}
  style={styles.image}

  // Resize behavior
  resizeMode="cover"  // 'cover', 'contain', 'stretch', 'repeat', 'center'

  // Loading
  onLoad={() => console.log('Loaded')}
  onLoadStart={() => console.log('Started')}
  onLoadEnd={() => console.log('Ended')}
  onError={(error) => console.log('Error:', error)}

  // Progress (iOS only)
  onProgress={(e) => {
    const progress = e.nativeEvent.loaded / e.nativeEvent.total;
    console.log(progress);
  }}

  // Placeholder (iOS only)
  defaultSource={require('./placeholder.png')}

  // Blur (iOS only)
  blurRadius={5}

  // Accessibility
  accessible={true}
  accessibilityLabel="Profile picture"

  // Performance
  fadeDuration={300}  // Android only
  resizeMethod="resize"  // 'auto', 'resize', 'scale'
/>
```

#### **ResizeMode Options**

```jsx
// cover: Scale to fill, crop if needed (default)
<Image
  source={{ uri: 'https://via.placeholder.com/400x200' }}
  style={{ width: 200, height: 200 }}
  resizeMode="cover"
/>

// contain: Scale to fit inside, no crop
<Image
  source={{ uri: 'https://via.placeholder.com/400x200' }}
  style={{ width: 200, height: 200 }}
  resizeMode="contain"
/>

// stretch: Stretch to fill (distorts aspect ratio)
<Image
  source={{ uri: 'https://via.placeholder.com/400x200' }}
  style={{ width: 200, height: 200 }}
  resizeMode="stretch"
/>

// repeat: Tile image
<Image
  source={{ uri: 'https://via.placeholder.com/50' }}
  style={{ width: 200, height: 200 }}
  resizeMode="repeat"
/>

// center: Center without scaling
<Image
  source={{ uri: 'https://via.placeholder.com/100' }}
  style={{ width: 200, height: 200 }}
  resizeMode="center"
/>
```

---

### Question 3: Loading States and Error Handling

```jsx
import React, { useState } from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';

const ImageWithLoading = ({ uri }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <View style={styles.container}>
      {/* Actual Image */}
      <Image
        source={{ uri }}
        style={styles.image}
        onLoadStart={() => {
          setLoading(true);
          setError(false);
        }}
        onLoad={() => setLoading(false)}
        onError={(e) => {
          setLoading(false);
          setError(true);
          console.error('Image load error:', e.nativeEvent.error);
        }}
        resizeMode="cover"
      />

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}

      {/* Error Overlay */}
      {error && (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorText}>Failed to load image</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#d32f2f',
    textAlign: 'center',
    padding: 20,
  },
});
```

---

## 💡 Complete Image Gallery Example

```jsx
import React from 'react';
import {
  View,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 40) / 3; // 3 columns with padding

const ImageGallery = () => {
  const images = [
    'https://picsum.photos/200/200?random=1',
    'https://picsum.photos/200/200?random=2',
    'https://picsum.photos/200/200?random=3',
    'https://picsum.photos/200/200?random=4',
    'https://picsum.photos/200/200?random=5',
    'https://picsum.photos/200/200?random=6',
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.grid}>
        {images.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={styles.image}
            resizeMode="cover"
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
});
```

---

## 🎯 Performance Tips

```jsx
// ❌ Bad: Large image without optimization
<Image
  source={{ uri: 'https://example.com/huge-4k-image.jpg' }}
  style={{ width: 100, height: 100 }}
/>

// ✅ Good: Use appropriate size
<Image
  source={{ uri: 'https://example.com/thumbnail-100x100.jpg' }}
  style={{ width: 100, height: 100 }}
/>

// ✅ Good: Resize method for Android
<Image
  source={{ uri: 'https://example.com/large-image.jpg' }}
  style={{ width: 100, height: 100 }}
  resizeMethod="resize"  // Decode at smaller size
  resizeMode="cover"
/>
```

---

## 🚀 Follow-up Questions

**Q1**: What's the difference between Image and ImageBackground?
**A**: ImageBackground allows rendering children over an image, while Image doesn't support children.

**Q2**: How are images cached in React Native?
**A**: iOS uses NSURLCache, Android uses OkHttp cache. Images are automatically cached, but you can use libraries like react-native-fast-image for more control.

**Q3**: How do you handle different image densities (@2x, @3x)?
**A**: React Native automatically selects the appropriate image based on device pixel density when using require().

**Q4**: Can you animate images?
**A**: Yes, using the Animated API or libraries like react-native-reanimated.

---

## ✅ Common Mistakes

❌ **Mistake 1**: No dimensions for remote images
```jsx
// ❌ Won't display
<Image source={{ uri: 'https://...' }} />

// ✅ Must set dimensions
<Image
  source={{ uri: 'https://...' }}
  style={{ width: 200, height: 200 }}
/>
```

❌ **Mistake 2**: Using local path as string
```jsx
// ❌ Wrong
<Image source="./image.png" />

// ✅ Correct
<Image source={require('./image.png')} />
```

❌ **Mistake 3**: Children in Image
```jsx
// ❌ Won't work
<Image source={...}>
  <Text>Overlay</Text>
</Image>

// ✅ Use ImageBackground
<ImageBackground source={...}>
  <Text>Overlay</Text>
</ImageBackground>
```

---

**Difficulty**: 🟢 Easy
**Estimated Time**: 10-12 minutes
**Next Problem**: [#008: Touchable Components →](./problem-008-touchable-components.md)

---

*This problem is part of the React Native Interview Problems Collection*
