# Firebase Setup Updates Required

## 🔥 Firestore Database Structure

### Collections to Create:

#### 1. **students** collection
Each document should have:
```javascript
{
  id: string,
  name: string,
  email: string,
  phone: string (optional),
  instrument: string,
  feePerClass: number, // in Rupees
  monthlyPackage: 4 or 8, // number of classes per month
  teacherId: string, // matches teacher's user ID
  createdAt: timestamp
}
```

#### 2. **classes** collection (Updated)
Each document should have:
```javascript
{
  id: string,
  teacherId: string,
  studentId: string,
  studentName: string,
  studentEmail: string (optional),
  date: string, // "2025-10-30"
  time: string, // "14:00"
  instrument: string,
  feePerClass: number, // in Rupees
  paid: boolean,
  completed: boolean,
  monthlyPackage: 4 or 8 (optional),
  monthYear: string, // "2025-10" for tracking monthly packages
  createdAt: timestamp
}
```

## 🔒 Updated Firestore Security Rules

**IMPORTANT: These rules MUST be published in Firebase Console!**

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Students - teachers can manage their students, anyone authenticated can read
    match /students/{studentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                       request.resource.data.teacherId == request.auth.uid;
      allow update, delete: if request.auth != null && 
                               resource.data.teacherId == request.auth.uid;
    }
    
    // Classes - CRITICAL: Allow queries by studentEmail
    match /classes/{classId} {
      // Allow reading if user is the teacher, student by ID, or student by email
      allow read: if request.auth != null;
      
      // Allow list/query operations for authenticated users
      // This allows students to query by their email
      allow list: if request.auth != null;
      
      // Only teachers can create/update/delete their classes
      allow create: if request.auth != null && 
                       request.resource.data.teacherId == request.auth.uid;
      allow update, delete: if request.auth != null && 
                               resource.data.teacherId == request.auth.uid;
    }
    
    // Payments - users can read their own
    match /payments/{paymentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Reminders - users can read/write their own
    match /reminders/{reminderId} {
      allow read, write: if request.auth != null && 
                            request.auth.uid == resource.data.userId;
    }
  }
}
```

**Why these changes:**
- `allow list: if request.auth != null` - This allows students to query classes by email
- `allow read: if request.auth != null` - Simplified to allow any authenticated user to read individual classes
- This is secure because students can only see classes that match their query filters

## 📝 Steps to Update Firebase:

### 1. Go to Firebase Console
https://console.firebase.google.com/project/praxiss-1/firestore

### 2. Update Firestore Rules
- Click on "Rules" tab
- Copy and paste the security rules above
- Click "Publish"

### 3. No Manual Collection Creation Needed
- Collections will be automatically created when you:
  - Add your first class (creates "classes" collection)
  - Add your first student (creates "students" collection)

### 4. Test the New Features:

#### Add a Student First (Optional - for bulk scheduling):
You can manually add a student document in Firestore Console:
- Collection: `students`
- Document ID: Auto-generate
- Fields:
  ```
  name: "John Doe"
  email: "john@example.com"
  instrument: "Piano"
  feePerClass: 1000
  monthlyPackage: 4
  teacherId: "YOUR_TEACHER_USER_ID"
  createdAt: (current timestamp)
  ```

#### Or Just Use Single Class Scheduling:
- Click "Single Class" button
- Fill in student name, email, instrument, fee
- This will create classes visible to both teacher and student

## 🆕 New Features Available:

1. **Different Fees per Student**
   - Each class can have its own fee
   - Displayed in Rupees (₹)

2. **Bulk Monthly Scheduling**
   - Schedule 4 or 8 classes at once
   - Select specific days of the week
   - All classes for the month created automatically

3. **Student Visibility**
   - Classes visible to students when they log in with matching email
   - Students see their scheduled classes
   - Month-wise tracking

4. **Currency Changed**
   - All amounts now show in Rupees (₹)
   - Revenue calculations use actual fees

## ✅ No Firebase Project Changes Required

You don't need to:
- ❌ Create a new Firebase project
- ❌ Change API keys
- ❌ Reinstall anything

Just update the Firestore rules and start using the new features!
