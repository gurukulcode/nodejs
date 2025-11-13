# Lesson 6: Native Modules & Platform APIs

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Access device camera and photos
- Use geolocation services
- Access device sensors
- Handle platform-specific features
- Work with native device capabilities

---

## Platform Detection

Check and handle different platforms:

```jsx
import { Platform, StyleSheet } from 'react-native';

// Platform.OS
console.log(Platform.OS); // 'ios' or 'android'

// Conditional code
if (Platform.OS === 'ios') {
  // iOS-specific code
} else if (Platform.OS === 'android') {
  // Android-specific code
}

// Platform.select
const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        paddingTop: 20,
      },
      android: {
        paddingTop: 10,
      },
    }),
  },
});

// Platform.Version
console.log(Platform.Version); // iOS: '14.0', Android: 30
```

---

## Camera & Image Picker

### Installation

```bash
# Expo
npx expo install expo-image-picker expo-camera

# React Native CLI
npm install react-native-image-picker
npm install react-native-camera
```

### Using Expo Image Picker

```jsx
import { useState } from 'react';
import { View, Image, Button, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerExample() {
  const [image, setImage] = useState(null);

  // Request permissions
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return false;
    }
    return true;
  };

  // Pick from gallery
  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  return (
    <View style={styles.container}>
      {image && (
        <Image source={{ uri: image }} style={styles.image} />
      )}

      <View style={styles.buttons}>
        <Button title="Pick from Gallery" onPress={pickImage} />
        <Button title="Take Photo" onPress={takePhoto} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttons: {
    gap: 10,
  },
});
```

---

## Geolocation

### Installation

```bash
# Expo
npx expo install expo-location

# React Native CLI
npm install @react-native-community/geolocation
```

### Using Expo Location

```jsx
import { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

export default function LocationExample() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Request permission and get current location
  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(location);

      // Reverse geocoding (get address from coordinates)
      const addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addresses.length > 0) {
        setAddress(addresses[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Watch position changes
  const watchLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied');
      return;
    }

    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 10, // Update every 10 meters
      },
      (newLocation) => {
        setLocation(newLocation);
        console.log('New location:', newLocation);
      }
    );

    // Remember to unsubscribe when done
    // subscription.remove();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location Demo</Text>

      <Button
        title="Get Current Location"
        onPress={getCurrentLocation}
        disabled={loading}
      />

      {loading && <ActivityIndicator size="large" color="#007AFF" />}

      {error && <Text style={styles.error}>Error: {error}</Text>}

      {location && (
        <View style={styles.locationInfo}>
          <Text style={styles.label}>Coordinates:</Text>
          <Text>Latitude: {location.coords.latitude.toFixed(6)}</Text>
          <Text>Longitude: {location.coords.longitude.toFixed(6)}</Text>
          <Text>Accuracy: {location.coords.accuracy.toFixed(2)}m</Text>

          {address && (
            <>
              <Text style={[styles.label, { marginTop: 20 }]}>Address:</Text>
              <Text>{address.street}</Text>
              <Text>{address.city}, {address.region}</Text>
              <Text>{address.postalCode}</Text>
              <Text>{address.country}</Text>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  locationInfo: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  error: {
    color: '#ff3b30',
    marginTop: 10,
  },
});
```

---

## Device Sensors

### Accelerometer

```jsx
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';

export default function AccelerometerExample() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    // Set update interval (in ms)
    Accelerometer.setUpdateInterval(100);

    // Subscribe to sensor updates
    const subscription = Accelerometer.addListener(accelerometerData => {
      setData(accelerometerData);
    });

    // Cleanup
    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accelerometer</Text>
      <Text style={styles.data}>X: {data.x.toFixed(2)}</Text>
      <Text style={styles.data}>Y: {data.y.toFixed(2)}</Text>
      <Text style={styles.data}>Z: {data.z.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  data: {
    fontSize: 18,
    marginVertical: 5,
  },
});
```

### Gyroscope

```jsx
import { Gyroscope } from 'expo-sensors';

const subscription = Gyroscope.addListener(gyroscopeData => {
  console.log('Gyroscope:', gyroscopeData);
  // gyroscopeData: { x, y, z }
});
```

---

## File System Access

```bash
npx expo install expo-file-system
```

```jsx
import * as FileSystem from 'expo-file-system';

export default function FileSystemExample() {
  const [content, setContent] = useState('');

  const writeFile = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + 'myfile.txt';
      await FileSystem.writeAsStringAsync(fileUri, 'Hello from React Native!');
      Alert.alert('Success', 'File written');
    } catch (error) {
      console.error('Error writing file:', error);
    }
  };

  const readFile = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + 'myfile.txt';
      const contents = await FileSystem.readAsStringAsync(fileUri);
      setContent(contents);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  const downloadFile = async () => {
    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        'https://example.com/image.jpg',
        FileSystem.documentDirectory + 'image.jpg'
      );

      const { uri } = await downloadResumable.downloadAsync();
      console.log('Downloaded to:', uri);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Write File" onPress={writeFile} />
      <Button title="Read File" onPress={readFile} />
      <Button title="Download File" onPress={downloadFile} />
      {content && <Text>File content: {content}</Text>}
    </View>
  );
}
```

---

## Contacts Access

```bash
npx expo install expo-contacts
```

```jsx
import * as Contacts from 'expo-contacts';
import { useState } from 'react';

export default function ContactsExample() {
  const [contacts, setContacts] = useState([]);

  const loadContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied');
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Emails,
        ],
      });

      if (data.length > 0) {
        setContacts(data);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Load Contacts" onPress={loadContacts} />

      <FlatList
        data={contacts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.contact}>
            <Text style={styles.name}>{item.name}</Text>
            {item.phoneNumbers && (
              <Text>{item.phoneNumbers[0]?.number}</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}
```

---

## Device Info

```bash
npm install expo-device
```

```jsx
import * as Device from 'expo-device';

export default function DeviceInfoExample() {
  return (
    <View style={styles.container}>
      <Text>Brand: {Device.brand}</Text>
      <Text>Manufacturer: {Device.manufacturer}</Text>
      <Text>Model: {Device.modelName}</Text>
      <Text>OS: {Device.osName} {Device.osVersion}</Text>
      <Text>Platform: {Device.platformApiLevel}</Text>
      <Text>Device Type: {Device.deviceType}</Text>
      <Text>Is Device: {Device.isDevice ? 'Yes' : 'No (Simulator)'}</Text>
    </View>
  );
}
```

---

## Haptic Feedback

```jsx
import * as Haptics from 'expo-haptics';

// Light impact
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// Medium impact
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// Heavy impact
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

// Success notification
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// Error notification
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

// Selection feedback
await Haptics.selectionAsync();
```

---

## Sharing Content

```jsx
import { Share, Button } from 'react-native';

const shareContent = async () => {
  try {
    const result = await Share.share({
      message: 'Check out this awesome app!',
      url: 'https://myapp.com',
      title: 'My App',
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log('Shared with activity type:', result.activityType);
      } else {
        console.log('Content shared');
      }
    } else if (result.action === Share.dismissedAction) {
      console.log('Share dismissed');
    }
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};

<Button title="Share" onPress={shareContent} />
```

---

## Clipboard

```jsx
import * as Clipboard from 'expo-clipboard';

// Copy to clipboard
const copyToClipboard = async (text) => {
  await Clipboard.setStringAsync(text);
  Alert.alert('Copied', 'Text copied to clipboard');
};

// Paste from clipboard
const pasteFromClipboard = async () => {
  const text = await Clipboard.getStringAsync();
  console.log('Clipboard content:', text);
  return text;
};
```

---

## Battery Status

```bash
npx expo install expo-battery
```

```jsx
import * as Battery from 'expo-battery';
import { useState, useEffect } from 'react';

export default function BatteryExample() {
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [batteryState, setBatteryState] = useState(null);

  useEffect(() => {
    const getBatteryInfo = async () => {
      const level = await Battery.getBatteryLevelAsync();
      const state = await Battery.getBatteryStateAsync();
      setBatteryLevel(level);
      setBatteryState(state);
    };

    getBatteryInfo();

    const subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      setBatteryLevel(batteryLevel);
    });

    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Battery Level: {(batteryLevel * 100).toFixed(0)}%</Text>
      <Text>
        Status: {
          batteryState === Battery.BatteryState.CHARGING
            ? 'Charging'
            : 'Not Charging'
        }
      </Text>
    </View>
  );
}
```

---

## Complete Example: Profile App with Native Features

```jsx
import { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Share,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';

export default function ProfileApp() {
  const [profileImage, setProfileImage] = useState(null);
  const [location, setLocation] = useState(null);

  const pickImage = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const getLocation = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setLocation(location.coords);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const shareProfile = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    await Share.share({
      message: 'Check out my profile!',
      title: 'My Profile',
    });
  };

  const copyCoordinates = async () => {
    if (location) {
      await Haptics.selectionAsync();
      const coords = `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
      await Clipboard.setStringAsync(coords);
      Alert.alert('Copied', 'Coordinates copied to clipboard');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      {/* Profile Image */}
      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>Tap to add photo</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Location */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        {location ? (
          <TouchableOpacity onPress={copyCoordinates}>
            <Text style={styles.coordinates}>
              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </Text>
            <Text style={styles.hint}>Tap to copy</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.noData}>No location data</Text>
        )}
        <TouchableOpacity style={styles.button} onPress={getLocation}>
          <Text style={styles.buttonText}>Get Current Location</Text>
        </TouchableOpacity>
      </View>

      {/* Device Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device</Text>
        <Text>Platform: {Platform.OS}</Text>
        <Text>Version: {Platform.Version}</Text>
      </View>

      {/* Share Button */}
      <TouchableOpacity style={styles.shareButton} onPress={shareProfile}>
        <Text style={styles.shareButtonText}>Share Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  placeholderImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  coordinates: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 5,
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  noData: {
    color: '#999',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  shareButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

---

## 🎯 Practice Exercises

### Exercise 1: Photo Gallery App
Build a photo gallery that:
- Picks multiple images from library
- Takes photos with camera
- Displays in grid layout
- Share selected photos
- Save to device storage

### Exercise 2: Location Tracker
Create a location tracking app:
- Get current location
- Watch location changes
- Display on map (use MapView)
- Calculate distance traveled
- Save location history

### Exercise 3: Device Dashboard
Build a device info dashboard showing:
- Battery level and status
- Device specs
- Network status
- Accelerometer data in real-time
- Clipboard manager

---

## 💡 Key Takeaways

✅ Always request permissions before accessing native features
✅ Handle permission denials gracefully
✅ Use Platform.select for platform-specific code
✅ Expo provides easy access to most native APIs
✅ Test on real devices, not just simulators
✅ Haptic feedback improves UX
✅ Remember to unsubscribe from sensor listeners
✅ Handle errors from native modules

---

## 🔗 What's Next?

In the next lesson, we'll learn about:
- Performance optimization techniques
- FlatList optimization
- Memoization with useMemo and memo
- Bundle size optimization

[Next Lesson: Performance Optimization →](../level-3-advanced/01-performance-optimization.md)

---

## 📚 Additional Resources

- [Expo SDK Reference](https://docs.expo.dev/versions/latest/)
- [React Native Community Modules](https://github.com/react-native-community)
- [Platform Specific Code](https://reactnative.dev/docs/platform-specific-code)
- [Permissions Guide](https://docs.expo.dev/guides/permissions/)

---

*Happy coding! 🚀*
