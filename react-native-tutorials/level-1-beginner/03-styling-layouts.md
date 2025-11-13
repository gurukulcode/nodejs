# Lesson 3: Styling & Layouts with Flexbox

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Master Flexbox layout in React Native
- Understand dimensions and positioning
- Create responsive layouts
- Apply advanced styling techniques
- Build beautiful, professional UIs

---

## React Native Styling Fundamentals

### Creating StyleSheets

```jsx
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
  },
});
```

**Why use StyleSheet.create()?**
- ✅ Performance optimization
- ✅ Validation of style properties
- ✅ Code completion in IDEs
- ✅ Converts styles to native equivalents

---

## Flexbox in React Native

**All containers in React Native use Flexbox by default!**

### Default Flexbox Differences from Web

| Property | Web Default | React Native Default |
|----------|-------------|---------------------|
| `flexDirection` | `row` | `column` |
| `alignContent` | `stretch` | `flex-start` |
| `flexShrink` | `1` | `0` |

---

## Flex Direction

Controls the main axis direction.

```jsx
import { View, Text, StyleSheet } from 'react-native';

// COLUMN (Default - Vertical)
<View style={styles.columnContainer}>
  <View style={styles.box}><Text>1</Text></View>
  <View style={styles.box}><Text>2</Text></View>
  <View style={styles.box}><Text>3</Text></View>
</View>

// ROW (Horizontal)
<View style={styles.rowContainer}>
  <View style={styles.box}><Text>1</Text></View>
  <View style={styles.box}><Text>2</Text></View>
  <View style={styles.box}><Text>3</Text></View>
</View>

const styles = StyleSheet.create({
  columnContainer: {
    flexDirection: 'column',  // Default
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    padding: 10,
  },
  box: {
    width: 50,
    height: 50,
    backgroundColor: '#007AFF',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

**Other values:**
- `column-reverse` - Bottom to top
- `row-reverse` - Right to left

---

## Justify Content

Aligns items along the **main axis** (primary direction).

```jsx
<View style={styles.container}>
  {/* Align to start */}
  <View style={{ justifyContent: 'flex-start' }}>
    <Box /><Box /><Box />
  </View>

  {/* Center */}
  <View style={{ justifyContent: 'center' }}>
    <Box /><Box /><Box />
  </View>

  {/* Align to end */}
  <View style={{ justifyContent: 'flex-end' }}>
    <Box /><Box /><Box />
  </View>

  {/* Space between items */}
  <View style={{ justifyContent: 'space-between' }}>
    <Box /><Box /><Box />
  </View>

  {/* Space around items */}
  <View style={{ justifyContent: 'space-around' }}>
    <Box /><Box /><Box />
  </View>

  {/* Space evenly */}
  <View style={{ justifyContent: 'space-evenly' }}>
    <Box /><Box /><Box />
  </View>
</View>
```

---

## Align Items

Aligns items along the **cross axis** (perpendicular to main axis).

```jsx
<View style={styles.container}>
  {/* Align to start of cross axis */}
  <View style={{ alignItems: 'flex-start' }}>
    <Box /><Box /><Box />
  </View>

  {/* Center on cross axis */}
  <View style={{ alignItems: 'center' }}>
    <Box /><Box /><Box />
  </View>

  {/* Align to end of cross axis */}
  <View style={{ alignItems: 'flex-end' }}>
    <Box /><Box /><Box />
  </View>

  {/* Stretch to fill cross axis */}
  <View style={{ alignItems: 'stretch' }}>
    <Box /><Box /><Box />
  </View>
</View>
```

---

## Flex Property

Controls how items grow/shrink to fill available space.

```jsx
<View style={styles.container}>
  {/* Takes 1/4 of space */}
  <View style={{ flex: 1, backgroundColor: 'red' }}>
    <Text>Flex: 1</Text>
  </View>

  {/* Takes 2/4 of space (twice as much) */}
  <View style={{ flex: 2, backgroundColor: 'blue' }}>
    <Text>Flex: 2</Text>
  </View>

  {/* Takes 1/4 of space */}
  <View style={{ flex: 1, backgroundColor: 'green' }}>
    <Text>Flex: 1</Text>
  </View>
</View>

const styles = StyleSheet.create({
  container: {
    flex: 1,  // Take all available space
    flexDirection: 'row',
  },
});
```

---

## Practical Layout Examples

### 1. Header, Content, Footer Layout

```jsx
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header - Fixed height */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Header</Text>
      </View>

      {/* Content - Fills remaining space */}
      <View style={styles.content}>
        <Text>Main Content Area</Text>
      </View>

      {/* Footer - Fixed height */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Footer</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,  // Takes remaining space
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    height: 50,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
  },
});
```

### 2. Card Layout

```jsx
<View style={styles.card}>
  <View style={styles.cardImage}>
    <Text>Image</Text>
  </View>
  <View style={styles.cardContent}>
    <Text style={styles.cardTitle}>Card Title</Text>
    <Text style={styles.cardDescription}>
      This is a description of the card content.
    </Text>
  </View>
  <View style={styles.cardActions}>
    <TouchableOpacity style={styles.button}>
      <Text>Like</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button}>
      <Text>Share</Text>
    </TouchableOpacity>
  </View>
</View>

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,  // Android shadow
  },
  cardImage: {
    height: 200,
    backgroundColor: '#ddd',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
});
```

### 3. Grid Layout (2 Columns)

```jsx
<View style={styles.grid}>
  {[1, 2, 3, 4, 5, 6].map((item) => (
    <View key={item} style={styles.gridItem}>
      <Text style={styles.gridText}>Item {item}</Text>
    </View>
  ))}
</View>

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
  },
  gridItem: {
    width: '48%',  // ~50% - some margin
    aspectRatio: 1,  // Square
    backgroundColor: '#007AFF',
    margin: '1%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

---

## Dimensions & Sizing

### Fixed Dimensions

```jsx
<View style={{ width: 100, height: 100 }}>
  <Text>Fixed Size</Text>
</View>
```

### Percentage Dimensions

```jsx
<View style={{ width: '50%', height: '30%' }}>
  <Text>50% width, 30% height</Text>
</View>
```

### Aspect Ratio

```jsx
<View style={{ width: '100%', aspectRatio: 16/9 }}>
  <Text>16:9 aspect ratio</Text>
</View>
```

### Get Screen Dimensions

```jsx
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

// Use in styles
<View style={{ width: windowWidth * 0.9 }}>
  <Text>90% of screen width</Text>
</View>
```

---

## Positioning

### Relative Positioning (Default)

```jsx
<View style={{ top: 10, left: 20 }}>
  <Text>Moved 10 down, 20 right from normal position</Text>
</View>
```

### Absolute Positioning

```jsx
<View style={styles.container}>
  <View style={styles.absoluteBox}>
    <Text>I'm positioned absolutely</Text>
  </View>
</View>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  absoluteBox: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 100,
    height: 100,
    backgroundColor: 'red',
  },
});
```

### Overlay Example

```jsx
<View style={styles.container}>
  <Image source={require('./bg.jpg')} style={styles.backgroundImage} />
  <View style={styles.overlay}>
    <Text style={styles.overlayText}>Overlay Text</Text>
  </View>
</View>

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
});
```

---

## Shadows & Elevation

### iOS Shadows

```jsx
<View style={styles.card}>
  <Text>I have a shadow</Text>
</View>

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
```

### Android Elevation

```jsx
<View style={styles.card}>
  <Text>I have elevation</Text>
</View>

const styles = StyleSheet.create({
  card: {
    elevation: 5,
  },
});
```

### Cross-Platform Shadow

```jsx
<View style={styles.card}>
  <Text>Works on both platforms</Text>
</View>

const styles = StyleSheet.create({
  card: {
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Android shadow
    elevation: 5,
    // Common
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
  },
});
```

---

## Platform-Specific Styles

```jsx
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    ...Platform.select({
      ios: {
        backgroundColor: '#f0f0f0',
      },
      android: {
        backgroundColor: '#e0e0e0',
      },
    }),
  },
  text: {
    fontSize: Platform.OS === 'ios' ? 18 : 16,
  },
});
```

---

## Common Layout Patterns

### Centered Content

```jsx
<View style={styles.centered}>
  <Text>I'm centered!</Text>
</View>

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

### Space Between (Navigation Bar)

```jsx
<View style={styles.navbar}>
  <Text>Logo</Text>
  <View style={styles.navLinks}>
    <Text>Home</Text>
    <Text>About</Text>
  </View>
</View>

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#007AFF',
  },
  navLinks: {
    flexDirection: 'row',
    gap: 15,
  },
});
```

### Bottom Button

```jsx
<View style={styles.container}>
  <ScrollView style={styles.content}>
    <Text>Scrollable content...</Text>
  </ScrollView>
  <TouchableOpacity style={styles.bottomButton}>
    <Text style={styles.buttonText}>Continue</Text>
  </TouchableOpacity>
</View>

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  bottomButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    alignItems: 'center',
    margin: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

---

## 🎯 Practice Exercises

### Exercise 1: Profile Card
Create a profile card with:
- Circular avatar at top (use borderRadius)
- Name (large, bold)
- Bio (smaller text)
- Two buttons side by side at bottom ("Follow", "Message")
- Proper spacing and shadows

### Exercise 2: Horizontal Scroll Cards
Create:
- Title at top
- Horizontal scroll of 5 cards
- Each card has image, title, subtitle
- Cards should be 300px wide

### Exercise 3: Instagram-like Post
Create a post layout:
- Header (avatar + username in row, three dots on right)
- Square image
- Like/comment/share icons in row
- Caption text below

---

## 💡 Key Takeaways

✅ React Native uses Flexbox by default with `flexDirection: 'column'`
✅ Use `flex: 1` to fill available space
✅ `justifyContent` - main axis, `alignItems` - cross axis
✅ Use percentage or Dimensions API for responsive sizing
✅ Position absolute for overlays
✅ Platform.select() for platform-specific styles
✅ Shadow (iOS) + elevation (Android) for depth

---

## 🔗 What's Next?

In the next lesson, we'll learn about:
- FlatList for efficient lists
- State management with useState
- Props and component composition

[Next Lesson: Lists & State Management →](./04-lists-state.md)

---

## 📚 Additional Resources

- [Flexbox Froggy](https://flexboxfroggy.com/) - Learn Flexbox with a game
- [Layout with Flexbox](https://reactnative.dev/docs/flexbox)
- [Height and Width](https://reactnative.dev/docs/height-and-width)

---

*Happy coding! 🚀*
