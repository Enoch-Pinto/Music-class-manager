"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { TeacherDashboard } from "@/components/teacher-dashboard"
import { StudentDashboard } from "@/components/student-dashboard"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { logOut } from "@/lib/firebase/auth"

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [userRole, setUserRole] = useState<"teacher" | "student" | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/select-role')
      return
    }

    if (user) {
      // Get stored role
      const storedRole = sessionStorage.getItem('userRole') as "teacher" | "student" | null
      if (storedRole) {
        setUserRole(storedRole)
      } else {
        // No role stored, redirect to role selection
        router.push('/select-role')
      }
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    try {
      await logOut()
      sessionStorage.removeItem('userRole')
      router.push('/select-role')
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (loading || !user || !userRole) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <div className="relative">
      {/* Logout Button - Fixed at top right */}
      <div className="fixed top-4 right-4 z-50">
        <Button 
          onClick={handleLogout} 
          variant="outline" 
          size="sm"
          className="gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      {/* Show appropriate dashboard */}
      {userRole === "teacher" ? <TeacherDashboard /> : <StudentDashboard />}
    </div>
  )
}
