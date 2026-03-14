"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Flame, Calendar, BrainCircuit, CheckCircle2, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useUser } from "@/firebase"

export default function DashboardPage() {
  const { user } = useUser()
  const firstName = user?.displayName?.split(" ")[0] || "Student"

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold">Welcome back, {firstName}! 👋</h1>
          <p className="text-sm md:text-base text-muted-foreground">You have 3 study sessions scheduled for today.</p>
        </div>
        <Link href="/planner" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto rounded-xl shadow-lg shadow-primary/20">
            Generate New Plan
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Streak Card */}
        <Card className="rounded-3xl border-none shadow-sm bg-gradient-to-br from-primary to-accent text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 md:p-8 opacity-20">
            <Flame className="w-24 h-24 md:w-32 md:h-32" />
          </div>
          <CardHeader className="relative z-10 pb-2">
            <CardTitle className="text-base md:text-lg font-medium opacity-90 flex items-center gap-2">
              <Flame className="w-4 h-4 md:w-5 md:h-5 fill-white" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl md:text-6xl font-headline font-bold mb-1">5</div>
            <p className="text-xs md:text-sm opacity-80">Days of continuous learning</p>
          </CardContent>
        </Card>

        {/* Daily Progress */}
        <Card className="rounded-3xl shadow-sm border-border bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg font-headline flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              Daily Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-xs md:text-sm mb-1">
              <span className="font-medium">1/3 Sessions completed</span>
              <span className="text-primary font-bold">33%</span>
            </div>
            <Progress value={33} className="h-2 md:h-3 bg-primary/10" />
            <div className="pt-2">
              <div className="flex items-center gap-2 text-[10px] md:text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary" />
                <span>Next: Advanced Calculus at 4:30 PM</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Readiness */}
        <Card className="rounded-3xl shadow-sm border-border bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg font-headline flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              Quiz Mastery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold mb-1">84%</div>
            <p className="text-xs md:text-sm text-muted-foreground mb-4">Average score across 12 quizzes</p>
            <Link href="/quiz">
              <Button variant="outline" size="sm" className="w-full rounded-xl">
                Take a quick test
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Upcoming Sessions */}
        <div className="space-y-4">
          <h2 className="text-lg md:text-xl font-headline font-bold px-1">Upcoming Study Sessions</h2>
          <div className="space-y-3">
            <SessionItem 
              subject="Advanced Calculus" 
              time="16:30 - 18:00" 
              type="Focus" 
              difficulty="Hard"
            />
            <SessionItem 
              subject="Modern Literature" 
              time="19:30 - 20:30" 
              type="Reading" 
              difficulty="Medium"
            />
            <SessionItem 
              subject="Chemistry Lab Prep" 
              time="Tomorrow, 09:00" 
              type="Review" 
              difficulty="Very Hard"
            />
          </div>
        </div>

        {/* Quick Actions / Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-lg md:text-xl font-headline font-bold px-1">Recent Insights</h2>
          <Card className="rounded-3xl shadow-sm border-none bg-accent/5 p-4 md:p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="bg-white p-2 md:p-3 rounded-xl md:rounded-2xl shadow-sm shrink-0">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-sm md:text-base text-primary">AI Optimization Tip</h4>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    Based on your quiz performance, we suggest 15 mins extra for Organic Chemistry tomorrow.
                  </p>
                </div>
              </div>
              <Button variant="link" className="p-0 h-auto text-sm md:text-base text-primary font-bold group" asChild>
                <Link href="/planner">
                  Update Schedule <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function SessionItem({ subject, time, type, difficulty }: { subject: string, time: string, type: string, difficulty: string }) {
  const difficultyColor = {
    "Easy": "bg-green-100 text-green-700",
    "Medium": "bg-blue-100 text-blue-700",
    "Hard": "bg-orange-100 text-orange-700",
    "Very Hard": "bg-red-100 text-red-700"
  }[difficulty as keyof typeof difficultyColor] || "bg-muted text-muted-foreground"

  return (
    <div className="flex items-center justify-between p-3 md:p-4 bg-white rounded-2xl border border-border hover:border-primary/20 transition-all group">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
          <Calendar className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-sm md:text-base text-foreground truncate">{subject}</h4>
          <p className="text-[10px] md:text-xs text-muted-foreground truncate">{time} • {type}</p>
        </div>
      </div>
      <span className={cn("text-[9px] md:text-[10px] uppercase font-bold px-2 py-1 rounded-full shrink-0 ml-2", difficultyColor)}>
        {difficulty}
      </span>
    </div>
  )
}
