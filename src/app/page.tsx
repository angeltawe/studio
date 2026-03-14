"use client"

import Link from "next/link"
import { ArrowRight, BrainCircuit, Calendar, FileText, Flame, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser, useAuth, initiateAnonymousSignIn } from "@/firebase"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LandingPage() {
  const { user, isUserLoading } = useUser()
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleGetStarted = () => {
    if (!user) {
      initiateAnonymousSignIn(auth)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg md:rounded-xl flex items-center justify-center text-white font-headline font-bold text-lg md:text-xl shadow-lg shadow-primary/20">S</div>
          <span className="font-headline font-bold text-xl md:text-2xl tracking-tight text-primary">Schedular</span>
        </div>
        <Button 
          variant="ghost" 
          className="font-medium text-sm md:text-base" 
          onClick={handleGetStarted}
          disabled={isUserLoading}
        >
          {isUserLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (user ? "Dashboard" : "Sign In")}
        </Button>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-8 pb-16 md:pt-24 md:pb-40 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 md:px-4 py-1 rounded-full text-[10px] md:text-sm font-semibold animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            <span>AI-Powered Study Planning</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-headline font-bold leading-[1.1] tracking-tight text-foreground">
            Study Smarter, <br />
            <span className="text-primary">Not Harder.</span>
          </h1>
          
          <p className="text-sm md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Upload your school timetable, and our AI will craft a personalized study plan 
            that prioritizes your weakest subjects—avoiding any clashes with your classes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 pt-4 px-6 sm:px-0">
            <Button 
              size="lg" 
              className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 text-base md:text-lg rounded-xl md:rounded-2xl shadow-xl shadow-primary/20 group"
              onClick={handleGetStarted}
              disabled={isUserLoading}
            >
              {isUserLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Get Started"}
              <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 text-base md:text-lg rounded-xl md:rounded-2xl bg-white/50 backdrop-blur-sm">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-white/50 backdrop-blur-sm py-16 md:py-24 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard 
              icon={<FileText className="w-6 h-6 md:w-8 md:h-8 text-primary" />}
              title="Timetable Parser"
              description="Snap a pic of your school schedule and let AI digitize it instantly."
            />
            <FeatureCard 
              icon={<BrainCircuit className="w-6 h-6 md:w-8 md:h-8 text-primary" />}
              title="AI Study Planner"
              description="Personalized schedules based on subject difficulty rankings."
            />
            <FeatureCard 
              icon={<Flame className="w-6 h-6 md:w-8 md:h-8 text-primary" />}
              title="Streak Tracker"
              description="Stay motivated with a gamified study experience that counts your effort."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 md:py-12 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-[10px] md:text-sm">
          © {new Date().getFullYear()} Schedular AI. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white border border-border shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
      <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-primary/5 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg md:text-xl font-headline font-bold mb-2 md:mb-3">{title}</h3>
      <p className="text-xs md:text-base text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
