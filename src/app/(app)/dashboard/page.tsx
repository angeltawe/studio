"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Flame, Calendar, BrainCircuit, CheckCircle2, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Welcome back, Alex! 👋</h1>
          <p className="text-muted-foreground">You have 3 study sessions scheduled for today.</p>
        </div>
        <Link href="/planner">
          <Button className="rounded-xl shadow-lg shadow-primary/20">
            Generate New Plan
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Streak Card */}
        <Card className="rounded-3xl border-none shadow-sm bg-gradient-to-br from-primary to-accent text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-20">
            <Flame className="w-32 h-32" />
          </div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-lg font-medium opacity-90 flex items-center gap-2">
              <Flame className="w-5 h-5 fill-white" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-6xl font-headline font-bold mb-2">5</div>
            <p className="text-sm opacity-80">Days of continuous learning</p>
          </CardContent>
        </Card>

        {/* Daily Progress */}
        <Card className="rounded-3xl shadow-sm border-border bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Daily Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">1/3 Sessions completed</span>
              <span className="text-primary">33%</span>
            </div>
            <Progress value={33} className="h-3 bg-primary/10" />
            <div className="pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>Next: Advanced Calculus at 4:30 PM</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Readiness */}
        <Card className="rounded-3xl shadow-sm border-border bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-primary" />
              Quiz Mastery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">84%</div>
            <p className="text-sm text-muted-foreground mb-4">Average score across 12 quizzes</p>
            <Link href="/quiz">
              <Button variant="outline" size="sm" className="w-full rounded-xl">
                Take a quick test
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upcoming Sessions */}
        <div className="space-y-4">
          <h2 className="text-xl font-headline font-bold px-1">Upcoming Study Sessions</h2>
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
          <h2 className="text-xl font-headline font-bold px-1">Recent Insights</h2>
          <Card className="rounded-3xl shadow-sm border-none bg-accent/5 p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-2xl shadow-sm">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-primary">AI Optimization Tip</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Based on your quiz performance, we suggest 15 mins extra for Organic Chemistry tomorrow.
                  </p>
                </div>
              </div>
              <Button variant="link" className="p-0 h-auto text-primary font-bold group" asChild>
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
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-border hover:border-primary/20 transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-foreground">{subject}</h4>
          <p className="text-xs text-muted-foreground">{time} • {type}</p>
        </div>
      </div>
      <span className={cn("text-[10px] uppercase font-bold px-2 py-1 rounded-full", difficultyColor)}>
        {difficulty}
      </span>
    </div>
  )
}
