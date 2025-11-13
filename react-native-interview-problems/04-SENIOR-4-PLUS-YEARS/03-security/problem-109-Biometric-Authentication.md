# Problem #109: Biometric Authentication

**Difficulty**: 🔴 Hard
**Category**: Security
**Time**: 20-25 minutes

---

## 📝 Problem Statement

**Question 1**: How do you implement Biometric Authentication?
**Question 2**: Secure sensitive data in React Native.
**Question 3**: Prevent common security vulnerabilities.

---

## ✅ Complete Answer

```jsx
import * as Keychain from 'react-native-keychain';
import ReactNativeBiometrics from 'react-native-biometrics';

const secureLogin = async (credentials) => {
  // Biometric authentication
  const { success } = await ReactNativeBiometrics.simplePrompt({
    promptMessage: 'Confirm fingerprint',
  });

  if (success) {
    // Store credentials securely
    await Keychain.setGenericPassword(
      credentials.username,
      credentials.password,
      { service: 'myapp' }
    );
  }
};
```

### Security Best Practices
- ✅ Never store secrets in code
- ✅ Use secure storage for tokens
- ✅ Implement certificate pinning
- ✅ Obfuscate sensitive code
- ✅ Enable biometric authentication

---

**Difficulty**: 🔴 Hard
**Estimated Time**: 20-25 minutes

---

*This problem is part of the React Native Interview Problems Collection*
