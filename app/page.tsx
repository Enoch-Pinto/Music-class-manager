"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in - redirect to role selection
        router.push('/select-role')
      } else {
        // Already logged in - check user type and redirect to dashboard
        router.push('/dashboard')
      }
    }
  }, [user, loading, router])

  // Show loading state
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    </main>
  )
}
