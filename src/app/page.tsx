import Link from "next/link"
import { ArrowRight, BrainCircuit, Calendar, FileText, Flame, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-headline font-bold text-xl shadow-lg shadow-primary/20">S</div>
          <span className="font-headline font-bold text-2xl tracking-tight text-primary">Schedular</span>
        </div>
        <Link href="/dashboard">
          <Button variant="ghost" className="font-medium">Sign In</Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-12 pb-24 md:pt-24 md:pb-40 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Study Planning</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-headline font-bold leading-[1.1] tracking-tight text-foreground">
            Study Smarter, <br />
            <span className="text-primary">Not Harder.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Upload your school timetable, and our AI will craft a personalized study plan 
            that prioritizes your weakest subjects—avoiding any clashes with your classes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-8 text-lg rounded-2xl shadow-xl shadow-primary/20 group">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-2xl bg-white/50 backdrop-blur-sm">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-white/50 backdrop-blur-sm py-24 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FileText className="w-8 h-8 text-primary" />}
              title="Timetable Parser"
              description="Snap a pic of your school schedule and let AI digitize it instantly."
            />
            <FeatureCard 
              icon={<BrainCircuit className="w-8 h-8 text-primary" />}
              title="AI Study Planner"
              description="Personalized schedules based on subject difficulty rankings."
            />
            <FeatureCard 
              icon={<Flame className="w-8 h-8 text-primary" />}
              title="Streak Tracker"
              description="Stay motivated with a gamified study experience that counts your effort."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} Schedular AI. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-white border border-border shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
      <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-headline font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}