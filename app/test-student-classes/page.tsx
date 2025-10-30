"use client"

import { useState } from "react"
import { getClassesByStudentEmail } from "@/lib/firebase/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export const dynamic = 'force-dynamic';

export default function TestStudentClassesPage() {
  const [email, setEmail] = useState("")
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleTest = async () => {
    setLoading(true)
    setResults(null)
    
    try {
      console.log("🔍 Testing query for email:", email)
      const classes = await getClassesByStudentEmail(email)
      console.log("✅ Query result:", classes)
      
      setResults({
        success: true,
        count: classes.length,
        classes: classes
      })
    } catch (error: any) {
      console.error("❌ Error:", error)
      setResults({
        success: false,
        error: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Test Student Classes Query</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Student Email</label>
              <Input
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <Button onClick={handleTest} disabled={!email || loading}>
              {loading ? "Testing..." : "Test Query"}
            </Button>

            {results && (
              <div className="mt-4">
                {results.success ? (
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-green-600">
                      ✅ Found {results.count} classes
                    </p>
                    <pre className="bg-secondary p-4 rounded-lg overflow-auto text-xs">
                      {JSON.stringify(results.classes, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-red-600">
                      ❌ Error: {results.error}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-sm font-medium mb-2">How to use:</p>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Open browser console (F12)</li>
                <li>Enter a student email address</li>
                <li>Click "Test Query"</li>
                <li>Check console for detailed logs</li>
                <li>See results below</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
