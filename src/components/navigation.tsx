"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, LayoutDashboard, FileText, BrainCircuit, Flame } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dash", href: "/dashboard", icon: LayoutDashboard, fullName: "Dashboard" },
  { name: "Plan", href: "/planner", icon: FileText, fullName: "Study Planner" },
  { name: "Schedule", href: "/timetable", icon: Calendar, fullName: "My Timetable" },
  { name: "Quiz", href: "/quiz", icon: BrainCircuit, fullName: "AI Quizzer" },
]

export function Navigation() {
  const pathname = usePathname()

  if (pathname === "/") return null

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-border flex justify-around items-center h-16 md:hidden px-2 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 transition-all duration-200 gap-1",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "p-1 rounded-lg transition-colors",
                isActive && "bg-primary/10"
              )}>
                <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-tight">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Desktop Side Nav */}
      <nav className="hidden md:flex md:flex-col md:w-64 md:h-screen md:sticky md:top-0 md:bg-white/50 md:backdrop-blur-sm md:border-r md:px-4 md:py-8 md:gap-4 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 mb-8 px-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-headline font-bold text-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">S</div>
          <span className="font-headline font-bold text-xl tracking-tight text-primary">Schedular</span>
        </Link>

        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.fullName}
              href={item.href}
              className={cn(
                "flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
              <span className="ml-3 text-sm font-bold">{item.fullName}</span>
            </Link>
          )
        })}

        <div className="mt-auto flex flex-col gap-4 w-full px-2">
          <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
              <span className="font-bold text-sm">5 Day Streak</span>
            </div>
            <div className="h-1.5 w-full bg-primary/20 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '70%' }}></div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 font-medium">Finish today's session to keep it alive!</p>
          </div>
        </div>
      </nav>
    </>
  )
}
