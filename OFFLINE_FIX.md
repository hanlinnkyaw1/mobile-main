# 🚨 Quick Fix for Expo "fetch failed" Error

If you are seeing a `TypeError: fetch failed` error when running `npm start`, it means the Expo CLI is unable to reach the Expo servers to validate your project. This is often due to network restrictions or firewall settings.

## The Solution: Offline Mode

You can bypass these network checks by running Expo in **offline mode**. This will allow the development server to start immediately without trying to connect to the internet.

### 🛠️ How to run:

1.  **Open your terminal** in the project directory.
2.  **Stop any running process** (press `Ctrl + C`).
3.  **Run this exact command**:

```bash
npx expo start --offline
```

### 📱 What to expect:
*   The terminal will show a QR code as usual.
*   You can still scan this QR code with the **Expo Go** app on your phone (as long as your phone and computer are on the same Wi-Fi).
*   The app will load much faster because it skips the online validation steps.

---
*Note: I have also updated your `RUNNING_APP_GUIDE.md` with this information for future reference.* 📚
