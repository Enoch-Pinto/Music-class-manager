# 🎵 Music Class Manager - Complete Setup Guide

**Last Updated**: October 29, 2025  
**Status**: ✅ Production Ready

---

## 📁 Project Architecture

```
Praxis/
├── ft-backup/          ← Frontend (Next.js + React + PWA)
│   ├── app/           ← Pages and layouts
│   ├── components/    ← React components  
│   ├── lib/           ← Firebase & utilities
│   ├── hooks/         ← React hooks
│   └── public/        ← Static files & PWA assets
└── backend/           ← Backend (Optional - Node.js + Express)
```

---

## 🚀 Quick Start (5 Minutes)

```powershell
# 1. Navigate to frontend
cd C:\Users\91813\Desktop\Praxis\ft-backup

# 2. Install dependencies
npm install firebase next-pwa

# 3. Copy environment template
Copy-Item .env.local.example .env.local

# 4. Edit .env.local with Firebase credentials (see below)

# 5. Run the app
npm run dev
```

---

## 📚 Table of Contents

- [Firebase Setup](#-firebase-setup)
- [Environment Configuration](#-environment-configuration)
- [PWA Icons](#-pwa-icons)
- [Running Locally](#-running-locally)
- [Integration Guide](#-integration-guide)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## 🔥 Firebase Setup

### Step 1: Create Firebase Project

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter name: `music-class-manager`
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Register Web App

1. Click Web icon `</>` in project overview
2. App nickname: `music-class-web`
3. **Copy the config object** (you'll need this!)
4. Click "Continue to console"

### Step 3: Enable Authentication

1. Sidebar → **Authentication** → **Get started**
2. Click **"Sign-in method"** tab
3. Enable **"Email/Password"**
4. Click **"Save"**

### Step 4: Create Firestore Database

1. Sidebar → **Firestore Database** → **Create database**
2. Select **"Start in test mode"**
3. Choose location (us-central1 recommended)
4. Click **"Enable"**

### Step 5: Set Security Rules

Click **"Rules"** tab and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId);
    }
    
    match /classes/{classId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() && 
        (resource.data.teacherId == request.auth.uid || 
         resource.data.studentId == request.auth.uid);
    }
    
    match /payments/{paymentId} {
      allow read, write: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
    }
    
    match /reminders/{reminderId} {
      allow read, write: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

Click **"Publish"**

---

## ⚙️ Environment Configuration

### Create `.env.local`

```powershell
cd C:\Users\91813\Desktop\Praxis\ft-backup
Copy-Item .env.local.example .env.local
```

### Edit with Firebase Credentials

Open `.env.local` and paste your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

⚠️ **Replace all values** with your actual Firebase config from Step 2!

---

## 🎨 PWA Icons

### Option 1: Generate Placeholders (Quick Test)

```powershell
cd C:\Users\91813\Desktop\Praxis\ft-backup
.\create-placeholder-icons.ps1
```

This creates simple colored icons for testing.

### Option 2: Professional Icons (Recommended)

1. Visit [PWA Builder](https://www.pwabuilder.com/imageGenerator)
2. Upload your logo (512x512 PNG or larger)
3. Download all icon sizes
4. Extract to `ft-backup/public/icons/`

### Required Icon Sizes

Place these in `public/icons/`:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

---

## ▶️ Running Locally

```powershell
cd C:\Users\91813\Desktop\Praxis\ft-backup

# Development mode (with hot reload)
npm run dev

# Production build test
npm run build
npm start
```

Visit: **http://localhost:3000**

---

## 🔧 Integration Guide

### Files Already Created

✅ **Firebase Integration**
- `lib/firebase/config.ts` - Firebase initialization
- `lib/firebase/auth.ts` - Authentication functions
- `lib/firebase/database.ts` - Database operations
- `lib/contexts/auth-context.tsx` - Auth React context
- `app/login/page.tsx` - Login/signup page

✅ **PWA Configuration**
- `public/manifest.json` - PWA manifest
- `public/sw.js` - Service worker
- `next.config.mjs` - PWA config
- `app/layout.tsx` - PWA metadata
- `app/offline/page.tsx` - Offline fallback
- `hooks/use-pwa.ts` - PWA install hook

### How to Use in Your Components

#### 1. Wrap App with Auth Provider

Update `app/layout.tsx`:

```tsx
import { AuthProvider } from "@/lib/contexts/auth-context"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

#### 2. Use Auth Hook

```tsx
"use client"
import { useAuth } from "@/lib/contexts/auth-context"

export default function Dashboard() {
  const { user, userProfile, loading, signOut } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please login</div>
  
  return (
    <div>
      <h1>Welcome {userProfile?.displayName}!</h1>
      <p>Role: {userProfile?.userType}</p>
      <button onClick={signOut}>Logout</button>
    </div>
  )
}
```

#### 3. Use Database Functions

```tsx
import { 
  getClassesByStudent, 
  getClassesByTeacher,
  createClass,
  updateClass,
  deleteClass 
} from "@/lib/firebase/database"

// Get classes
const classes = await getClassesByStudent(user.uid)

// Create class
await createClass({
  teacherId: "teacher_uid",
  studentId: user.uid,
  studentName: user.displayName,
  date: "2025-11-01",
  time: "14:00",
  instrument: "Piano",
  paid: false,
  completed: false,
})

// Update class
await updateClass("class_id", { paid: true })

// Delete class
await deleteClass("class_id")
```

#### 4. Real-time Updates

```tsx
import { subscribeToClasses } from "@/lib/firebase/database"
import { useEffect, useState } from "react"

export default function ClassesList() {
  const { user, userProfile } = useAuth()
  const [classes, setClasses] = useState([])
  
  useEffect(() => {
    if (!user || !userProfile) return
    
    const unsubscribe = subscribeToClasses(
      user.uid,
      userProfile.userType,
      (updatedClasses) => {
        setClasses(updatedClasses)
      }
    )
    
    return () => unsubscribe()
  }, [user, userProfile])
  
  return (
    <div>
      {classes.map(cls => (
        <div key={cls.id}>{cls.studentName} - {cls.date}</div>
      ))}
    </div>
  )
}
```

---

## 🌐 Deployment

### Option 1: Vercel (Recommended)

```powershell
# Install Vercel CLI
npm install -g vercel

# Deploy
cd C:\Users\91813\Desktop\Praxis\ft-backup
vercel
```

1. Follow prompts to link project
2. Add environment variables in Vercel dashboard
3. Deploy!

**Add Environment Variables in Vercel:**
- Settings → Environment Variables
- Add all `NEXT_PUBLIC_FIREBASE_*` variables

### Option 2: Firebase Hosting

```powershell
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
cd C:\Users\91813\Desktop\Praxis\ft-backup
firebase init hosting
```

**Hosting Setup:**
- Use existing project: Select your Firebase project
- Public directory: `out`
- Configure as single-page app: **Yes**
- Set up automatic builds: **No**

**Add to package.json:**
```json
{
  "scripts": {
    "export": "next build && next export",
    "deploy": "npm run export && firebase deploy"
  }
}
```

**Deploy:**
```powershell
npm run deploy
```

### Option 3: Netlify

```powershell
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod
```

Add environment variables in Netlify dashboard.

---

## 🆘 Troubleshooting

### Firebase Connection Issues

**Problem**: Can't connect to Firebase

**Solutions**:
```powershell
# 1. Check .env.local exists
Test-Path .env.local

# 2. Verify environment variables
Get-Content .env.local

# 3. Restart dev server
npm run dev
```

### PWA Not Installing

**Problem**: Install prompt doesn't appear

**Solutions**:
- PWA requires HTTPS (localhost is OK)
- Check manifest: http://localhost:3000/manifest.json
- Check service worker: Chrome DevTools → Application → Service Workers
- Clear browser cache and reload

### Build Errors

**Problem**: Build fails or errors appear

**Solutions**:
```powershell
# Clear Next.js cache
Remove-Item -Recurse -Force .next

# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
npm install

# Rebuild
npm run build
```

### Icons Not Showing

**Problem**: PWA icons don't appear

**Solutions**:
- Verify files exist: `Get-ChildItem public\icons`
- Check file names match manifest.json exactly
- Use lowercase file names
- Clear browser cache

### TypeScript Errors

**Problem**: Firebase types not found

**Solution**:
```powershell
# Install Firebase (if not already)
npm install firebase

# Install next-pwa
npm install next-pwa

# Restart VS Code
```

---

## 📊 Firestore Database Structure

### Collections

**users/**
```json
{
  "uid": "user_unique_id",
  "email": "user@example.com",
  "displayName": "John Doe",
  "userType": "teacher | student",
  "createdAt": "2025-10-29T12:00:00.000Z"
}
```

**classes/**
```json
{
  "id": "class_id",
  "teacherId": "teacher_uid",
  "studentId": "student_uid",
  "studentName": "Alice Johnson",
  "date": "2025-11-01",
  "time": "14:00",
  "instrument": "Piano",
  "paid": true,
  "completed": false,
  "createdAt": "2025-10-29T12:00:00.000Z"
}
```

**payments/**
```json
{
  "id": "payment_id",
  "userId": "user_uid",
  "amount": 50,
  "date": "2025-10-01",
  "status": "paid | pending | overdue",
  "method": "Credit Card",
  "createdAt": "2025-10-29T12:00:00.000Z"
}
```

**reminders/**
```json
{
  "id": "reminder_id",
  "userId": "user_uid",
  "type": "payment | class | alert",
  "title": "Payment Due",
  "message": "Your monthly payment of $50 is due",
  "dueDate": "2025-11-01",
  "read": false,
  "createdAt": "2025-10-29T12:00:00.000Z"
}
```

---

## ✅ Setup Checklist

### Firebase Configuration
- [ ] Created Firebase project
- [ ] Registered web app and copied config
- [ ] Enabled Email/Password authentication  
- [ ] Created Firestore database
- [ ] Set security rules
- [ ] Configured `.env.local` with credentials

### PWA Setup
- [ ] Generated or created PWA icons
- [ ] Placed 8 icon files in `public/icons/`
- [ ] Verified manifest.json is accessible
- [ ] Tested service worker registration
- [ ] Tested offline functionality

### Development
- [ ] Installed dependencies: `npm install firebase next-pwa`
- [ ] App runs without errors: `npm run dev`
- [ ] Can create new user accounts
- [ ] Can login and logout
- [ ] Data persists in Firestore

### Integration
- [ ] Wrapped app with AuthProvider
- [ ] Updated components to use useAuth()
- [ ] Replaced mock data with Firebase queries
- [ ] Added authentication guards
- [ ] Tested real-time updates

### Deployment
- [ ] Built successfully: `npm run build`
- [ ] Tested production build: `npm start`
- [ ] Deployed to hosting platform
- [ ] Added environment variables to hosting
- [ ] PWA installs on devices
- [ ] Everything works in production

---

## 📞 Command Reference

```powershell
# Dependencies
npm install firebase next-pwa          # Install Firebase & PWA

# Development
npm run dev                            # Start dev server
npm run build                          # Build for production
npm start                          # Test production build locally

# Icons
.\create-placeholder-icons.ps1      # Generate test icons

# Firebase CLI
firebase login                      # Login to Firebase
firebase init hosting               # Initialize hosting
firebase deploy                     # Deploy to Firebase

# Deployment
vercel                             # Deploy to Vercel
netlify deploy --prod              # Deploy to Netlify

# Troubleshooting
Remove-Item -Recurse .next         # Clear cache
npm install                       # Reinstall dependencies
Get-Content .env.local             # Check environment variables
```

---

## 🎉 You're All Set!

Your Music Class Manager now has:
- ✅ Firebase authentication & database
- ✅ PWA functionality (offline support, installable)
- ✅ Real-time updates
- ✅ Secure data access
- ✅ Production-ready architecture

**Next Steps:**
1. Complete Firebase setup
2. Run `npm run dev` to test locally
3. Integrate auth into your components
4. Deploy to production

Need help? Check the [CHECKLIST.md](./CHECKLIST.md) for detailed progress tracking!

---

**Good luck with your app!** 🎵🎸🎹
