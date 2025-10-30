# 🎵 Quick Start Guide

## 📦 3-Step Setup

### 1️⃣ Install Dependencies (1 minute)

```powershell
cd C:\Users\91813\Desktop\Praxis\ft-backup
npm install firebase next-pwa --legacy-peer-deps
```

### 2️⃣ Configure Firebase (5 minutes)

1. **Create project**: https://console.firebase.google.com/
2. **Register web app** and copy config
3. **Enable Auth**: Authentication → Email/Password
4. **Create Firestore**: Firestore Database → Test mode
5. **Update `.env.local`**:

```powershell
Copy-Item .env.local.example .env.local
# Edit with your Firebase credentials
```

### 3️⃣ Add Icons & Run (2 minutes)

```powershell
# Quick test icons
.\create-placeholder-icons.ps1

# Start app
npm run dev
```

Visit: **http://localhost:3000**

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **README.md** | Complete setup guide (start here!) |
| **CHECKLIST.md** | Progress tracker |
| **setup.ps1** | Automated dependency installer |
| **create-placeholder-icons.ps1** | Icon generator |

---

## ✅ What's Already Done

✅ Firebase client SDK integration  
✅ Authentication system (signup/login/logout)  
✅ Database CRUD operations  
✅ Real-time listeners  
✅ PWA configuration (manifest, service worker)  
✅ Offline support  
✅ Login/signup page  

---

## 🎯 What You Need To Do

1. Create Firebase project
2. Get credentials and update `.env.local`
3. Enable Auth & Firestore in Firebase Console
4. Add PWA icons to `public/icons/`
5. Run `pnpm dev` and test

---

## 📁 Project Structure

```
ft-backup/
├── README.md              ← Complete guide
├── CHECKLIST.md           ← Track progress
├── .env.local             ← Your Firebase config (create this!)
├── lib/firebase/          ← Firebase integration ✅
├── lib/contexts/          ← Auth context ✅
├── app/login/             ← Login page ✅
├── hooks/use-pwa.ts       ← PWA hook ✅
├── public/
│   ├── manifest.json      ← PWA manifest ✅
│   ├── sw.js              ← Service worker ✅
│   └── icons/             ← Add icons here! ⚠️
└── components/            ← Your existing UI
```

---

## 🔥 Firebase Functions You Can Use

```tsx
// Auth
import { signUp, signIn, logOut } from "@/lib/firebase/auth"
import { useAuth } from "@/lib/contexts/auth-context"

// Database
import { 
  getClassesByStudent,
  getClassesByTeacher,
  createClass,
  updateClass,
  deleteClass,
  getPaymentsByUser,
  createPayment,
  getRemindersByUser,
  createReminder,
  subscribeToClasses
} from "@/lib/firebase/database"
```

---

## 🚀 Deploy When Ready

```powershell
# Vercel (recommended)
vercel

# Firebase Hosting
firebase deploy

# Netlify
netlify deploy --prod
```

See **README.md** for detailed deployment instructions.

---

## 🆘 Need Help?

**Can't connect to Firebase?**
- Check `.env.local` has correct values
- Restart dev server: `npm run dev`

**PWA not working?**
- Add icons to `public/icons/`
- Visit manifest: http://localhost:3000/manifest.json

**Build errors?**
- Clear cache: `Remove-Item -Recurse .next`
- Reinstall: `npm install`

See **README.md** Troubleshooting section for more help!

---

**That's it!** Follow the 3 steps above and check README.md for details.

🎉 **Happy coding!** 🎵🎸🎹
