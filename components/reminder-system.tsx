"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, X, CheckCircle } from "lucide-react"

interface Reminder {
  id: string
  type: "payment" | "class" | "alert"
  title: string
  message: string
  dueDate?: string
  read: boolean
  timestamp: Date
}

interface MusicClass {
  id: string
  date: string
  time: string
  instrument: string
}

interface ReminderSystemProps {
  userType: "teacher" | "student"
  classes?: MusicClass[]
}

export function ReminderSystem({ userType, classes = [] }: ReminderSystemProps) {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [showReminders, setShowReminders] = useState(false)
  const [filter, setFilter] = useState<"all" | "unread" | "payment" | "class">("all")

  // Generate reminders from upcoming classes
  useEffect(() => {
    if (classes.length === 0) return

    const now = new Date()
    const upcomingReminders: Reminder[] = []

    classes.forEach((cls) => {
      const classDate = new Date(cls.date)
      const daysBefore = Math.floor((classDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      // Create reminder for classes happening in the next 3 days
      if (daysBefore >= 0 && daysBefore <= 3) {
        const reminderText = daysBefore === 0 
          ? 'today' 
          : daysBefore === 1 
          ? 'tomorrow' 
          : `in ${daysBefore} days`

        upcomingReminders.push({
          id: `class-${cls.id}`,
          type: "class",
          title: `${cls.instrument} Class ${reminderText}`,
          message: `Your ${cls.instrument} class is scheduled for ${classDate.toLocaleDateString()} at ${cls.time}`,
          dueDate: `${classDate.toLocaleDateString()} ${cls.time}`,
          read: false,
          timestamp: classDate
        })
      }
    })

    setReminders(upcomingReminders)
  }, [classes])

  const unreadCount = reminders.filter((r) => !r.read).length

  const filteredReminders = reminders.filter((r) => {
    if (filter === "unread") return !r.read
    if (filter === "payment") return r.type === "payment"
    if (filter === "class") return r.type === "class"
    return true
  })

  const markAsRead = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, read: true } : r))
  }

  const dismissReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id))
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <div className="relative">
        <Button onClick={() => setShowReminders(!showReminders)} variant="outline" size="sm" className="relative gap-2">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </div>

      {/* Reminders Dropdown */}
      {showReminders && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 bg-black/20 z-40 md:hidden" 
            onClick={() => setShowReminders(false)}
          />
          
          <div className="fixed md:absolute right-0 md:right-0 top-0 md:top-12 w-full md:w-96 max-w-md h-full md:h-auto bg-background border-0 md:border border-border md:rounded-lg shadow-lg z-50">
            <Card className="border-0 shadow-none h-full md:h-auto flex flex-col">
              <CardHeader className="pb-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Notifications</CardTitle>
                  <Button onClick={() => setShowReminders(false)} variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <Button
                    onClick={() => setFilter("all")}
                    variant={filter === "all" ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                  >
                    All
                  </Button>
                  <Button
                    onClick={() => setFilter("unread")}
                    variant={filter === "unread" ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                  >
                    Unread
                  </Button>
                  <Button
                    onClick={() => setFilter("payment")}
                    variant={filter === "payment" ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                  >
                    Payment
                  </Button>
                  <Button
                    onClick={() => setFilter("class")}
                    variant={filter === "class" ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                  >
                    Class
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 flex-1 overflow-y-auto">
                {filteredReminders.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground font-medium">No notifications</p>
                    <p className="text-xs text-muted-foreground mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  filteredReminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className={`p-3 border rounded-lg flex gap-3 ${
                        reminder.read ? "bg-secondary" : "bg-primary/5 border-primary/30"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{reminder.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{reminder.message}</p>
                        {reminder.dueDate && (
                          <p className="text-xs text-muted-foreground mt-1">Due: {reminder.dueDate}</p>
                        )}
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        {!reminder.read && (
                          <Button
                            onClick={() => markAsRead(reminder.id)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          onClick={() => dismissReminder(reminder.id)}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
