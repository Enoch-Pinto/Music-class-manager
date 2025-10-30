"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SelectRolePage() {
  const router = useRouter()

  const handleRoleSelection = (role: "teacher" | "student") => {
    // Store the selected role in sessionStorage
    sessionStorage.setItem('userRole', role)
    // Redirect to login with the role
    router.push(`/login?role=${role}`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-lg">
              <Music className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Music Class Hub</CardTitle>
          <CardDescription>Choose your role to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => handleRoleSelection("teacher")} 
            className="w-full h-12 text-base" 
            size="lg"
          >
            I'm a Teacher
          </Button>
          <Button
            onClick={() => handleRoleSelection("student")}
            variant="outline"
            className="w-full h-12 text-base"
            size="lg"
          >
            I'm a Student
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
