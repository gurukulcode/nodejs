# Problem #115: Version Management

**Difficulty**: 🔴 Hard
**Category**: CI/CD
**Time**: 20-25 minutes

---

## 📝 Problem Statement

**Question 1**: How do you set up Version Management?
**Question 2**: Automate build and deployment processes.
**Question 3**: Implement continuous delivery pipeline.

---

## ✅ Complete Answer

```yaml
# .github/workflows/build.yml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Build iOS
        run: fastlane ios build
      - name: Deploy
        run: fastlane ios deploy
```

### CI/CD Pipeline
1. ✅ Automated testing
2. ✅ Code signing
3. ✅ Build generation
4. ✅ Store deployment
5. ✅ OTA updates

---

**Difficulty**: 🔴 Hard
**Estimated Time**: 20-25 minutes

---

*This problem is part of the React Native Interview Problems Collection*
