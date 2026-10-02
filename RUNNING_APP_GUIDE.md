# How to Run Your JLPT Burmese Mobile App 🚀

This guide will walk you through the steps to run your JLPT Burmese mobile app on various platforms (Android, iOS, Web) using Expo. Your app has been configured with NativeWind (Tailwind CSS for React Native), and all screens have been refactored to use Tailwind utility classes.

## Prerequisites

Before you begin, ensure you have the following installed on your computer:

1.  **Node.js and npm (or Yarn)**: You can download them from [nodejs.org](https://nodejs.org/).
2.  **Expo CLI**: Install it globally using npm:
    ```bash
    npm install -g expo-cli
    ```
3.  **A code editor**: Such as [VS Code](https://code.visualstudio.com/).
4.  **A mobile device or emulator/simulator**: 
    *   For Android: [Android Studio](https://developer.android.com/studio) with an Android Virtual Device (AVD).
    *   For iOS: A Mac with [Xcode](https://developer.apple.com/xcode/) and an iOS Simulator.

## Step-by-Step Instructions

Navigate to your project directory in the terminal:

```bash
cd "C:\Users\Administrator\OneDrive\Desktop\japanese app\jlpt-burmese-mobile"
```

### 1. Install Dependencies

First, ensure all project dependencies are installed. If you haven't already, run:

```bash
npm install
# or if you use yarn
yarn install
```

### 2. Start the Development Server

To start the Expo development server, run:

```bash
npm start
# or
expo start
```

### 🚨 Fix for "fetch failed" Error
If you see a `fetch failed` error when starting, it means Expo is having trouble connecting to its servers. You can bypass this by running in **offline mode**:

```bash
npx expo start --offline
```

This command will open a new tab in your web browser with the Expo Developer Tools. It will also display a QR code in your terminal.

### 3. Run on Your Device or Emulator/Simulator

From the Expo Developer Tools (either in your browser or terminal):

#### a. Run on Android Device/Emulator

*   **Using Expo Go app**: Download the [Expo Go app](https://expo.dev/client) on your Android phone. Scan the QR code displayed in your terminal or browser with the Expo Go app. The app will build and open on your device.
*   **Using Android Emulator**: If you have an Android emulator set up in Android Studio, press `a` in your terminal (where `npm start` is running) or click 
the "Run on Android emulator" button in the Expo Developer Tools.

#### b. Run on iOS Device/Simulator (macOS only)

*   **Using Expo Go app**: Download the [Expo Go app](https://expo.dev/client) on your iPhone. Scan the QR code displayed in your terminal or browser with the Expo Go app. The app will build and open on your device.
*   **Using iOS Simulator**: If you have Xcode installed, press `i` in your terminal (where `npm start` is running) or click the "Run on iOS simulator" button in the Expo Developer Tools.

#### c. Run in Web Browser

Press `w` in your terminal (where `npm start` is running) or click the "Run in web browser" button in the Expo Developer Tools. This will open the app in your default web browser.

## Troubleshooting

*   **"Welcome Edit app/(tabs)/index.tsx" still showing?**
    *   This usually means a cached version of a different project is running. Try clearing the Expo cache by running `expo start --clear`.
    *   Ensure you are in the correct project directory (`jlpt-burmese-mobile`) when running `npm start`.
*   **Styles not applying?**
    *   Make sure you are using `className` for Tailwind styles instead of `style`.
    *   Verify that `global.css` is imported at the very top of your `App.tsx` file.
    *   Restart the development server (`npm start`).
*   **Dependencies issues?**
    *   Try deleting your `node_modules` folder and `package-lock.json` (or `yarn.lock`), then reinstalling: `rm -rf node_modules && npm install`.

If you encounter any further issues, please let me know!
