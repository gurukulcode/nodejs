# Problem #006: Text Component Deep Dive

**Difficulty**: 🟢 Easy
**Category**: React Native Fundamentals
**Time**: 10-12 minutes

---

## 📝 Problem Statement

**Question 1**: What is the Text component and why is it required in React Native?

**Question 2**: What are the key props and styling options available for Text?

**Question 3**: How do you handle text nesting, selection, and overflow?

---

## 🎯 What Interviewers Look For

- Understanding that ALL text must be in Text components
- Knowledge of Text-specific props (numberOfLines, ellipsizeMode, etc.)
- Awareness of nested Text styling behavior
- Practical text handling patterns

---

## ✅ Complete Answer

### Question 1: Text Component Purpose

#### **Why Text is Required**

**❌ This doesn't work:**
```jsx
import { View } from 'react-native';

function Component() {
  return (
    <View>
      Hello World  {/* ERROR! */}
    </View>
  );
}
// Error: Text strings must be rendered within a <Text> component
```

**✅ Correct usage:**
```jsx
import { View, Text } from 'react-native';

function Component() {
  return (
    <View>
      <Text>Hello World</Text>
    </View>
  );
}
```

#### **Why This Rule Exists**

1. **Platform Consistency**: Text rendering differs between iOS and Android
2. **Typography Control**: Centralized text styling and behavior
3. **Performance**: Native text rendering optimizations
4. **Accessibility**: Screen readers can properly identify text content

#### **Native Mapping**

```
<Text> Component
      ↓
   ┌──┴──┐
   ↓     ↓
iOS:     Android:
UILabel   TextView
```

---

### Question 2: Text Props and Styling

#### **Essential Props**

```jsx
import { Text } from 'react-native';

<Text
  // Content truncation
  numberOfLines={2}
  ellipsizeMode="tail"  // 'head', 'middle', 'tail', 'clip'

  // User interaction
  selectable={true}
  onPress={() => console.log('Tapped')}
  onLongPress={() => console.log('Long pressed')}

  // Accessibility
  accessible={true}
  accessibilityLabel="Welcome message"
  accessibilityRole="text"

  // Testing
  testID="welcome-text"

  // Styling
  style={styles.text}
>
  Content here
</Text>
```

#### **Text Styling Properties**

```jsx
const styles = StyleSheet.create({
  text: {
    // Font
    fontFamily: 'Arial',
    fontSize: 16,
    fontWeight: '400',  // '100'-'900', 'normal', 'bold'
    fontStyle: 'normal',  // 'normal', 'italic'

    // Color
    color: '#333',

    // Alignment
    textAlign: 'left',  // 'left', 'right', 'center', 'justify'
    textAlignVertical: 'top',  // Android only: 'top', 'center', 'bottom'

    // Decoration
    textDecorationLine: 'underline',  // 'none', 'underline', 'line-through', 'underline line-through'
    textDecorationStyle: 'solid',  // 'solid', 'double', 'dotted', 'dashed'
    textDecorationColor: '#000',

    // Shadow (iOS)
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,

    // Spacing
    letterSpacing: 0.5,
    lineHeight: 24,

    // Transform
    textTransform: 'none',  // 'none', 'uppercase', 'lowercase', 'capitalize'

    // Other
    includeFontPadding: false,  // Android only
    writingDirection: 'auto',  // 'auto', 'ltr', 'rtl'
  },
});
```

#### **Complete Example**

```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TextShowcase = () => {
  return (
    <View style={styles.container}>
      {/* Heading */}
      <Text style={styles.heading}>
        Text Component Examples
      </Text>

      {/* Truncated text */}
      <Text
        style={styles.truncated}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        This is a very long text that will be truncated after two lines.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Text>

      {/* Clickable text */}
      <Text
        style={styles.link}
        onPress={() => console.log('Link pressed')}
      >
        Click me - I'm a link!
      </Text>

      {/* Selectable text */}
      <Text
        style={styles.selectable}
        selectable={true}
      >
        You can select and copy this text
      </Text>

      {/* Styled text */}
      <Text style={styles.decorative}>
        Decorated Text
      </Text>

      {/* All caps */}
      <Text style={styles.uppercase}>
        This will be uppercase
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  truncated: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  link: {
    fontSize: 16,
    color: '#007AFF',
    textDecorationLine: 'underline',
    marginBottom: 15,
  },
  selectable: {
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 15,
  },
  decorative: {
    fontSize: 18,
    color: '#9C27B0',
    textDecorationLine: 'underline',
    textDecorationStyle: 'dashed',
    textDecorationColor: '#9C27B0',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  uppercase: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
});

export default TextShowcase;
```

---

### Question 3: Advanced Text Features

#### **1. Nested Text**

```jsx
// Nested Text inherits parent styles
<Text style={{ fontSize: 16, color: 'black' }}>
  This is regular text.
  <Text style={{ fontWeight: 'bold' }}>
    {' '}This is bold.
  </Text>
  <Text style={{ fontStyle: 'italic', color: 'blue' }}>
    {' '}This is italic and blue.
  </Text>
  {' '}Back to regular.
</Text>
```

**Output styling:**
- "This is regular text." - fontSize: 16, color: black
- "This is bold." - fontSize: 16 (inherited), color: black (inherited), fontWeight: bold
- "This is italic and blue." - fontSize: 16 (inherited), fontStyle: italic, color: blue (overrides)

#### **2. Text with Icons (Inline)**

```jsx
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

<Text style={styles.text}>
  <Icon name="heart" size={16} color="red" />
  {' '}Like this post
</Text>
```

#### **3. Text Truncation**

```jsx
// Single line with ellipsis
<Text numberOfLines={1} ellipsizeMode="tail">
  Very long text that will be cut off with...
</Text>

// Multiple lines with ellipsis
<Text numberOfLines={3} ellipsizeMode="tail">
  Multiple lines of content that will be truncated
  after exactly three lines with an ellipsis...
</Text>

// Ellipsis at the beginning
<Text numberOfLines={1} ellipsizeMode="head">
  ...end of a long file path
</Text>

// Ellipsis in the middle
<Text numberOfLines={1} ellipsizeMode="middle">
  very-long-file-name-in-the-middle.pdf
</Text>
```

#### **4. Selectable Text**

```jsx
// Allow text selection and copy
<Text selectable={true} style={styles.text}>
  Select me to copy
</Text>

// Disable selection (default)
<Text selectable={false}>
  Cannot be selected
</Text>
```

#### **5. Rich Text Formatting**

```jsx
const RichText = () => {
  return (
    <Text style={styles.paragraph}>
      Welcome to{' '}
      <Text style={styles.bold}>React Native</Text>
      ! You can create{' '}
      <Text style={styles.italic}>beautiful</Text>
      {' '}and{' '}
      <Text style={styles.highlight}>rich</Text>
      {' '}text with{' '}
      <Text
        style={styles.link}
        onPress={() => console.log('Link pressed')}
      >
        nested Text components
      </Text>
      .
    </Text>
  );
};

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  highlight: {
    backgroundColor: '#FFEB3B',
    fontWeight: '600',
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});
```

---

## 🎯 numberOfLines Use Cases

```jsx
import React, { useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

const ExpandableText = ({ text }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View>
      <Text
        numberOfLines={expanded ? undefined : 3}
        style={styles.text}
      >
        {text}
      </Text>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text style={styles.readMore}>
          {expanded ? 'Read less' : 'Read more'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  readMore: {
    color: '#007AFF',
    marginTop: 5,
    fontWeight: '600',
  },
});
```

---

## 🚀 Follow-up Questions

**Q1**: Can Text components be nested infinitely?
**A**: Yes, Text components can be nested and child Text inherits parent styles, which is useful for inline formatting.

**Q2**: How do you measure text height in React Native?
**A**: Use the `onTextLayout` prop or `onLayout` prop to get text dimensions after rendering.

**Q3**: How do you implement custom fonts?
**A**: Use `react-native-vector-icons` or add custom fonts to your project and reference them with the `fontFamily` style prop.

**Q4**: Can Text be a flex container?
**A**: No, Text uses a specialized text layout. For flex layouts, use View with Text children.

**Q5**: How do you handle line breaks?
**A**: Use `\n` in strings or split text into multiple Text components.

---

## ✅ Common Mistakes

❌ **Mistake 1**: Text outside Text component
```jsx
// ❌ Won't work
<View>Hello</View>

// ✅ Correct
<View><Text>Hello</Text></View>
```

❌ **Mistake 2**: Forgetting spaces in nested Text
```jsx
// ❌ No space between words
<Text>
  Hello
  <Text>World</Text>
</Text>
// Output: "HelloWorld"

// ✅ Add explicit spaces
<Text>
  Hello{' '}
  <Text>World</Text>
</Text>
// Output: "Hello World"
```

❌ **Mistake 3**: Using View styles on Text
```jsx
// ❌ Some View styles don't work on Text
<Text style={{ flex: 1, flexDirection: 'row' }}>
  Text content
</Text>

// ✅ Use Text-specific styles
<Text style={{ fontSize: 16, color: '#333' }}>
  Text content
</Text>
```

❌ **Mistake 4**: Not setting numberOfLines with ellipsizeMode
```jsx
// ❌ ellipsizeMode without numberOfLines does nothing
<Text ellipsizeMode="tail">Long text...</Text>

// ✅ Must set both
<Text numberOfLines={2} ellipsizeMode="tail">
  Long text...
</Text>
```

---

## 📊 Text vs View Comparison

| Feature | Text | View |
|---------|------|------|
| **Can contain text** | ✅ Yes | ❌ No (needs Text wrapper) |
| **Can be nested** | ✅ Yes (inherits styles) | ✅ Yes |
| **Supports onPress** | ✅ Yes | ❌ No (use Touchable) |
| **Flex container** | ❌ No | ✅ Yes |
| **Font styling** | ✅ Yes | ❌ No |
| **Text selection** | ✅ Yes (selectable prop) | ❌ N/A |

---

## 📚 Additional Reading

- [Text Component Docs](https://reactnative.dev/docs/text)
- [Text Style Props](https://reactnative.dev/docs/text-style-props)
- [Custom Fonts Guide](https://reactnative.dev/docs/custom-fonts)

---

## ✅ Interview Tips

**Do:**
- ✅ Emphasize that ALL text must be in Text
- ✅ Demonstrate nested Text with style inheritance
- ✅ Show awareness of numberOfLines for truncation
- ✅ Mention platform-specific differences

**Don't:**
- ❌ Forget explicit spaces in nested Text
- ❌ Try to use flex layout props on Text
- ❌ Assume web text behavior translates directly
- ❌ Ignore accessibility props

---

**Difficulty**: 🟢 Easy
**Estimated Time**: 10-12 minutes
**Next Problem**: [#007: Image Component →](./problem-007-image-component.md)

---

*This problem is part of the React Native Interview Problems Collection*
