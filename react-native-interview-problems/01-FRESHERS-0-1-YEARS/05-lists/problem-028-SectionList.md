# Problem #028: SectionList

**Difficulty**: 🟢 Easy
**Category**: Lists
**Time**: 10-12 minutes

---

## 📝 Problem Statement

**Question 1**: What is SectionList and how do you use it?
**Question 2**: What are common use cases and props?
**Question 3**: Show practical implementation with data.

---

## ✅ Complete Answer

### Basic Usage

```jsx
import { FlatList, Text, View } from 'react-native';

const ListComponent = () => {
  const data = [
    { id: '1', title: 'Item 1' },
    { id: '2', title: 'Item 2' },
  ];

  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={{ padding: 10 }}>
          <Text>{item.title}</Text>
        </View>
      )}
    />
  );
};
```

### Key Features

- ✅ Virtualized rendering
- ✅ Performance optimized
- ✅ Built-in scroll handling
- ✅ Pull-to-refresh support

---

**Difficulty**: 🟢 Easy
**Estimated Time**: 10-12 minutes

---

*This problem is part of the React Native Interview Problems Collection*
