# Problem #127: Render Props Pattern

**Difficulty**: 🔴 Hard
**Category**: Advanced Patterns
**Time**: 20-25 minutes

---

## 📝 Problem Statement

**Question 1**: How do you implement Render Props Pattern pattern?
**Question 2**: When should you use this pattern?
**Question 3**: Show real-world examples.

---

## ✅ Complete Answer

```jsx
// Compound Components Pattern
const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
};

Tabs.Tab = ({ index, children }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <TouchableOpacity onPress={() => setActiveTab(index)}>
      {children}
    </TouchableOpacity>
  );
};

// Usage
<Tabs>
  <Tabs.Tab index={0}>Tab 1</Tabs.Tab>
  <Tabs.Tab index={1}>Tab 2</Tabs.Tab>
</Tabs>
```

### Pattern Benefits
- ✅ Flexible API
- ✅ Better composition
- ✅ Type safety
- ✅ Reusable logic

---

**Difficulty**: 🔴 Hard
**Estimated Time**: 20-25 minutes

---

*This problem is part of the React Native Interview Problems Collection*
