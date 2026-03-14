"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, LayoutDashboard, FileText, BrainCircuit, Flame } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Study Planner", href: "/planner", icon: FileText },
  { name: "My Timetable", href: "/timetable", icon: Calendar },
  { name: "AI Quizzer", href: "/quiz", icon: BrainCircuit },
]

export function Navigation() {
  const pathname = usePathname()

  if (pathname === "/") return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-border md:relative md:border-t-0 md:bg-transparent md:w-64 md:h-screen md:flex-col md:border-r">
      <div className="flex justify-around items-center h-16 md:flex-col md:h-full md:items-start md:px-4 md:py-8 md:gap-4">
        <div className="hidden md:flex items-center gap-2 mb-8 px-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-headline font-bold text-xl">S</div>
          <span className="font-headline font-bold text-xl tracking-tight text-primary">Schedular</span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 md:flex-row md:justify-start md:w-full md:px-4 md:py-3 md:rounded-xl transition-all duration-200",
                isActive 
                  ? "text-primary md:bg-primary/10" 
                  : "text-muted-foreground hover:text-primary md:hover:bg-primary/5"
              )}
            >
              <Icon className={cn("w-6 h-6 md:w-5 md:h-5", isActive && "stroke-[2.5px]")} />
              <span className="text-[10px] mt-1 font-medium md:text-sm md:mt-0 md:ml-3">{item.name}</span>
            </Link>
          )
        })}

        <div className="hidden md:mt-auto md:flex flex-col gap-4 w-full px-4">
          <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
              <span className="font-bold text-sm">5 Day Streak</span>
            </div>
            <div className="h-1.5 w-full bg-primary/20 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '70%' }}></div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">Finish today's session to keep it alive!</p>
          </div>
        </div>
      </div>
    </nav>
  )
}