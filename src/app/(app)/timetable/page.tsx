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
    <div className="container mx-auto p-4 md:p-8 space-y-6 md:space-y-0">
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Calendar Sidebar */}
        <div className="w-full lg:w-80 space-y-4 md:space-y-6 order-2 lg:order-1">
          <Card className="rounded-2xl md:rounded-3xl shadow-sm border-none bg-white p-2 md:p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-none w-full flex justify-center"
            />
          </Card>

          <Card className="rounded-2xl md:rounded-3xl shadow-sm border-none bg-primary/5 p-5 md:p-6">
            <h4 className="font-bold text-primary mb-4 text-sm md:text-base">Daily Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-muted-foreground">Classes:</span>
                <span className="font-bold">2 sessions</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-muted-foreground">Self-Study:</span>
                <span className="font-bold">2.5 hours</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm items-center">
                <span className="text-muted-foreground">Intensity:</span>
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none text-[10px] md:text-xs">Medium</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Schedule View */}
        <div className="flex-1 space-y-4 md:space-y-6 order-1 lg:order-2">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-headline font-bold truncate">Schedule</h1>
              <p className="text-xs md:text-sm text-muted-foreground truncate">
                {date?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-1 md:gap-2 shrink-0">
              <Button variant="outline" size="icon" className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl"><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon" className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl"><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>

          <ScrollArea className="h-auto lg:h-[calc(100vh-250px)] lg:pr-4">
            <div className="space-y-3 md:space-y-4 pb-16 md:pb-0">
              {mockSchedule.map((session) => (
                <Card key={session.id} className="rounded-2xl md:rounded-3xl shadow-sm border-border group overflow-hidden hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row min-h-full">
                    <div className={cn("h-1.5 sm:h-auto sm:w-2 md:w-3", session.color)} />
                    <CardContent className="flex-1 p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                          <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-base md:text-xl font-bold font-headline truncate">{session.subject}</h3>
                            <Badge variant="secondary" className="text-[8px] md:text-[10px] uppercase">{session.type}</Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-[10px] md:text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
                              {session.time}
                            </div>
                            {session.room && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                {session.room}
                              </div>
                            )}
                          </div>
                          {session.notes && (
                            <p className="mt-2 text-[10px] md:text-sm text-muted-foreground italic border-l-2 border-primary/20 pl-2 md:pl-3">
                              "{session.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 shrink-0">
                        <Button variant="ghost" size="icon" className="hidden md:inline-flex h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                        <Button className="h-8 md:h-10 text-xs md:text-sm rounded-lg md:rounded-xl px-4 md:px-6 bg-primary/10 text-primary hover:bg-primary hover:text-white border-none shadow-none flex-1 md:flex-none">
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
