"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, BookOpen, MapPin, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const mockSchedule = [
  { id: 1, subject: "Mathematics", time: "09:00 - 10:30", type: "School Class", room: "Room 402", color: "bg-blue-500" },
  { id: 2, subject: "Physics", time: "11:00 - 12:30", type: "School Class", room: "Lab B", color: "bg-blue-500" },
  { id: 3, subject: "Advanced Calculus", time: "16:30 - 18:00", type: "Study Session", notes: "Focus on Integration", color: "bg-primary" },
  { id: 4, subject: "Modern Literature", time: "19:30 - 20:30", type: "Study Session", notes: "Chapter 4 Review", color: "bg-primary" },
]

export default function TimetablePage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Calendar Sidebar */}
        <div className="w-full md:w-80 space-y-6">
          <Card className="rounded-3xl shadow-sm border-none bg-white p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-none"
            />
          </Card>

          <Card className="rounded-3xl shadow-sm border-none bg-primary/5 p-6">
            <h4 className="font-bold text-primary mb-4">Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Classes:</span>
                <span className="font-bold">2 sessions</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Self-Study:</span>
                <span className="font-bold">2.5 hours</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Intensity:</span>
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none">Medium</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Schedule View */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-headline font-bold">Schedule</h1>
              <p className="text-muted-foreground">Showing sessions for {date?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-xl"><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon" className="rounded-xl"><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-250px)] pr-4">
            <div className="space-y-4">
              {mockSchedule.map((session) => (
                <Card key={session.id} className="rounded-3xl shadow-sm border-border group overflow-hidden hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row">
                    <div className={cn("w-2 sm:w-3 min-h-full", session.color)} />
                    <CardContent className="flex-1 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold font-headline">{session.subject}</h3>
                            <Badge variant="secondary" className="text-[10px] uppercase">{session.type}</Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              {session.time}
                            </div>
                            {session.room && (
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />
                                {session.room}
                              </div>
                            )}
                          </div>
                          {session.notes && (
                            <p className="mt-2 text-sm text-muted-foreground italic border-l-2 border-primary/20 pl-3">
                              "{session.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                        <Button className="rounded-xl px-6 bg-primary/10 text-primary hover:bg-primary hover:text-white border-none shadow-none">
                          Mark as Done
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
