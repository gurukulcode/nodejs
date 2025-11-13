# Lesson 2: Advanced Animations with Reanimated 2

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Master Reanimated 2 for high-performance animations
- Implement gesture-driven animations
- Create complex animated interactions
- Build 60 FPS animations
- Understand worklets and the UI thread

---

## Why Reanimated 2?

**Reanimated 2** runs animations on the UI thread for 60 FPS performance:

- ✅ **Smooth**: Runs on UI thread, not JS thread
- ✅ **Declarative**: Clean, readable syntax
- ✅ **Gestures**: Perfect for pan, pinch, swipe
- ✅ **Performance**: True 60 FPS animations

---

## Installation

```bash
npm install react-native-reanimated
npm install react-native-gesture-handler

# For Expo
npx expo install react-native-reanimated react-native-gesture-handler
```

### Configuration

```js
// babel.config.js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin', // Must be last!
  ],
};
```

---

## Basic Reanimated Animation

```jsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { View, Button, StyleSheet } from 'react-native';

export default function BasicAnimation() {
  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  const moveRight = () => {
    offset.value = withSpring(100);
  };

  const moveLeft = () => {
    offset.value = withTiming(0, { duration: 300 });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, animatedStyles]} />
      <Button title="Move Right" onPress={moveRight} />
      <Button title="Move Left" onPress={moveLeft} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
});
```

---

## Gesture Handler

### Pan Gesture

```jsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

export default function DraggableBox() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.translateX = translateX.value;
      context.translateY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = context.translateX + event.translationX;
      translateY.value = context.translateY + event.translationY;
    },
    onEnd: () => {
      // Snap back to center
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={panGestureEvent}>
      <Animated.View style={[styles.box, animatedStyle]} />
    </PanGestureHandler>
  );
}
```

---

## Swipeable Card

```jsx
import { Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

export default function SwipeableCard({ onSwipeLeft, onSwipeRight }) {
  const translateX = useSharedValue(0);

  const panGesture = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: (event) => {
      const shouldDismiss = Math.abs(translateX.value) > SWIPE_THRESHOLD;

      if (shouldDismiss) {
        const direction = translateX.value > 0 ? 1 : -1;
        translateX.value = withSpring(direction * SCREEN_WIDTH, {}, () => {
          if (direction > 0) {
            runOnJS(onSwipeRight)();
          } else {
            runOnJS(onSwipeLeft)();
          }
        });
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-15, 0, 15],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [1, 0.5],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotate}deg` },
      ],
      opacity,
    };
  });

  return (
    <PanGestureHandler onGestureEvent={panGesture}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Text style={styles.cardText}>Swipe me!</Text>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH * 0.9,
    height: 400,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
});
```

---

## Bottom Sheet

```jsx
import { useState } from 'react';
import { Dimensions, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

export default function BottomSheet({ children }) {
  const translateY = useSharedValue(0);

  const panGesture = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      translateY.value = Math.max(
        context.startY + event.translationY,
        MAX_TRANSLATE_Y
      );
    },
    onEnd: (event) => {
      if (event.velocityY > 500) {
        // Swipe down fast - close
        translateY.value = withSpring(0, { velocity: event.velocityY });
      } else if (translateY.value < MAX_TRANSLATE_Y / 2) {
        // More than halfway - open fully
        translateY.value = withSpring(MAX_TRANSLATE_Y);
      } else {
        // Less than halfway - close
        translateY.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [0, MAX_TRANSLATE_Y],
      [25, 5],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY: translateY.value }],
      borderRadius,
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [0, MAX_TRANSLATE_Y],
      [0, 0.5],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  return (
    <>
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}
        pointerEvents="none"
      />
      <PanGestureHandler onGestureEvent={panGesture}>
        <Animated.View style={[styles.bottomSheet, animatedStyle]}>
          <View style={styles.handle} />
          {children}
        </Animated.View>
      </PanGestureHandler>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'black',
  },
  bottomSheet: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    top: SCREEN_HEIGHT,
    borderRadius: 25,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#ddd',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
  },
});
```

---

## Animated Modal

```jsx
import { useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

export default function AnimatedModal({ visible, onClose, children }) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1);
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.8, { duration: 200 });
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!visible && opacity.value === 0) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[styles.backdrop, backdropStyle]}
        onTouchEnd={onClose}
      />
      <Animated.View style={[styles.modal, modalStyle]}>
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignSelf: 'center',
    top: '30%',
  },
});
```

---

## Parallax Scroll

```jsx
import { ScrollView, View, Image, Text, Dimensions } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_HEIGHT = 300;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function ParallaxScroll() {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const imageStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT],
      [-IMAGE_HEIGHT / 2, 0, IMAGE_HEIGHT * 0.75],
      Extrapolate.CLAMP
    );

    const scale = interpolate(
      scrollY.value,
      [-IMAGE_HEIGHT, 0],
      [2, 1],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, IMAGE_HEIGHT / 2, IMAGE_HEIGHT],
      [0, 0, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  return (
    <View style={styles.container}>
      <AnimatedScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Animated.View style={[styles.imageContainer, imageStyle]}>
          <Image
            source={{ uri: 'https://picsum.photos/400/300' }}
            style={styles.image}
          />
        </Animated.View>

        <View style={styles.content}>
          <Text style={styles.title}>Parallax Header</Text>
          <Text style={styles.text}>
            {/* Long content here */}
          </Text>
        </View>
      </AnimatedScrollView>

      <Animated.View style={[styles.header, headerStyle]}>
        <Text style={styles.headerText}>Header</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: IMAGE_HEIGHT,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
});
```

---

## Animated Progress Bar

```jsx
import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useAnimatedProps,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function CircularProgress({ progress = 0.75 }) {
  const size = 200;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 1500 });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset =
      circumference - animatedProgress.value * circumference;

    return {
      strokeDashoffset,
    };
  });

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e0e0e0"
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      <AnimatedCircle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#007AFF"
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        animatedProps={animatedProps}
        strokeLinecap="round"
      />
    </Svg>
  );
}
```

---

## Shared Element Transition

```jsx
import { useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

export default function SharedElementExample() {
  const [expanded, setExpanded] = useState(false);

  const imageSize = useSharedValue(100);
  const imagePositionY = useSharedValue(100);

  const toggle = () => {
    if (expanded) {
      imageSize.value = withTiming(100);
      imagePositionY.value = withTiming(100);
    } else {
      imageSize.value = withTiming(300);
      imagePositionY.value = withTiming(0);
    }
    setExpanded(!expanded);
  };

  const imageStyle = useAnimatedStyle(() => {
    return {
      width: imageSize.value,
      height: imageSize.value,
      marginTop: imagePositionY.value,
    };
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggle}>
        <Animated.Image
          source={{ uri: 'https://picsum.photos/300/300' }}
          style={[styles.image, imageStyle]}
        />
      </TouchableOpacity>
    </View>
  );
}
```

---

## 🎯 Practice Exercises

### Exercise 1: Tinder-like Swipe Cards
Build a card stack where:
- Swipe right to like, left to discard
- Cards animate off screen
- Next card appears underneath
- Rotation based on swipe direction

### Exercise 2: Animated Drawer
Create a custom drawer:
- Swipe from edge to open
- Parallax effect on main content
- Smooth spring animations
- Backdrop with opacity

### Exercise 3: Animated Onboarding
Build onboarding screens with:
- Horizontal scroll with pagination
- Parallax backgrounds
- Fade in/out text
- Animated progress indicator

---

## 💡 Key Takeaways

✅ Reanimated 2 runs on UI thread for 60 FPS
✅ useSharedValue for animated values
✅ useAnimatedStyle for animated styles
✅ useAnimatedGestureHandler for gestures
✅ withSpring/withTiming for animations
✅ runOnJS to call JS functions from worklets
✅ interpolate for value transformations
✅ Always use worklets for UI thread code

---

## 🔗 What's Next?

In the next lesson, we'll learn about:
- Offline-first architecture
- NetInfo for connectivity detection
- Offline queue management
- Data synchronization

[Next Lesson: Offline-First Apps →](./03-offline-first.md)

---

## 📚 Additional Resources

- [Reanimated 2 Documentation](https://docs.swmansion.com/react-native-reanimated/)
- [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- [William Candillon YouTube](https://www.youtube.com/c/wcandillon)
- [Reanimated Examples](https://github.com/software-mansion/react-native-reanimated)

---

*Happy coding! 🚀*
