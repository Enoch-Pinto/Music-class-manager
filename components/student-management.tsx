"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Edit2, Plus, User, Music } from "lucide-react"
import { createStudent, updateStudent, deleteStudent, type Student } from "@/lib/firebase/database"

interface StudentManagementProps {
  students: Student[]
  teacherId: string
  onStudentsUpdate: () => void
}

export function StudentManagement({ students, teacherId, onStudentsUpdate }: StudentManagementProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    instrument: "",
    feePerClass: 500,
    monthlyPackage: 4 as 4 | 8,
  })
  const [loading, setLoading] = useState(false)

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      instrument: "",
      feePerClass: 500,
      monthlyPackage: 4,
    })
    setEditingStudent(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingStudent) {
        // Update existing student
        await updateStudent(editingStudent.id, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          instrument: formData.instrument,
          feePerClass: formData.feePerClass,
          monthlyPackage: formData.monthlyPackage,
        })
      } else {
        // Create new student
        await createStudent({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          instrument: formData.instrument,
          feePerClass: formData.feePerClass,
          monthlyPackage: formData.monthlyPackage,
          teacherId,
        })
      }
      resetForm()
      onStudentsUpdate()
    } catch (error: any) {
      console.error("Error saving student:", error)
      alert("Failed to save student: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (student: Student) => {
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone || "",
      instrument: student.instrument,
      feePerClass: student.feePerClass,
      monthlyPackage: student.monthlyPackage,
    })
    setEditingStudent(student)
    setShowForm(true)
  }

  const handleDelete = async (studentId: string, studentName: string) => {
    if (!confirm(`Are you sure you want to delete ${studentName}? This will not delete their scheduled classes.`)) {
      return
    }

    try {
      await deleteStudent(studentId)
      onStudentsUpdate()
    } catch (error: any) {
      console.error("Error deleting student:", error)
      alert("Failed to delete student: " + error.message)
    }
  }

  return (
    <div className="space-y-4">
      {/* Info Box */}
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Music className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                How Student Management Works
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <strong>Step 1:</strong> Add students here with their details (name, email, instrument, fee).
                <br />
                <strong>Step 2:</strong> Go to the "Classes" tab and schedule classes for them.
                <br />
                <strong>Step 3:</strong> Students can login with their email to see their scheduled classes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Students</h2>
        <Button 
          onClick={() => setShowForm(!showForm)} 
          className="gap-2"
          variant={showForm ? "outline" : "default"}
        >
          <Plus className="w-4 h-4" />
          {showForm ? "Cancel" : "Add Student"}
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>{editingStudent ? "Edit Student" : "Add New Student"}</CardTitle>
            <CardDescription>
              {editingStudent ? "Update student information" : "Add a student to your roster"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Student Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instrument">Instrument *</Label>
                  <Input
                    id="instrument"
                    type="text"
                    placeholder="Piano, Guitar, Violin..."
                    value={formData.instrument}
                    onChange={(e) => setFormData({ ...formData, instrument: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feePerClass">Fee per Class (₹) *</Label>
                  <Input
                    id="feePerClass"
                    type="number"
                    placeholder="500"
                    value={formData.feePerClass}
                    onChange={(e) => setFormData({ ...formData, feePerClass: parseInt(e.target.value) || 0 })}
                    required
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyPackage">Default Monthly Package *</Label>
                  <select
                    id="monthlyPackage"
                    value={formData.monthlyPackage}
                    onChange={(e) => setFormData({ ...formData, monthlyPackage: parseInt(e.target.value) as 4 | 8 })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input"
                    required
                  >
                    <option value="4">4 Classes/Month</option>
                    <option value="8">8 Classes/Month</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Saving..." : editingStudent ? "Update Student" : "Add Student"}
                </Button>
                {editingStudent && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel Edit
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6 text-center text-muted-foreground">
              <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No students added yet. Add your first student to get started!</p>
            </CardContent>
          </Card>
        ) : (
          students.map((student) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {student.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{student.instrument}</p>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">📧 {student.email}</p>
                    {student.phone && <p className="text-muted-foreground">📱 {student.phone}</p>}
                    <p className="font-medium">💰 ₹{student.feePerClass.toLocaleString('en-IN')}/class</p>
                    <p className="text-muted-foreground">📅 {student.monthlyPackage} classes/month</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleEdit(student)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(student.id, student.name)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
