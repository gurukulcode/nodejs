# Problem #009: ScrollView Basics

**Difficulty**: 🟢 Easy
**Category**: React Native Fundamentals
**Time**: 10-12 minutes

---

## 📝 Problem Statement

**Question 1**: What is ScrollView and when should you use it?

**Question 2**: Explain the difference between ScrollView and FlatList.

**Question 3**: How do you implement horizontal scrolling and handle scroll events?

---

## 🎯 What Interviewers Look For

- Understanding of ScrollView purpose and limitations
- Knowledge of when to use ScrollView vs FlatList
- Awareness of performance implications
- Practical scroll handling implementation

---

## ✅ Complete Answer

### Question 1: ScrollView Overview

#### **Basic Usage**

```jsx
import { ScrollView, Text, View } from 'react-native';

<ScrollView>
  <Text>Content that can scroll</Text>
  <View style={{ height: 2000 }}>
    <Text>Tall content...</Text>
  </View>
</ScrollView>
```

#### **Key Props**

```jsx
<ScrollView
  // Scrolling behavior
  horizontal={false}  // false = vertical, true = horizontal
  showsVerticalScrollIndicator={true}
  showsHorizontalScrollIndicator={true}
  scrollEnabled={true}
  bounces={true}  // iOS bounce effect

  // Pagination
  pagingEnabled={false}  // Snap to pages
  snapToInterval={200}  // Snap every 200 pixels
  decelerationRate="normal"  // 'normal', 'fast', number

  // Events
  onScroll={(event) => {}}
  onScrollBeginDrag={() => {}}
  onScrollEndDrag={() => {}}
  onMomentumScrollBegin={() => {}}
  onMomentumScrollEnd={() => {}}

  // Keyboard
  keyboardShouldPersistTaps="handled"  // 'never', 'always', 'handled'
  keyboardDismissMode="on-drag"  // 'none', 'on-drag', 'interactive'

  // Styling
  contentContainerStyle={styles.contentContainer}
  style={styles.scrollView}

  // Refresh control
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  }
>
  {/* Content */}
</ScrollView>
```

---

### Question 2: ScrollView vs FlatList

```jsx
// ScrollView - Renders ALL children immediately
<ScrollView>
  {data.map((item, index) => (
    <View key={index}>
      <Text>{item.title}</Text>
    </View>
  ))}
</ScrollView>

// FlatList - Renders only visible items (virtualized)
<FlatList
  data={data}
  renderItem={({ item }) => (
    <View>
      <Text>{item.title}</Text>
    </View>
  )}
  keyExtractor={(item) => item.id}
/>
```

#### **When to Use Each**

| Use ScrollView | Use FlatList |
|----------------|--------------|
| Small lists (< 100 items) | Large lists (100+ items) |
| Complex layouts | Simple, repeating items |
| Mixed content types | Uniform list items |
| Full content needs to render | Performance is critical |
| Pull-to-refresh needed | Infinite scroll needed |

#### **Performance Comparison**

```jsx
// ❌ Poor performance with large data
<ScrollView>
  {/* Renders all 1000 items immediately! */}
  {bigArray.map(item => <Item key={item.id} {...item} />)}
</ScrollView>

// ✅ Good performance - virtualizes
<FlatList
  data={bigArray}  // Only renders ~10 visible items
  renderItem={({ item }) => <Item {...item} />}
  keyExtractor={item => item.id}
/>
```

---

### Question 3: Horizontal Scrolling

```jsx
import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';

const { width } = Dimensions.get('window');

const HorizontalScroll = () => {
  const categories = [
    { id: 1, name: 'Featured', image: 'https://...' },
    { id: 2, name: 'Popular', image: 'https://...' },
    { id: 3, name: 'New', image: 'https://...' },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      pagingEnabled={false}
      decelerationRate="fast"
      snapToInterval={width * 0.8 + 10}  // Card width + margin
      snapToAlignment="start"
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => (
        <View key={category.id} style={styles.card}>
          <Image
            source={{ uri: category.image }}
            style={styles.image}
          />
          <Text style={styles.name}>{category.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  card: {
    width: width * 0.8,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  name: {
    padding: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

---

## 💡 Complete ScrollView Example

```jsx
import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from 'react-native';

const ScrollViewExample = () => {
  const scrollViewRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      console.log('Refreshed!');
    }, 2000);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollY(offsetY);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Scroll Position Indicator */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Scroll Position: {Math.round(scrollY)}px
        </Text>
      </View>

      {/* ScrollView */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}  // Fire every 16ms (~60fps)
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}  // Android
            tintColor="#007AFF"   // iOS
          />
        }
      >
        {/* Content */}
        {Array.from({ length: 20 }, (_, i) => (
          <View key={i} style={styles.item}>
            <Text style={styles.itemText}>Item {i + 1}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Control Buttons */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.button}
          onPress={scrollToTop}
        >
          <Text style={styles.buttonText}>Scroll to Top</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={scrollToBottom}
        >
          <Text style={styles.buttonText}>Scroll to Bottom</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
    backgroundColor: '#007AFF',
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 15,
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
  },
  controls: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
  },
  button: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ScrollViewExample;
```

---

## 🎯 Advanced Patterns

#### **Nested ScrollViews**

```jsx
// ⚠️ Avoid if possible - can cause conflicts
<ScrollView vertical>
  <ScrollView horizontal>
    {/* Horizontal content */}
  </ScrollView>
  <Text>More content</Text>
</ScrollView>

// ✅ Better: Use FlatList with horizontal prop
<FlatList
  data={items}
  renderItem={({ item }) => (
    <View>
      <FlatList
        horizontal
        data={item.subitems}
        renderItem={...}
      />
    </View>
  )}
/>
```

#### **Sticky Headers**

```jsx
<ScrollView
  stickyHeaderIndices={[0, 5, 10]}  // Indices of sticky headers
>
  <View><Text>Sticky Header 1</Text></View>
  <View><Text>Content</Text></View>
  <View><Text>Content</Text></View>
  {/* ... */}
</ScrollView>
```

---

## 🚀 Follow-up Questions

**Q1**: What is scrollEventThrottle?
**A**: Controls how often the onScroll event fires (in milliseconds). Lower values = more frequent updates but higher performance cost. 16ms ≈ 60fps.

**Q2**: What's the difference between style and contentContainerStyle?
**A**: style applies to the ScrollView container, contentContainerStyle applies to the inner content wrapper.

**Q3**: How do you implement pull-to-refresh?
**A**: Use the RefreshControl component in the refreshControl prop of ScrollView.

**Q4**: Can you disable scrolling programmatically?
**A**: Yes, using the scrollEnabled prop: `<ScrollView scrollEnabled={false}>`

---

## ✅ Common Mistakes

❌ **Mistake 1**: Using ScrollView for large lists
```jsx
// ❌ Poor performance
<ScrollView>
  {bigArray.map(item => <Item />)}
</ScrollView>

// ✅ Use FlatList
<FlatList data={bigArray} renderItem={...} />
```

❌ **Mistake 2**: Not setting contentContainerStyle for padding
```jsx
// ❌ Won't work - padding on wrong element
<ScrollView style={{ padding: 20 }}>

// ✅ Use contentContainerStyle
<ScrollView contentContainerStyle={{ padding: 20 }}>
```

❌ **Mistake 3**: Forgetting flex: 1 on parent
```jsx
// ❌ ScrollView won't scroll
<View>
  <ScrollView>...</ScrollView>
</View>

// ✅ Parent needs defined height
<View style={{ flex: 1 }}>
  <ScrollView>...</ScrollView>
</View>
```

---

**Difficulty**: 🟢 Easy
**Estimated Time**: 10-12 minutes
**Next Problem**: [#010: Platform Differences →](./problem-010-platform-differences.md)

---

*This problem is part of the React Native Interview Problems Collection*
