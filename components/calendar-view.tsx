"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarClass {
  id: string | number
  date: string
  time: string
  instrument: string
  student?: string
  completed?: boolean
  paid?: boolean
}

interface CalendarViewProps {
  classes: CalendarClass[]
  onDateSelect?: (date: string) => void
  userType?: "teacher" | "student"
}

export function CalendarView({ classes, onDateSelect, userType = "student" }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1)) // October 2025

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getClassesForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return classes.filter((cls) => cls.date === dateStr)
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" })

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Class Calendar</CardTitle>
            <CardDescription>View your classes by month</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={previousMonth} variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-32 text-center">{monthName}</span>
            <Button onClick={nextMonth} variant="outline" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-[10px] md:text-sm font-semibold text-muted-foreground py-1 md:py-2">
                <span className="md:hidden">{day.substring(0, 1)}</span>
                <span className="hidden md:inline">{day}</span>
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {days.map((day, index) => {
              const classesForDay = day ? getClassesForDate(day) : []
              const hasClasses = classesForDay.length > 0

              return (
                <div
                  key={index}
                  onClick={() => {
                    if (day && onDateSelect) {
                      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                      onDateSelect(dateStr)
                    }
                  }}
                  className={`min-h-16 md:min-h-24 p-1 md:p-2 border rounded-lg transition-colors ${
                    day
                      ? hasClasses
                        ? "bg-primary/10 border-primary/30 cursor-pointer hover:bg-primary/20"
                        : "bg-secondary border-border hover:bg-secondary/80 cursor-pointer"
                      : "bg-muted border-border"
                  }`}
                >
                  {day && (
                    <div className="h-full flex flex-col">
                      <span className="text-xs md:text-sm font-semibold text-foreground mb-0.5 md:mb-1">{day}</span>
                      <div className="flex-1 space-y-0.5 md:space-y-1 overflow-hidden">
                        {classesForDay.slice(0, 2).map((cls) => (
                          <div
                            key={cls.id}
                            className={`text-[10px] md:text-xs p-0.5 md:p-1 rounded truncate font-medium ${
                              cls.completed
                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                                : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100"
                            }`}
                            title={`${cls.time} - ${userType === "teacher" && cls.student ? cls.student : cls.instrument}`}
                          >
                            <div className="truncate">
                              {cls.time.substring(0, 5)}
                            </div>
                            <div className="truncate hidden md:block">
                              {userType === "teacher" && cls.student ? cls.student : cls.instrument}
                            </div>
                          </div>
                        ))}
                        {classesForDay.length > 2 && (
                          <div className="text-[10px] md:text-xs text-muted-foreground px-0.5 md:px-1">+{classesForDay.length - 2}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-6 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700" />
              <span className="text-sm text-muted-foreground">Upcoming</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700" />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
