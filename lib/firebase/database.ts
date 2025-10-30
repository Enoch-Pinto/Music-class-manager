// Firebase Database Service
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "./config";

// Types
export interface MusicClass {
  id: string;
  teacherId: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  date: string;
  time: string;
  instrument: string;
  feePerClass: number; // Fee in Rupees
  paid: boolean;
  completed: boolean;
  monthlyPackage?: 4 | 8; // Number of classes per month
  monthYear?: string; // Format: "2025-10" for October 2025
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  instrument: string;
  feePerClass: number; // Default fee in Rupees
  monthlyPackage: 4 | 8; // Default package
  teacherId: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "overdue";
  method: string;
  createdAt: string;
}

export interface Reminder {
  id: string;
  userId: string;
  type: "payment" | "class" | "alert";
  title: string;
  message: string;
  dueDate: string;
  read: boolean;
  createdAt: string;
}

// STUDENTS
export const createStudent = async (studentData: Omit<Student, "id" | "createdAt">): Promise<string> => {
  try {
    const docRef = doc(collection(db, "students"));
    const newStudent: Student = {
      ...studentData,
      id: docRef.id,
      createdAt: new Date().toISOString(),
    };
    await setDoc(docRef, newStudent);
    return docRef.id;
  } catch (error: any) {
    throw new Error(`Error creating student: ${error.message}`);
  }
};

export const getStudentsByTeacher = async (teacherId: string): Promise<Student[]> => {
  try {
    const q = query(
      collection(db, "students"),
      where("teacherId", "==", teacherId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as Student);
  } catch (error: any) {
    throw new Error(`Error fetching students: ${error.message}`);
  }
};

export const updateStudent = async (studentId: string, updates: Partial<Student>): Promise<void> => {
  try {
    const docRef = doc(db, "students", studentId);
    await updateDoc(docRef, updates);
  } catch (error: any) {
    throw new Error(`Error updating student: ${error.message}`);
  }
};

export const deleteStudent = async (studentId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "students", studentId));
  } catch (error: any) {
    throw new Error(`Error deleting student: ${error.message}`);
  }
};

// CLASSES
export const createClass = async (classData: Omit<MusicClass, "id" | "createdAt">): Promise<string> => {
  try {
    const docRef = doc(collection(db, "classes"));
    const newClass: MusicClass = {
      ...classData,
      id: docRef.id,
      createdAt: new Date().toISOString(),
    };
    await setDoc(docRef, newClass);
    return docRef.id;
  } catch (error: any) {
    throw new Error(`Error creating class: ${error.message}`);
  }
};

export const getClassesByTeacher = async (teacherId: string): Promise<MusicClass[]> => {
  try {
    const q = query(
      collection(db, "classes"),
      where("teacherId", "==", teacherId),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as MusicClass);
  } catch (error: any) {
    throw new Error(`Error fetching classes: ${error.message}`);
  }
};

export const getClassesByStudent = async (studentId: string): Promise<MusicClass[]> => {
  try {
    const q = query(
      collection(db, "classes"),
      where("studentId", "==", studentId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as MusicClass);
  } catch (error: any) {
    throw new Error(`Error fetching classes: ${error.message}`);
  }
};

// Get classes by student email (for students who sign up independently)
export const getClassesByStudentEmail = async (studentEmail: string): Promise<MusicClass[]> => {
  try {
    console.log("🔍 Querying Firestore for classes with studentEmail:", studentEmail);
    const q = query(
      collection(db, "classes"),
      where("studentEmail", "==", studentEmail)
    );
    const querySnapshot = await getDocs(q);
    console.log("📊 Query returned", querySnapshot.docs.length, "classes");
    
    const classes = querySnapshot.docs.map((doc) => {
      const data = doc.data() as MusicClass;
      console.log("📄 Class document:", doc.id, data);
      return data;
    });
    
    return classes;
  } catch (error: any) {
    console.error("❌ Error in getClassesByStudentEmail:", error);
    throw new Error(`Error fetching classes: ${error.message}`);
  }
};

export const updateClass = async (classId: string, updates: Partial<MusicClass>): Promise<void> => {
  try {
    const docRef = doc(db, "classes", classId);
    await updateDoc(docRef, updates);
  } catch (error: any) {
    throw new Error(`Error updating class: ${error.message}`);
  }
};

export const deleteClass = async (classId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "classes", classId));
  } catch (error: any) {
    throw new Error(`Error deleting class: ${error.message}`);
  }
};

// Real-time listener for classes
export const subscribeToClasses = (
  userId: string,
  userType: "student" | "teacher",
  callback: (classes: MusicClass[]) => void
) => {
  const field = userType === "teacher" ? "teacherId" : "studentId";
  // Simplified query without orderBy to avoid requiring an index
  const q = query(
    collection(db, "classes"),
    where(field, "==", userId)
  );

  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const classes = snapshot.docs.map((doc) => doc.data() as MusicClass);
    // Sort in memory instead
    const sortedClasses = classes.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    callback(sortedClasses);
  });
};

// PAYMENTS
export const createPayment = async (paymentData: Omit<Payment, "id" | "createdAt">): Promise<string> => {
  try {
    const docRef = doc(collection(db, "payments"));
    const newPayment: Payment = {
      ...paymentData,
      id: docRef.id,
      createdAt: new Date().toISOString(),
    };
    await setDoc(docRef, newPayment);
    return docRef.id;
  } catch (error: any) {
    throw new Error(`Error creating payment: ${error.message}`);
  }
};

export const getPaymentsByUser = async (userId: string): Promise<Payment[]> => {
  try {
    const q = query(
      collection(db, "payments"),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as Payment);
  } catch (error: any) {
    throw new Error(`Error fetching payments: ${error.message}`);
  }
};

// REMINDERS
export const createReminder = async (reminderData: Omit<Reminder, "id" | "createdAt">): Promise<string> => {
  try {
    const docRef = doc(collection(db, "reminders"));
    const newReminder: Reminder = {
      ...reminderData,
      id: docRef.id,
      createdAt: new Date().toISOString(),
    };
    await setDoc(docRef, newReminder);
    return docRef.id;
  } catch (error: any) {
    throw new Error(`Error creating reminder: ${error.message}`);
  }
};

export const getRemindersByUser = async (userId: string): Promise<Reminder[]> => {
  try {
    const q = query(
      collection(db, "reminders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as Reminder);
  } catch (error: any) {
    throw new Error(`Error fetching reminders: ${error.message}`);
  }
};

export const updateReminder = async (reminderId: string, updates: Partial<Reminder>): Promise<void> => {
  try {
    const docRef = doc(db, "reminders", reminderId);
    await updateDoc(docRef, updates);
  } catch (error: any) {
    throw new Error(`Error updating reminder: ${error.message}`);
  }
};

export const deleteReminder = async (reminderId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "reminders", reminderId));
  } catch (error: any) {
    throw new Error(`Error deleting reminder: ${error.message}`);
  }
};

// Real-time listener for reminders
export const subscribeToReminders = (
  userId: string,
  callback: (reminders: Reminder[]) => void
) => {
  const q = query(
    collection(db, "reminders"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const reminders = snapshot.docs.map((doc) => doc.data() as Reminder);
    callback(reminders);
  });
};
