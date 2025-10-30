# Music Class Manager - Flutter Mobile App

A complete Flutter mobile application for managing music classes, payments, schedules, and reminders. This app provides separate dashboards for students and teachers.

## Features

### Student Features
- 📅 View class schedule and calendar
- 💳 Track payment status and history
- 🔔 Receive notifications and reminders
- 📊 View class statistics (completed, upcoming)
- 💰 Manage payment methods

### Teacher Features
- 👨‍🏫 Manage student roster
- 📆 Schedule and organize classes
- 💵 Track payments by student
- 📬 Send payment reminders
- 📈 View revenue and class statistics
- 🎵 Filter by instrument

## Prerequisites

Before running this app, ensure you have:

1. **Flutter SDK** (version 3.0.0 or higher)
   - Download from: https://flutter.dev/docs/get-started/install
   - Verify installation: `flutter doctor`

2. **Android Studio** (for Android development)
   - Or **Xcode** (for iOS development on macOS)

3. **An IDE** (VS Code or Android Studio recommended)
   - VS Code Flutter extension: https://marketplace.visualstudio.com/items?itemName=Dart-Code.flutter
   - Android Studio Flutter plugin

## Installation

### Step 1: Clone or Navigate to the Flutter App Directory

```powershell
cd c:\Users\91813\Desktop\adk-mcp-a2a-crash-course\ft\flutter_app
```

### Step 2: Install Dependencies

```powershell
flutter pub get
```

This will install all required packages including:
- `provider` (state management)
- `table_calendar` (calendar widget)
- `fl_chart` (charts)
- `intl` (internationalization)
- `flutter_local_notifications` (notifications)
- `shared_preferences` (local storage)

### Step 3: Run on Emulator or Device

#### Option A: Run on Android Emulator/Device

1. Start an Android emulator or connect an Android device
2. Check available devices:
```powershell
flutter devices
```

3. Run the app:
```powershell
flutter run
```

#### Option B: Run on iOS Simulator (macOS only)

```powershell
flutter run -d ios
```

## Building APK for Android

### Debug APK (for testing)

```powershell
flutter build apk --debug
```

The APK will be located at:
`build\app\outputs\flutter-apk\app-debug.apk`

### Release APK (for production)

```powershell
flutter build apk --release
```

The APK will be located at:
`build\app\outputs\flutter-apk\app-release.apk`

### Split APKs by Architecture (smaller file size)

```powershell
flutter build apk --split-per-abi --release
```

This creates separate APKs for:
- `app-armeabi-v7a-release.apk` (32-bit ARM)
- `app-arm64-v8a-release.apk` (64-bit ARM)
- `app-x86_64-release.apk` (64-bit Intel)

## Building App Bundle (for Google Play Store)

```powershell
flutter build appbundle --release
```

The bundle will be located at:
`build\app\outputs\bundle\release\app-release.aab`

## Installing APK on Device

### Via USB (with ADB)

```powershell
# Connect your device via USB with USB debugging enabled
adb install build\app\outputs\flutter-apk\app-release.apk
```

### Via File Transfer

1. Copy the APK file to your device
2. Open the APK file on your device
3. Allow installation from unknown sources if prompted
4. Install the app

## Project Structure

```
flutter_app/
├── lib/
│   ├── main.dart                          # App entry point
│   ├── models/                            # Data models
│   │   ├── music_class.dart
│   │   ├── payment.dart
│   │   └── reminder.dart
│   ├── providers/                         # State management
│   │   ├── class_provider.dart
│   │   └── theme_provider.dart
│   ├── screens/                           # App screens
│   │   ├── home_screen.dart
│   │   ├── student_dashboard_screen.dart
│   │   └── teacher_dashboard_screen.dart
│   └── widgets/                           # Reusable widgets
│       ├── calendar_widget.dart
│       ├── payment_status_card.dart
│       ├── payment_tracking_widget.dart
│       └── reminder_widget.dart
├── pubspec.yaml                           # Dependencies
└── README.md                              # This file
```

## Troubleshooting

### "flutter is not recognized"
- Ensure Flutter SDK is installed and added to PATH
- Restart your terminal after installation
- Run: `flutter doctor` to diagnose issues

### "No devices found"
- For Android: Start an Android emulator in Android Studio
- For iOS: Start a simulator with `open -a Simulator` (macOS only)
- For physical device: Enable USB debugging and connect via USB

### Build errors
- Run `flutter clean` then `flutter pub get`
- Check that all dependencies are compatible
- Ensure you're using Flutter 3.0.0 or higher: `flutter --version`

### Missing SDKs
- Run `flutter doctor` to see what's missing
- Install Android SDK via Android Studio
- Install Xcode for iOS development (macOS only)

## Development Tips

### Hot Reload
When the app is running, press:
- `r` - Hot reload (fast refresh without losing state)
- `R` - Hot restart (full restart)
- `q` - Quit

### Debug Mode
```powershell
flutter run --debug
```

### Release Mode (for performance testing)
```powershell
flutter run --release
```

### View Logs
```powershell
flutter logs
```

## Customization

### Change App Name
Edit `android\app\src\main\AndroidManifest.xml`:
```xml
<application android:label="Your App Name">
```

### Change App Icon
1. Replace icon files in `android\app\src\main\res\mipmap-*`
2. Or use a package like `flutter_launcher_icons`

### Change Package Name
Use the `change_app_package_name` package or manually update:
- `android\app\build.gradle`
- `android\app\src\main\AndroidManifest.xml`

## Converting from Next.js

This Flutter app is a complete conversion of the original Next.js/React web application. Key differences:

- **React Components → Flutter Widgets**
- **useState/useEffect → StatefulWidget/Provider**
- **Tailwind CSS → Flutter Material Design**
- **Radix UI → Native Flutter Components**
- **Next.js Routing → Flutter Navigation**

All features from the original web app have been preserved:
- Student dashboard with payment tracking
- Teacher dashboard with class management
- Calendar view with event display
- Payment tracking and reminders
- Notification system

## License

This project is for educational purposes.

## Support

For Flutter issues:
- Flutter Documentation: https://flutter.dev/docs
- Stack Overflow: https://stackoverflow.com/questions/tagged/flutter

For app-specific questions, refer to the code comments in each file.
