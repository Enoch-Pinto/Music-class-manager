"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Plus, Trash2, Clock, User, Zap } from "lucide-react"
import { CalendarView } from "@/components/calendar-view"
import { MonthlyPaymentTracking } from "@/components/monthly-payment-tracking"
import { ReminderSystem } from "@/components/reminder-system"
import { StudentManagement } from "@/components/student-management"
import { useAuth } from "@/lib/contexts/auth-context"
import { 
  createClass, 
  subscribeToClasses, 
  updateClass, 
  deleteClass as deleteClassFromDB,
  createStudent,
  getStudentsByTeacher,
  type MusicClass,
  type Student
} from "@/lib/firebase/database"

interface Class {
  id: string
  student: string
  studentEmail?: string
  date: string
  time: string
  instrument: string
  feePerClass: number
  paid: boolean
  notes?: string
  monthYear?: string
  monthlyPackage?: 4 | 8
}

export function TeacherDashboard() {
  const { user } = useAuth()
  const [classes, setClasses] = useState<Class[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [showBulkSchedule, setShowBulkSchedule] = useState(false)
  const [formData, setFormData] = useState({ 
    student: "", 
    studentEmail: "",
    date: "", 
    time: "", 
    instrument: "", 
    feePerClass: 500,
    notes: "" 
  })
  const [bulkScheduleData, setBulkScheduleData] = useState({
    studentId: "",
    startDate: "",
    time: "",
    monthlyPackage: 4 as 4 | 8,
    dayOfWeek: [] as number[], // 0=Sunday, 1=Monday, etc.
  })
  const [filterInstrument, setFilterInstrument] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"classes" | "students" | "payments">("classes")

  // Refs for scrolling
  const scheduleFormRef = useRef<HTMLDivElement>(null)
  const bulkScheduleRef = useRef<HTMLDivElement>(null)

  // Subscribe to real-time updates from Firebase
  useEffect(() => {
    if (!user) return

    setLoading(true)
    
    // Load students
    const loadStudents = async () => {
      try {
        const fetchedStudents = await getStudentsByTeacher(user.uid)
        setStudents(fetchedStudents)
      } catch (error) {
        console.error("Error loading students:", error)
      }
    }
    
    loadStudents()

    // Subscribe to classes
    const unsubscribe = subscribeToClasses(user.uid, "teacher", (firebaseClasses) => {
      // Convert Firebase classes to component format
      const formattedClasses = firebaseClasses.map((cls) => ({
        id: cls.id,
        student: cls.studentName,
        studentEmail: cls.studentEmail,
        date: cls.date,
        time: cls.time,
        instrument: cls.instrument,
        feePerClass: cls.feePerClass || 500,
        paid: cls.paid,
        notes: "",
        monthYear: cls.monthYear,
        monthlyPackage: cls.monthlyPackage,
      }))
      setClasses(formattedClasses)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const reloadStudents = async () => {
    if (!user) return
    try {
      const fetchedStudents = await getStudentsByTeacher(user.uid)
      setStudents(fetchedStudents)
    } catch (error) {
      console.error("Error reloading students:", error)
    }
  }

  const handleScheduleClass = async () => {
    if (!user || !formData.student || !formData.date || !formData.time || !formData.instrument) return

    try {
      const monthYear = formData.date.substring(0, 7) // "2025-10"
      
      await createClass({
        teacherId: user.uid,
        studentId: "temp-student-id",
        studentName: formData.student,
        studentEmail: formData.studentEmail || undefined,
        date: formData.date,
        time: formData.time,
        instrument: formData.instrument,
        feePerClass: formData.feePerClass,
        paid: false,
        completed: false,
        monthYear,
      })
      setFormData({ 
        student: "", 
        studentEmail: "",
        date: "", 
        time: "", 
        instrument: "", 
        feePerClass: 500,
        notes: "" 
      })
      setShowScheduleForm(false)
    } catch (error: any) {
      console.error("Error creating class:", error)
      alert("Failed to create class: " + error.message)
    }
  }

  const handleBulkSchedule = async () => {
    console.log("🚀 Bulk Schedule - Starting...");
    console.log("📋 Bulk Schedule Data:", bulkScheduleData);
    console.log("👤 Current User:", user);
    console.log("📚 Available Students:", students);
    
    if (!user) {
      alert("Error: User not logged in");
      return;
    }
    
    if (!bulkScheduleData.studentId) {
      alert("Error: Please select a student");
      return;
    }
    
    if (!bulkScheduleData.startDate) {
      alert("Error: Please select a start date");
      return;
    }
    
    if (!bulkScheduleData.time) {
      alert("Error: Please select a time");
      return;
    }
    
    if (bulkScheduleData.dayOfWeek.length === 0) {
      alert("Error: Please select at least one day of the week");
      return;
    }

    try {
      const student = students.find(s => s.id === bulkScheduleData.studentId)
      if (!student) {
        alert("Error: Student not found in roster");
        console.error("❌ Student ID not found:", bulkScheduleData.studentId);
        return;
      }

      console.log("✅ Bulk Schedule - Student found:", student)
      console.log("📧 Bulk Schedule - Student email:", student.email)

      const startDate = new Date(bulkScheduleData.startDate)
      const monthYear = bulkScheduleData.startDate.substring(0, 7)
      const classesToCreate: Promise<string>[] = []
      
      // Generate dates for the month based on selected days of week
      let classesScheduled = 0
      let currentDate = new Date(startDate)
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

      while (currentDate <= endOfMonth && classesScheduled < bulkScheduleData.monthlyPackage) {
        if (bulkScheduleData.dayOfWeek.includes(currentDate.getDay())) {
          const dateStr = currentDate.toISOString().split('T')[0]
          
          const classData = {
            teacherId: user.uid,
            studentId: student.id,
            studentName: student.name,
            studentEmail: student.email,
            date: dateStr,
            time: bulkScheduleData.time,
            instrument: student.instrument,
            feePerClass: student.feePerClass,
            paid: false,
            completed: false,
            monthYear,
            monthlyPackage: bulkScheduleData.monthlyPackage,
          }
          
          console.log("📅 Creating class with data:", classData)
          classesToCreate.push(createClass(classData))
          classesScheduled++
        }
        currentDate.setDate(currentDate.getDate() + 1)
      }

      console.log("📊 Total classes to create:", classesScheduled);
      console.log("🔄 Creating classes in Firestore...");
      
      await Promise.all(classesToCreate)
      
      console.log("✅ All classes created successfully!");
      alert(`Successfully scheduled ${classesScheduled} classes for ${student.name}`)
      setBulkScheduleData({
        studentId: "",
        startDate: "",
        time: "",
        monthlyPackage: 4,
        dayOfWeek: [],
      })
      setShowBulkSchedule(false)
    } catch (error: any) {
      console.error("❌ Error bulk scheduling:", error)
      alert("Failed to schedule classes: " + error.message)
    }
  }

  const togglePaidStatus = async (id: string) => {
    const classToUpdate = classes.find((c) => c.id === id)
    if (!classToUpdate) return

    try {
      await updateClass(id, { paid: !classToUpdate.paid })
    } catch (error: any) {
      console.error("Error updating class:", error)
      alert("Failed to update class: " + error.message)
    }
  }

  const deleteClassHandler = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return

    try {
      await deleteClassFromDB(id)
    } catch (error: any) {
      console.error("Error deleting class:", error)
      alert("Failed to delete class: " + error.message)
    }
  }

  const filteredClasses =
    filterInstrument === "all" ? classes : classes.filter((c) => c.instrument === filterInstrument)

  const instruments = Array.from(new Set(classes.map((c) => c.instrument)))
  const upcomingClasses = classes.filter((c) => new Date(c.date) >= new Date()).length
  const totalRevenue = classes.filter((c) => c.paid).reduce((sum, c) => sum + c.feePerClass, 0)

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Please log in to access your dashboard</p>
            <Button onClick={() => window.location.href = "/login"}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Loading your classes...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg flex-shrink-0">
              <Music className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold truncate">Teacher Dashboard</h1>
              <p className="text-xs md:text-sm text-muted-foreground">Manage your music classes and schedule</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <ReminderSystem userType="teacher" />
            <Button 
              onClick={() => {
                const newState = !showBulkSchedule
                setShowBulkSchedule(newState)
                setShowScheduleForm(false)
                if (newState) {
                  setTimeout(() => {
                    bulkScheduleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }, 100)
                }
              }} 
              variant="outline" 
              size="sm"
              className="gap-2 whitespace-nowrap"
            >
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Monthly Schedule</span>
              <span className="sm:hidden">Monthly</span>
            </Button>
            <Button onClick={() => {
              const newState = !showScheduleForm
              setShowScheduleForm(newState)
              setShowBulkSchedule(false)
              if (newState) {
                setTimeout(() => {
                  scheduleFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }, 100)
              }
            }} 
            size="sm"
            className="bg-primary gap-2 whitespace-nowrap">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Single Class</span>
              <span className="sm:hidden">Class</span>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Classes</p>
                  <p className="text-3xl font-bold">{classes.length}</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Music className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming Classes</p>
                  <p className="text-3xl font-bold">{upcomingClasses}</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue (Paid)</p>
                  <p className="text-3xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                  <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          <Button onClick={() => setActiveTab("classes")} variant={activeTab === "classes" ? "default" : "outline"}>
            Classes
          </Button>
          <Button onClick={() => setActiveTab("students")} variant={activeTab === "students" ? "default" : "outline"}>
            Students ({students.length})
          </Button>
          <Button onClick={() => setActiveTab("payments")} variant={activeTab === "payments" ? "default" : "outline"}>
            Payment Tracking
          </Button>
        </div>

        {/* Classes Tab */}
        {activeTab === "classes" && (
          <>
            {/* Calendar View */}
            <div className="mb-8">
              <CalendarView classes={classes} onDateSelect={handleDateSelect} userType="teacher" />
            </div>

            {/* Schedule Form */}
            {showScheduleForm && (
              <Card ref={scheduleFormRef} className="mb-8 border-primary/20 scroll-mt-4">
                <CardHeader>
                  <CardTitle>Schedule New Class</CardTitle>
                  <CardDescription>Add a single class to your schedule</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Student Name</label>
                      <input
                        type="text"
                        placeholder="Enter student name"
                        value={formData.student}
                        onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-input"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Student Email (Optional)</label>
                      <input
                        type="email"
                        placeholder="student@example.com"
                        value={formData.studentEmail}
                        onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-input"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Date</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-input"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Time</label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-input"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Instrument</label>
                      <input
                        type="text"
                        placeholder="e.g., Piano, Guitar, Violin"
                        value={formData.instrument}
                        onChange={(e) => setFormData({ ...formData, instrument: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-input"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Fee per Class (₹)</label>
                      <input
                        type="number"
                        placeholder="500"
                        value={formData.feePerClass}
                        onChange={(e) => setFormData({ ...formData, feePerClass: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-input"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Notes (Optional)</label>
                    <textarea
                      placeholder="Add any notes about this class..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-input min-h-20"
                    />
                  </div>
                  <Button onClick={handleScheduleClass} className="w-full bg-primary">
                    Create Class
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Bulk Schedule Form */}
            {showBulkSchedule && (
              <Card ref={bulkScheduleRef} className="mb-8 border-blue-500/20 scroll-mt-4">
                <CardHeader>
                  <CardTitle>Monthly Schedule</CardTitle>
                  <CardDescription>Schedule multiple classes for a student for the entire month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium mb-2 block">Select Student</label>
                      <select
                        value={bulkScheduleData.studentId}
                        onChange={(e) => setBulkScheduleData({ ...bulkScheduleData, studentId: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-input"
                      >
                        <option value="">Choose a student...</option>
                        {students.map((student) => (
                          <option key={student.id} value={student.id}>
                            {student.name} - {student.instrument} (₹{student.feePerClass}/class)
                          </option>
                        ))}
                      </select>
                      {students.length === 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                          No students found. Add students first or use single class scheduling.
                        </p>
                      )}
                      {students.length > 0 && (
                        <div className="mt-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              console.log("=== DEBUG INFO ===");
                              console.log("Students:", students);
                              console.log("Selected Student ID:", bulkScheduleData.studentId);
                              const selected = students.find(s => s.id === bulkScheduleData.studentId);
                              console.log("Selected Student:", selected);
                              alert(`Students: ${students.length}\nSelected: ${selected ? selected.name + " (" + selected.email + ")" : "None"}`);
                            }}
                          >
                            Debug: Show Student Info
                          </Button>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Start Date</label>
                      <input
                        type="date"
                        value={bulkScheduleData.startDate}
                        onChange={(e) => setBulkScheduleData({ ...bulkScheduleData, startDate: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-input"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Time</label>
                      <input
                        type="time"
                        value={bulkScheduleData.time}
                        onChange={(e) => setBulkScheduleData({ ...bulkScheduleData, time: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-input"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Monthly Package</label>
                      <select
                        value={bulkScheduleData.monthlyPackage}
                        onChange={(e) => setBulkScheduleData({ ...bulkScheduleData, monthlyPackage: parseInt(e.target.value) as 4 | 8 })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-input"
                      >
                        <option value="4">4 Classes/Month</option>
                        <option value="8">8 Classes/Month</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Days of Week</label>
                      <div className="flex flex-wrap gap-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                          <Button
                            key={day}
                            type="button"
                            size="sm"
                            variant={bulkScheduleData.dayOfWeek.includes(index) ? "default" : "outline"}
                            onClick={() => {
                              const days = bulkScheduleData.dayOfWeek.includes(index)
                                ? bulkScheduleData.dayOfWeek.filter(d => d !== index)
                                : [...bulkScheduleData.dayOfWeek, index]
                              setBulkScheduleData({ ...bulkScheduleData, dayOfWeek: days })
                            }}
                          >
                            {day}
                          </Button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Select the days when this student has classes
                      </p>
                    </div>
                  </div>
                  <Button onClick={handleBulkSchedule} className="w-full bg-blue-600 hover:bg-blue-700">
                    Schedule {bulkScheduleData.monthlyPackage} Classes
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Filter */}
            <div className="mb-6 flex gap-2 flex-wrap">
              <Button
                variant={filterInstrument === "all" ? "default" : "outline"}
                onClick={() => setFilterInstrument("all")}
                size="sm"
              >
                All Instruments
              </Button>
              {instruments.map((instrument) => (
                <Button
                  key={instrument}
                  variant={filterInstrument === instrument ? "default" : "outline"}
                  onClick={() => setFilterInstrument(instrument)}
                  size="sm"
                >
                  {instrument}
                </Button>
              ))}
            </div>

            {/* Classes List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Scheduled Classes</h2>
              {filteredClasses.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    No classes scheduled. Create one to get started!
                  </CardContent>
                </Card>
              ) : (
                filteredClasses.map((cls) => (
                  <Card key={cls.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <h3 className="font-semibold text-lg">{cls.student}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {cls.instrument} • ₹{cls.feePerClass}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {cls.date} at {cls.time}
                          </p>
                          {cls.notes && <p className="text-sm text-muted-foreground mt-2 italic">{cls.notes}</p>}
                        </div>
                        <div className="flex items-center gap-3">
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              cls.paid
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                            }`}
                          >
                            {cls.paid ? "Paid" : "Unpaid"}
                          </div>
                          <Button onClick={() => togglePaidStatus(cls.id)} variant="outline" size="sm">
                            {cls.paid ? "Mark Unpaid" : "Mark Paid"}
                          </Button>
                          <Button
                            onClick={() => deleteClassHandler(cls.id)}
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </>
        )}

        {/* Students Tab */}
        {activeTab === "students" && user && (
          <StudentManagement 
            students={students} 
            teacherId={user.uid}
            onStudentsUpdate={reloadStudents}
          />
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && <MonthlyPaymentTracking classes={classes} />}
      </div>
    </div>
  )
}
