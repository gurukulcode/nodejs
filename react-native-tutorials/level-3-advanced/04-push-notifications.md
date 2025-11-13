# Lesson 4: Push Notifications & Local Notifications

## 🎯 Learning Objectives

By the end of this lesson, you will:
- Implement push notifications with Firebase
- Create local notifications
- Handle notification interactions
- Schedule notifications
- Manage notification permissions

---

## Push Notifications vs Local Notifications

**Push Notifications:**
- Sent from server
- Work even when app is closed
- Require internet connection
- Use Firebase Cloud Messaging (FCM)

**Local Notifications:**
- Created by the app locally
- Work offline
- Scheduled in advance
- No server required

---

## Setup Firebase Cloud Messaging

### Installation (Expo)

```bash
npx expo install expo-notifications expo-device expo-constants
```

### Installation (React Native CLI)

```bash
npm install @react-native-firebase/app
npm install @react-native-firebase/messaging
npm install @notifee/react-native
```

---

## Expo Notifications

### Basic Push Notification Setup

```jsx
import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// Configure how notifications are handled
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function PushNotificationApp() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // Listen for incoming notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Listen for notification interactions
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification clicked:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ marginTop: 20 }}>
        <Button
          title="Send Notification"
          onPress={async () => {
            await sendPushNotification(expoPushToken);
          }}
        />
      </View>
    </View>
  );
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    })).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}
```

---

## Local Notifications

### Schedule Local Notification

```jsx
import * as Notifications from 'expo-notifications';

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 5 },
  });
}

// Schedule for specific time
async function scheduleAtTime() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time-based notification',
      body: 'This shows at a specific time',
    },
    trigger: {
      hour: 9,
      minute: 0,
      repeats: true,
    },
  });
}

// Schedule for specific date
async function scheduleAtDate() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Reminder',
      body: 'Meeting in 1 hour',
    },
    trigger: new Date(Date.now() + 3600000), // 1 hour from now
  });
}
```

---

## Cancel Notifications

```jsx
// Cancel specific notification
await Notifications.cancelScheduledNotificationAsync(notificationId);

// Cancel all notifications
await Notifications.cancelAllScheduledNotificationsAsync();

// Get all scheduled notifications
const notifications = await Notifications.getAllScheduledNotificationsAsync();
console.log('Scheduled:', notifications);
```

---

## Notification Categories (Actions)

```jsx
// Define categories with actions
await Notifications.setNotificationCategoryAsync('message', [
  {
    identifier: 'reply',
    buttonTitle: 'Reply',
    textInput: {
      submitButtonTitle: 'Send',
      placeholder: 'Type your reply...',
    },
  },
  {
    identifier: 'dismiss',
    buttonTitle: 'Dismiss',
    options: {
      isDestructive: true,
    },
  },
]);

// Send notification with category
await Notifications.scheduleNotificationAsync({
  content: {
    title: 'New Message',
    body: 'You have a new message from John',
    categoryIdentifier: 'message',
  },
  trigger: { seconds: 1 },
});

// Handle action response
Notifications.addNotificationResponseReceivedListener(response => {
  const { actionIdentifier, userText } = response;
  
  if (actionIdentifier === 'reply') {
    console.log('User replied:', userText);
    // Send reply to server
  } else if (actionIdentifier === 'dismiss') {
    console.log('Notification dismissed');
  }
});
```

---

## Badge Count

```jsx
import * as Notifications from 'expo-notifications';

// Set badge number
await Notifications.setBadgeCountAsync(5);

// Get current badge count
const badgeCount = await Notifications.getBadgeCountAsync();

// Clear badge
await Notifications.setBadgeCountAsync(0);
```

---

## Complete Notification Service

```jsx
// services/notificationService.js
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

class NotificationService {
  constructor() {
    this.token = null;
    this.notificationListener = null;
    this.responseListener = null;
  }

  async init() {
    // Configure handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Register for notifications
    this.token = await this.registerForPushNotifications();

    // Setup listeners
    this.setupListeners();

    return this.token;
  }

  async registerForPushNotifications() {
    if (!Device.isDevice) {
      console.warn('Must use physical device for push notifications');
      return null;
    }

    // Android channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Permission not granted for notifications');
      return null;
    }

    // Get token
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  }

  setupListeners() {
    // Notification received
    this.notificationListener = Notifications.addNotificationReceivedListener(
      notification => {
        console.log('Notification received:', notification);
        this.onNotificationReceived?.(notification);
      }
    );

    // Notification clicked
    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log('Notification clicked:', response);
        this.onNotificationClicked?.(response);
      }
    );
  }

  async scheduleNotification(title, body, trigger, data = {}) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger,
    });

    return id;
  }

  async scheduleDaily(title, body, hour, minute) {
    return await this.scheduleNotification(
      title,
      body,
      {
        hour,
        minute,
        repeats: true,
      }
    );
  }

  async cancelNotification(id) {
    await Notifications.cancelScheduledNotificationAsync(id);
  }

  async cancelAll() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async getAllScheduled() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  async setBadge(count) {
    await Notifications.setBadgeCountAsync(count);
  }

  async clearBadge() {
    await Notifications.setBadgeCountAsync(0);
  }

  cleanup() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }
}

export default new NotificationService();
```

---

## Complete Example: Reminder App

```jsx
import { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import notificationService from './services/notificationService';

export default function ReminderApp() {
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    init();
    return () => notificationService.cleanup();
  }, []);

  const init = async () => {
    await notificationService.init();

    notificationService.onNotificationClicked = (response) => {
      const { data } = response.notification.request.content;
      console.log('Reminder clicked:', data);
    };

    loadReminders();
  };

  const loadReminders = async () => {
    const scheduled = await notificationService.getAllScheduled();
    setReminders(scheduled);
  };

  const addReminder = async () => {
    if (!title.trim()) return;

    const notificationId = await notificationService.scheduleNotification(
      'Reminder',
      title,
      date,
      { reminderId: Date.now().toString() }
    );

    setTitle('');
    setDate(new Date());
    await loadReminders();
  };

  const deleteReminder = async (id) => {
    await notificationService.cancelNotification(id);
    await loadReminders();
  };

  const renderReminder = ({ item }) => (
    <View style={styles.reminderItem}>
      <View style={styles.reminderContent}>
        <Text style={styles.reminderTitle}>
          {item.content.title}
        </Text>
        <Text style={styles.reminderBody}>
          {item.content.body}
        </Text>
        <Text style={styles.reminderTime}>
          {new Date(item.trigger.value).toLocaleString()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteReminder(item.identifier)}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reminders</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="What do you want to be reminded about?"
          value={title}
          onChangeText={setTitle}
        />

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>When: {date.toLocaleString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
        )}

        <TouchableOpacity style={styles.addButton} onPress={addReminder}>
          <Text style={styles.addButtonText}>Add Reminder</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={reminders}
        renderItem={renderReminder}
        keyExtractor={item => item.identifier}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No reminders scheduled</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    padding: 20,
    backgroundColor: 'white',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  reminderItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 8,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reminderBody: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  reminderTime: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    justifyContent: 'center',
    paddingLeft: 15,
  },
  deleteText: {
    color: '#ff3b30',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
  },
});
```

---

## 🎯 Practice Exercises

### Exercise 1: Daily Habit Tracker
Build a habit tracker with:
- Daily reminder notifications
- Completion tracking
- Streak counter
- Custom notification times

### Exercise 2: Chat App Notifications
Create notifications for:
- New messages
- Message actions (reply, mark read)
- Group mentions
- Badge count for unread

### Exercise 3: Event Reminder System
Build an event app with:
- Multiple reminders per event
- Snooze functionality
- Rich notifications with images
- Calendar integration

---

## 💡 Key Takeaways

✅ Request permissions before sending notifications
✅ Test on real devices, not simulators
✅ Use local notifications for offline reminders
✅ Handle notification interactions properly
✅ Clear badges when appropriate
✅ Provide notification settings in app
✅ Don't spam users with notifications
✅ Test on both iOS and Android

---

## 🔗 What's Next?

In the next lesson, we'll learn about:
- Testing React Native apps
- Jest configuration
- React Native Testing Library
- E2E testing with Detox

[Next Lesson: Testing →](./05-testing.md)

---

## 📚 Additional Resources

- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Notifee Documentation](https://notifee.app/)
- [Apple Push Notification Service](https://developer.apple.com/notifications/)

---

*Happy coding! 🚀*
