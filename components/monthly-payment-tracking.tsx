"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Calendar } from "lucide-react"
import { updateClass, type MusicClass } from "@/lib/firebase/database"

interface MonthlyPaymentTrackingProps {
  classes: MusicClass[]
}

export function MonthlyPaymentTracking({ classes }: MonthlyPaymentTrackingProps) {
  // Group classes by student and month
  const studentMonthlyData = classes.reduce((acc, cls) => {
    const key = `${cls.studentEmail || cls.studentId}_${cls.date.substring(0, 7)}`
    if (!acc[key]) {
      acc[key] = {
        studentName: cls.studentName,
        studentEmail: cls.studentEmail,
        month: cls.date.substring(0, 7),
        classes: [],
      }
    }
    acc[key].classes.push(cls)
    return acc
  }, {} as Record<string, { studentName: string; studentEmail?: string; month: string; classes: MusicClass[] }>)

  const monthlyPayments = Object.values(studentMonthlyData).map((data) => {
    const totalFee = data.classes.reduce((sum, cls) => sum + cls.feePerClass, 0)
    const allPaid = data.classes.every(cls => cls.paid)
    return {
      ...data,
      totalFee,
      allPaid,
      classCount: data.classes.length,
    }
  }).sort((a, b) => b.month.localeCompare(a.month))

  const handleToggleMonthPayment = async (studentEmail: string | undefined, month: string, setPaid: boolean) => {
    try {
      const classesToUpdate = classes.filter(
        cls => (cls.studentEmail === studentEmail || cls.studentId === studentEmail) && 
               cls.date.startsWith(month)
      )
      
      await Promise.all(
        classesToUpdate.map(cls => updateClass(cls.id, { paid: setPaid }))
      )
    } catch (error: any) {
      console.error("Error updating payments:", error)
      alert("Failed to update payment status: " + error.message)
    }
  }

  const currentMonth = new Date().toISOString().substring(0, 7)
  const totalDue = monthlyPayments
    .filter(p => !p.allPaid)
    .reduce((sum, p) => sum + p.totalFee, 0)
  
  const totalCollected = monthlyPayments
    .filter(p => p.allPaid)
    .reduce((sum, p) => sum + p.totalFee, 0)

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Collected</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  ₹{totalCollected.toLocaleString('en-IN')}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  ₹{totalDue.toLocaleString('en-IN')}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold">
                  {new Set(classes.map(c => c.studentEmail || c.studentId)).size}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Payments by Student */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Fee Collection</CardTitle>
          <CardDescription>Collect the entire month's fees once at the beginning of the month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {monthlyPayments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No classes scheduled yet</p>
            ) : (
              monthlyPayments.map((payment, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg ${
                    payment.allPaid
                      ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                      : "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{payment.studentName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.month + "-01").toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{payment.classCount} classes this month</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold">₹{payment.totalFee.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                            payment.allPaid
                              ? "bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-100"
                              : "bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-100"
                          }`}
                        >
                          {payment.allPaid ? "✓ Collected" : "✗ Not Collected"}
                        </span>
                        <Button
                          onClick={() => handleToggleMonthPayment(payment.studentEmail, payment.month, !payment.allPaid)}
                          size="sm"
                          variant={payment.allPaid ? "outline" : "default"}
                          className="whitespace-nowrap"
                        >
                          {payment.allPaid ? "Mark as Not Collected" : "✓ Collect Payment"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
