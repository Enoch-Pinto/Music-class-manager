"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music, Calendar, AlertCircle, CheckCircle, Bell, CreditCard } from "lucide-react"
import { CalendarView } from "@/components/calendar-view"
import { ReminderSystem } from "@/components/reminder-system"
import { useAuth } from "@/lib/contexts/auth-context"
import { getClassesByStudentEmail, updateClass, type MusicClass } from "@/lib/firebase/database"

interface StudentClass {
  id: string
  date: string
  time: string
  instrument: string
  feePerClass: number
  completed: boolean
  paid: boolean
  teacherId: string
}

interface PaymentStatus {
  paid: boolean
  amount: number
  dueDate: string
  nextDueDate: string
}

// Student Dashboard - View only component for students
export function StudentDashboard() {
  const { user } = useAuth()
  const [classes, setClasses] = useState<StudentClass[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Load classes from Firebase based on student's email
  useEffect(() => {
    if (!user?.email) {
      setLoading(false)
      return
    }

    const loadClasses = async () => {
      try {
        console.log("🔍 Student Dashboard - Loading classes for email:", user.email)
        const firebaseClasses = await getClassesByStudentEmail(user.email!)
        console.log("📚 Student Dashboard - Found classes:", firebaseClasses.length, firebaseClasses)
        const formattedClasses = firebaseClasses.map((cls) => ({
          id: cls.id,
          date: cls.date,
          time: cls.time,
          instrument: cls.instrument,
          feePerClass: cls.feePerClass,
          completed: cls.completed,
          paid: cls.paid,
          teacherId: cls.teacherId,
        }))
        setClasses(formattedClasses)
      } catch (error) {
        console.error("❌ Error loading classes:", error)
      } finally {
        setLoading(false)
      }
    }

    loadClasses()
  }, [user])

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
  }

  const completedClasses = classes.filter((c) => c.completed).length
  const totalClasses = classes.length
  const totalPaid = classes.filter((c) => c.paid).reduce((sum, c) => sum + c.feePerClass, 0)
  const totalDue = classes.filter((c) => !c.paid).reduce((sum, c) => sum + c.feePerClass, 0)
  
  // Group classes by month for monthly payment tracking
  const classesByMonth = classes.reduce((acc, cls) => {
    const month = cls.date.substring(0, 7) // "2025-10"
    if (!acc[month]) {
      acc[month] = []
    }
    acc[month].push(cls)
    return acc
  }, {} as Record<string, typeof classes>)
  
  // Calculate monthly totals
  const monthlyPayments = Object.entries(classesByMonth).map(([month, monthClasses]) => {
    const total = monthClasses.reduce((sum, cls) => sum + cls.feePerClass, 0)
    const paid = monthClasses.every(cls => cls.paid)
    return { month, total, paid, classCount: monthClasses.length }
  }).sort((a, b) => b.month.localeCompare(a.month))
  
  // Calculate payment status for CURRENT MONTH ONLY
  const currentMonth = new Date().toISOString().substring(0, 7) // "2025-10"
  const currentMonthClasses = classes.filter(cls => cls.date.startsWith(currentMonth))
  const currentMonthTotal = currentMonthClasses.reduce((sum, cls) => sum + cls.feePerClass, 0)
  
  // Check if ALL classes in the current month are marked as paid
  const currentMonthAllPaid = currentMonthClasses.length > 0 && currentMonthClasses.every(cls => cls.paid)
  
  // Calculate next month's due date
  const nextMonth = new Date()
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  const nextMonthDueDate = nextMonth.toISOString().substring(0, 7)
  
  const paymentStatus: PaymentStatus = {
    paid: currentMonthAllPaid,
    amount: currentMonthTotal,
    dueDate: currentMonth,
    nextDueDate: nextMonthDueDate,
  }

  const calendarClasses = classes.map((cls) => ({
    ...cls,
    student: "Your Class",
  }))

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Please log in to see your classes</p>
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg flex-shrink-0">
              <Music className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold truncate">My Music Classes</h1>
              <p className="text-xs md:text-sm text-muted-foreground">Track your lessons and payments</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <ReminderSystem 
              userType="student" 
              classes={classes.map(cls => ({
                id: cls.id,
                date: cls.date,
                time: cls.time,
                instrument: cls.instrument
              }))} 
            />
          </div>
        </div>

        {/* Scheduled Classes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Class Calendar</CardTitle>
            <CardDescription>Your scheduled and completed classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Total Classes</p>
                <p className="text-3xl font-bold">{totalClasses}</p>
              </div>
              <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold">{completedClasses}</p>
              </div>
              <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-3xl font-bold">{totalClasses - completedClasses}</p>
              </div>
            </div>
            <div className="space-y-3">
              {classes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No classes scheduled yet</p>
              ) : (
                classes.map((cls) => (
                  <div
                    key={cls.id}
                    className={`p-4 border rounded-lg flex items-center justify-between gap-4 ${
                      cls.completed ? "bg-secondary" : ""
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">{cls.instrument}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {cls.date} at {cls.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          cls.completed
                            ? "bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-100"
                            : "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-100"
                      }`}
                      >
                        {cls.completed ? "Completed" : "Upcoming"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Calendar View */}
        <div className="mb-8">
          <CalendarView classes={calendarClasses} onDateSelect={handleDateSelect} userType="student" />
        </div>

        {/* Payment Status Card */}
        <Card
          className={`mb-8 border-2 ${paymentStatus.paid ? "border-green-200 dark:border-green-900" : "border-red-200 dark:border-red-900"}`}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Monthly Payment Status</CardTitle>
              {paymentStatus.paid && <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />}
            </div>
            <CardDescription>Fees collected monthly at the start of each month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">This Month's Status</p>
                <p
                  className={`text-2xl font-bold ${paymentStatus.paid ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {paymentStatus.paid ? "✓ Paid" : "✗ Unpaid"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month's Fee</p>
                <p className="text-2xl font-bold">₹{paymentStatus.amount.toLocaleString('en-IN')}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentMonthClasses.length} {currentMonthClasses.length === 1 ? 'class' : 'classes'} this month
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">₹{totalDue.toLocaleString('en-IN')}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all months
                </p>
              </div>
            </div>
            {!paymentStatus.paid && paymentStatus.amount > 0 && (
              <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 dark:text-red-200">
                  Monthly fee of ₹{paymentStatus.amount.toLocaleString('en-IN')} is due. Please pay at the start of the month.
                </p>
              </div>
            )}
            {paymentStatus.paid && (
              <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg flex gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800 dark:text-green-200">
                  This month's payment is complete. Thank you!
                </p>
              </div>
            )}
            {paymentStatus.amount === 0 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg flex gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  No classes scheduled for this month yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Calendar View */}
        <div className="mb-8">
          <CalendarView classes={calendarClasses} onDateSelect={handleDateSelect} userType="student" />
        </div>

        {/* Payment Status Card - Moved below calendar */}
        <Card
          className={`mb-8 border-2 ${paymentStatus.paid ? "border-green-200 dark:border-green-900" : "border-red-200 dark:border-red-900"}`}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Monthly Payment Status</CardTitle>
              {paymentStatus.paid && <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />}
            </div>
            <CardDescription>Fees collected monthly at the start of each month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">This Month's Status</p>
                <p
                  className={`text-2xl font-bold ${paymentStatus.paid ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {paymentStatus.paid ? "✓ Paid" : "✗ Unpaid"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month's Fee</p>
                <p className="text-2xl font-bold">₹{paymentStatus.amount.toLocaleString('en-IN')}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentMonthClasses.length} {currentMonthClasses.length === 1 ? 'class' : 'classes'} this month
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">₹{totalDue.toLocaleString('en-IN')}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all months
                </p>
              </div>
            </div>
            {!paymentStatus.paid && paymentStatus.amount > 0 && (
              <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 dark:text-red-200">
                  Monthly fee of ₹{paymentStatus.amount.toLocaleString('en-IN')} is due. Please pay at the start of the month.
                </p>
              </div>
            )}
            {paymentStatus.paid && (
              <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg flex gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800 dark:text-green-200">
                  This month's payment is complete. Thank you!
                </p>
              </div>
            )}
            {paymentStatus.amount === 0 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg flex gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  No classes scheduled for this month yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment History - Moved below calendar */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment History by Month
            </CardTitle>
            <CardDescription>Track your monthly payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyPayments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No payment history yet</p>
              ) : (
                monthlyPayments.map((payment) => (
                  <div
                    key={payment.month}
                    className={`p-4 border rounded-lg flex items-center justify-between ${
                      payment.paid
                        ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                        : "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800"
                    }`}
                  >
                    <div>
                      <p className="font-semibold">
                        {new Date(payment.month + "-01").toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </p>
                      <p className="text-sm text-muted-foreground">{payment.classCount} classes</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">₹{payment.total.toLocaleString('en-IN')}</p>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          payment.paid
                            ? "bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-100"
                            : "bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-100"
                        }`}
                      >
                        {payment.paid ? "✓ Paid" : "✗ Unpaid"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
