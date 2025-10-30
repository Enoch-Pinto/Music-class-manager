"use client"

import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic';

export default function TestFirestorePage() {
  const [classes, setClasses] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const loadAllData = async () => {
    setLoading(true)
    try {
      console.log("🔍 Loading all classes from Firestore...")
      const classesSnapshot = await getDocs(collection(db, "classes"))
      const allClasses = classesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      console.log("📚 All classes:", allClasses)
      setClasses(allClasses)

      console.log("🔍 Loading all students from Firestore...")
      const studentsSnapshot = await getDocs(collection(db, "students"))
      const allStudents = studentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      console.log("👥 All students:", allStudents)
      setStudents(allStudents)
    } catch (error: any) {
      console.error("❌ Error:", error)
      alert("Error: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllData()
  }, [])

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Firestore Database Inspector</h1>
          <Button onClick={loadAllData} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>

        {/* Students */}
        <Card>
          <CardHeader>
            <CardTitle>Students ({students.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <p className="text-muted-foreground">No students found</p>
            ) : (
              <div className="space-y-2">
                {students.map((student) => (
                  <div key={student.id} className="p-3 border rounded-lg">
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Email: <strong>{student.email}</strong>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ID: {student.id} | Instrument: {student.instrument} | Fee: ₹{student.feePerClass}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Classes */}
        <Card>
          <CardHeader>
            <CardTitle>Classes ({classes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {classes.length === 0 ? (
              <p className="text-muted-foreground">No classes found</p>
            ) : (
              <div className="space-y-2">
                {classes.map((cls) => (
                  <div key={cls.id} className="p-3 border rounded-lg">
                    <p className="font-medium">
                      {cls.studentName} - {cls.instrument}
                    </p>
                    <p className="text-sm">
                      Date: {cls.date} at {cls.time}
                    </p>
                    <p className="text-sm">
                      Student Email: <strong>{cls.studentEmail || "(not set)"}</strong>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ID: {cls.id} | Student ID: {cls.studentId} | Fee: ₹{cls.feePerClass}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Raw Data */}
        <Card>
          <CardHeader>
            <CardTitle>Raw JSON Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Students:</h3>
                <pre className="bg-secondary p-4 rounded-lg overflow-auto text-xs">
                  {JSON.stringify(students, null, 2)}
                </pre>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Classes:</h3>
                <pre className="bg-secondary p-4 rounded-lg overflow-auto text-xs">
                  {JSON.stringify(classes, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
