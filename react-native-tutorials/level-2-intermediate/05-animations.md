# Lesson 5: Animations with Animated API

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Create smooth animations with Animated API
- Use LayoutAnimation for automatic animations
- Implement common animation patterns
- Build interactive animated components
- Understand animation performance

---

## Animated API Basics

React Native's Animated library provides smooth, performant animations.

### Creating an Animated Value

```jsx
import { useState, useRef } from 'react';
import { Animated, View, Button, StyleSheet } from 'react-native';

export default function FadeInExample() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true, // Performance optimization
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.box,
          {
            opacity: fadeAnim,
          },
        ]}
      />
      <Button title="Fade In" onPress={fadeIn} />
      <Button title="Fade Out" onPress={fadeOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 200,
    height: 200,
    backgroundColor: '#007AFF',
    marginBottom: 20,
  },
});
```

---

## Animation Types

### 1. Timing Animation

Animates a value over time with easing:

```jsx
Animated.timing(animatedValue, {
  toValue: 100,
  duration: 500,
  easing: Easing.ease,
  useNativeDriver: true,
}).start();
```

### 2. Spring Animation

Physics-based spring animation:

```jsx
Animated.spring(animatedValue, {
  toValue: 100,
  friction: 5,      // Bounciness
  tension: 40,      // Speed
  useNativeDriver: true,
}).start();
```

### 3. Decay Animation

Gradual deceleration:

```jsx
Animated.decay(animatedValue, {
  velocity: 0.5,
  deceleration: 0.997,
  useNativeDriver: true,
}).start();
```

---

## Common Animation Examples

### Slide In Animation

```jsx
import { useRef, useEffect } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

export default function SlideIn() {
  const slideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.box,
        {
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <Text style={styles.text}>Sliding in from left!</Text>
    </Animated.View>
  );
}
```

### Scale Animation

```jsx
function ScaleButton() {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={styles.button}
      >
        <Text>Press Me</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
```

### Rotate Animation

```jsx
function SpinningLogo() {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.Image
      source={require('./logo.png')}
      style={{
        width: 100,
        height: 100,
        transform: [{ rotate: spin }],
      }}
    />
  );
}
```

---

## Interpolation

Map one value range to another:

```jsx
function InterpolationExample() {
  const animValue = useRef(new Animated.Value(0)).current;

  const backgroundColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgb(255, 0, 0)', 'rgb(0, 0, 255)'],
  });

  const rotate = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const opacity = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  return (
    <Animated.View
      style={{
        backgroundColor,
        opacity,
        transform: [{ rotate }],
        width: 100,
        height: 100,
      }}
    />
  );
}
```

---

## Combining Animations

### Parallel Animations

Run multiple animations at the same time:

```jsx
function ParallelExample() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(0)).current;

  const animate = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(moveAnim, {
        toValue: 100,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: moveAnim }],
      }}
    >
      <Text>I fade and move!</Text>
    </Animated.View>
  );
}
```

### Sequence Animations

Run animations one after another:

```jsx
function SequenceExample() {
  const animValue = useRef(new Animated.Value(0)).current;

  const animate = () => {
    Animated.sequence([
      Animated.timing(animValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(500), // Wait 500ms
      Animated.timing(animValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={{ opacity: animValue }}
    >
      <Text>I appear, wait, then disappear!</Text>
    </Animated.View>
  );
}
```

### Stagger Animations

Start animations with delays:

```jsx
function StaggerExample() {
  const anims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const animate = () => {
    const animations = anims.map(anim =>
      Animated.spring(anim, {
        toValue: 1,
        useNativeDriver: true,
      })
    );

    Animated.stagger(100, animations).start();
  };

  return (
    <View>
      {anims.map((anim, index) => (
        <Animated.View
          key={index}
          style={{
            opacity: anim,
            transform: [
              {
                translateY: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                }),
              },
            ],
          }}
        >
          <Text>Item {index + 1}</Text>
        </Animated.View>
      ))}
    </View>
  );
}
```

---

## LayoutAnimation

Automatic animations for layout changes:

```jsx
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  StyleSheet,
} from 'react-native';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function LayoutAnimationExample() {
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState(['Item 1', 'Item 2']);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const addItem = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setItems([...items, `Item ${items.length + 1}`]);
  };

  const removeItem = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={toggleExpand}>
        <Text>Toggle Expand</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandedContent}>
          <Text>Expanded content appears here!</Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={addItem}>
        <Text>Add Item</Text>
      </TouchableOpacity>

      {items.map((item, index) => (
        <View key={index} style={styles.item}>
          <Text>{item}</Text>
          <TouchableOpacity onPress={() => removeItem(index)}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
```

---

## Complete Example: Animated Modal

```jsx
import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';

const { height } = Dimensions.get('window');

export default function AnimatedModal() {
  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      openModal();
    } else {
      closeModal();
    }
  }, [visible]);

  const openModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  if (!visible && fadeAnim._value === 0) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.openButton}
          onPress={() => setVisible(true)}
        >
          <Text style={styles.buttonText}>Open Modal</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.buttonText}>Open Modal</Text>
      </TouchableOpacity>

      {/* Backdrop */}
      <Animated.View
        style={[
          styles.backdrop,
          { opacity: fadeAnim },
        ]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={() => setVisible(false)}
        />
      </Animated.View>

      {/* Modal Content */}
      <Animated.View
        style={[
          styles.modal,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Animated Modal</Text>
          <TouchableOpacity onPress={() => setVisible(false)}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            This is a beautifully animated modal!
          </Text>
          <Text style={styles.modalText}>
            It slides up from the bottom with a smooth animation.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setVisible(false)}
        >
          <Text style={styles.actionButtonText}>Close</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 28,
    color: '#666',
  },
  modalContent: {
    padding: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 24,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

---

## Loading Spinner Animation

```jsx
function LoadingSpinner() {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.spinner,
          {
            transform: [{ rotate }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  spinner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 5,
    borderColor: '#007AFF',
    borderTopColor: 'transparent',
  },
});
```

---

## Pulse Animation

```jsx
function PulseIcon() {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        transform: [{ scale: pulseAnim }],
      }}
    >
      <Ionicons name="notifications" size={40} color="#007AFF" />
    </Animated.View>
  );
}
```

---

## Performance Tips

### 1. Use Native Driver

```jsx
// ✅ Good - Uses native driver
Animated.timing(value, {
  toValue: 100,
  useNativeDriver: true, // Add this!
}).start();

// ❌ Bad - JS thread animation
Animated.timing(value, {
  toValue: 100,
}).start();
```

### 2. Avoid Layout Properties

Native driver doesn't support layout properties:

```jsx
// ✅ Works with native driver
transform: [{ translateX }, { scale }]
opacity

// ❌ Doesn't work with native driver
width, height, padding, margin, top, left
```

### 3. Memoize Animation Values

```jsx
// Use useRef to preserve values across renders
const fadeAnim = useRef(new Animated.Value(0)).current;
```

---

## 🎯 Practice Exercises

### Exercise 1: Animated Like Button
Create a like button that:
- Scales up when pressed
- Changes color with fade
- Shows +1 animation flying up
- Bounces on completion

### Exercise 2: Slide-in Notifications
Build a notification system:
- Slides in from top
- Auto-dismisses after 3 seconds
- Slides out on dismiss
- Queue multiple notifications

### Exercise 3: Card Flip Animation
Create a flippable card:
- Rotates on tap (3D effect)
- Shows front/back content
- Smooth spring animation
- Shadow changes during flip

---

## 💡 Key Takeaways

✅ Always use `useNativeDriver: true` when possible
✅ Animated.timing for duration-based animations
✅ Animated.spring for physics-based animations
✅ Interpolate for complex value transformations
✅ Combine animations with parallel/sequence/stagger
✅ LayoutAnimation for automatic layout changes
✅ Use useRef to preserve animated values
✅ Consider performance on older devices

---

## 🔗 What's Next?

In the next lesson, we'll learn about:
- Native modules and APIs
- Camera access
- Location services
- Device sensors

[Next Lesson: Native Modules →](./06-native-modules.md)

---

## 📚 Additional Resources

- [Animated API Documentation](https://reactnative.dev/docs/animated)
- [LayoutAnimation](https://reactnative.dev/docs/layoutanimation)
- [Easing Functions](https://reactnative.dev/docs/easing)
- [Reanimated 2](https://docs.swmansion.com/react-native-reanimated/) - Advanced animations

---

*Happy coding! 🚀*
