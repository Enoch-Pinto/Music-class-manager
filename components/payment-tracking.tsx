"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Clock, Send } from "lucide-react"

interface StudentPayment {
  id: number
  student: string
  instrument: string
  lastClass: string
  totalClasses: number
  paidClasses: number
  unpaidAmount: number
  dueDate: string
  status: "paid" | "pending" | "overdue"
}

interface PaymentTrackingProps {
  classes: Array<{
    id: number
    student: string
    date: string
    time: string
    instrument: string
    paid: boolean
    notes?: string
  }>
}

export function PaymentTracking({ classes }: PaymentTrackingProps) {
  const [reminders, setReminders] = useState<{ [key: string]: boolean }>({})
  const [showReminderForm, setShowReminderForm] = useState(false)
  const [reminderMessage, setReminderMessage] = useState("")

  // Calculate payment status for each student
  const studentPayments: StudentPayment[] = Array.from(
    new Map(
      classes.map((cls) => [
        cls.student,
        {
          id: cls.id,
          student: cls.student,
          instrument: cls.instrument,
          lastClass: cls.date,
          totalClasses: classes.filter((c) => c.student === cls.student).length,
          paidClasses: classes.filter((c) => c.student === cls.student && c.paid).length,
          unpaidAmount: classes.filter((c) => c.student === cls.student && !c.paid).length * 50,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: classes.filter((c) => c.student === cls.student && !c.paid).length > 0 ? "pending" : "paid",
        },
      ]),
    ).values(),
  )

  const overduePayments = studentPayments.filter((p) => p.status === "overdue")
  const pendingPayments = studentPayments.filter((p) => p.status === "pending")
  const paidStudents = studentPayments.filter((p) => p.status === "paid")

  const sendReminder = (student: string) => {
    setReminders({ ...reminders, [student]: true })
    setTimeout(() => {
      setReminders({ ...reminders, [student]: false })
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold">{studentPayments.length}</p>
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
                <p className="text-sm text-muted-foreground">Pending Payments</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{pendingPayments.length}</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Paid Students</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{paidStudents.length}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Payments Alert */}
      {overduePayments.length > 0 && (
        <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950">
          <CardHeader>
            <CardTitle className="text-red-800 dark:text-red-200 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Overdue Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overduePayments.map((payment) => (
                <p key={payment.id} className="text-sm text-red-700 dark:text-red-300">
                  {payment.student} - ${payment.unpaidAmount} overdue
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Status by Student</CardTitle>
          <CardDescription>Track payment status and send reminders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {studentPayments.map((payment) => (
              <div
                key={payment.id}
                className={`p-4 border rounded-lg flex items-center justify-between ${
                  payment.status === "paid"
                    ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                    : payment.status === "overdue"
                      ? "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
                      : "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800"
                }`}
              >
                <div className="flex-1">
                  <p className="font-semibold">{payment.student}</p>
                  <p className="text-sm text-muted-foreground">
                    {payment.paidClasses}/{payment.totalClasses} classes paid
                  </p>
                  {payment.unpaidAmount > 0 && (
                    <p className="text-sm font-medium mt-1">Outstanding: ${payment.unpaidAmount}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      payment.status === "paid"
                        ? "bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-100"
                        : payment.status === "overdue"
                          ? "bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-100"
                          : "bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100"
                    }`}
                  >
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                  {payment.status !== "paid" && (
                    <Button onClick={() => sendReminder(payment.student)} variant="outline" size="sm" className="gap-1">
                      <Send className="w-4 h-4" />
                      {reminders[payment.student] ? "Sent" : "Remind"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reminder Template */}
      <Card>
        <CardHeader>
          <CardTitle>Send Payment Reminder</CardTitle>
          <CardDescription>Customize and send payment reminders to students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Message Template</label>
            <textarea
              placeholder="Hi {student}, this is a friendly reminder that your payment of ${amount} is due by {dueDate}. Please let me know if you have any questions."
              value={reminderMessage}
              onChange={(e) => setReminderMessage(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input min-h-24"
            />
          </div>
          <Button className="w-full bg-primary">Send Reminders to All Pending</Button>
        </CardContent>
      </Card>
    </div>
  )
}
