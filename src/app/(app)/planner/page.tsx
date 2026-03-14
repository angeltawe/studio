"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { FileUp, Loader2, Sparkles, CheckCircle2, BrainCircuit } from "lucide-react"
import { extractSchoolTimetable } from "@/ai/flows/extract-school-timetable"
import { generatePersonalizedStudyPlan } from "@/ai/flows/generate-personalized-study-plan"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useUser, useFirestore, addDocumentNonBlocking } from "@/firebase"
import { collection, serverTimestamp } from "firebase/firestore"

type Step = "UPLOAD" | "RANK" | "PREFERENCES" | "GENERATING" | "FINISHED"

export default function PlannerPage() {
  const { user } = useUser()
  const db = useFirestore()
  const [step, setStep] = useState<Step>("UPLOAD")
  const [isLoading, setIsLoading] = useState(false)
  const [timetableData, setTimetableData] = useState<any>(null)
  const [rankings, setRankings] = useState<{ subject: string, difficulty: string }[]>([])
  const { toast } = useToast()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    try {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async () => {
        const base64 = reader.result as string
        const result = await extractSchoolTimetable({ documentDataUri: base64 })
        setTimetableData(result)
        
        const subjects = new Set<string>()
        result.timetable.forEach((day: any) => {
          day.classes.forEach((c: any) => subjects.add(c.subject))
        })
        setRankings(Array.from(subjects).map(s => ({ subject: s, difficulty: "Medium" })))
        
        setStep("RANK")
        setIsLoading(false)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to parse timetable. Please try a clearer image."
      })
      setIsLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!user) return
    setStep("GENERATING")
    try {
      const schoolTimetable = timetableData.timetable.flatMap((day: any) => 
        day.classes.map((c: any) => ({
          day: day.dayOfWeek,
          subject: c.subject,
          startTime: c.startTime,
          endTime: c.endTime
        }))
      )

      const preferredStudyTimes = [
        { day: "Monday", startTime: "17:00", endTime: "20:00" },
        { day: "Tuesday", startTime: "17:00", endTime: "20:00" },
        { day: "Wednesday", startTime: "17:00", endTime: "20:00" },
        { day: "Thursday", startTime: "17:00", endTime: "20:00" },
        { day: "Friday", startTime: "17:00", endTime: "20:00" },
      ]

      const planResult = await generatePersonalizedStudyPlan({
        schoolTimetable,
        preferredStudyTimes,
        subjectDifficultyRankings: rankings as any
      })

      const plansRef = collection(db, "users", user.uid, "personalizedStudyPlans")
      const planData = {
        userId: user.uid,
        name: "My New Study Plan",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        generatedDate: new Date().toISOString(),
        lastModifiedDate: new Date().toISOString(),
        isActive: true,
        createdAt: serverTimestamp()
      }

      const docRef = await addDocumentNonBlocking(plansRef, planData)
      if (docRef) {
        const blocksRef = collection(db, "users", user.uid, "personalizedStudyPlans", docRef.id, "studyBlocks")
        planResult.forEach(session => {
          addDocumentNonBlocking(blocksRef, {
            ownerUserId: user.uid,
            personalizedStudyPlanId: docRef.id,
            subjectId: "subject-id-placeholder",
            title: `${session.subject} Session`,
            description: session.notes || "",
            scheduledDate: new Date().toISOString().split('T')[0],
            startTime: session.startTime,
            endTime: session.endTime,
            isCompleted: false,
            createdAt: serverTimestamp()
          })
        })
      }

      setStep("FINISHED")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Error",
        description: "Something went wrong while generating your plan."
      })
      setStep("RANK")
    }
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 md:p-8 pb-24 md:pb-8">
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-headline font-bold">Study Planner Wizard</h1>
          <p className="text-xs md:text-base text-muted-foreground">Let's build your perfect study schedule.</p>
        </div>
        <div className="flex gap-1 md:gap-2">
          {[1, 2, 3, 4].map(s => (
            <div 
              key={s} 
              className={cn(
                "w-6 md:w-8 h-1 md:h-1.5 rounded-full transition-all duration-500",
                (s === 1 && step === "UPLOAD") || (s === 2 && step === "RANK") || (s === 3 && (step === "PREFERENCES" || step === "GENERATING")) || (s === 4 && step === "FINISHED")
                  ? "bg-primary w-8 md:w-12" 
                  : "bg-muted"
              )} 
            />
          ))}
        </div>
      </div>

      <Card className="rounded-2xl md:rounded-[2rem] shadow-xl shadow-primary/5 border-none bg-white min-h-[400px] flex flex-col overflow-hidden">
        <CardContent className="flex-1 p-6 md:p-8">
          {step === "UPLOAD" && (
            <div className="h-full flex flex-col items-center justify-center space-y-6 md:space-y-8 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-primary/5 flex items-center justify-center text-primary">
                <FileUp className="w-8 h-8 md:w-12 md:h-12" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg md:text-2xl font-headline font-bold">Step 1: Upload Timetable</h3>
                <p className="text-[10px] md:text-sm text-muted-foreground max-w-xs md:max-w-sm px-4">
                  Snap a clear photo of your school schedule. Our AI will extract all classes and times.
                </p>
              </div>
              <div className="w-full max-w-[240px] md:max-w-xs">
                <Label 
                  htmlFor="timetable-upload" 
                  className="flex flex-col items-center justify-center w-full h-28 md:h-40 border-2 border-dashed border-primary/20 rounded-xl md:rounded-3xl cursor-pointer hover:bg-primary/5 transition-colors"
                >
                  {isLoading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-5 h-5 md:w-8 md:h-8 animate-spin text-primary" />
                      <span className="text-[10px] md:text-sm font-medium">Analyzing...</span>
                    </div>
                  ) : (
                    <>
                      <FileUp className="w-5 h-5 md:w-8 md:h-8 text-primary mb-2" />
                      <span className="text-[10px] md:text-sm font-medium text-center">Select Image or PDF</span>
                    </>
                  )}
                  <input id="timetable-upload" type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileUpload} disabled={isLoading} />
                </Label>
              </div>
            </div>
          )}

          {step === "RANK" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-1">
                <h3 className="text-lg md:text-2xl font-headline font-bold">Step 2: Subject Difficulty</h3>
                <p className="text-[10px] md:text-sm text-muted-foreground">Rank your subjects. AI will prioritize study for harder subjects.</p>
              </div>
              <div className="grid gap-2 md:gap-4 max-h-[40vh] overflow-auto pr-2">
                {rankings.map((r, i) => (
                  <div key={r.subject} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 bg-muted/30 rounded-lg md:rounded-2xl gap-2">
                    <span className="font-bold text-xs md:text-base truncate">{r.subject}</span>
                    <select 
                      className="bg-white border border-border rounded-md md:rounded-xl px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-sm outline-none"
                      value={r.difficulty}
                      onChange={(e) => {
                        const newRankings = [...rankings]
                        newRankings[i].difficulty = e.target.value
                        setRankings(newRankings)
                      }}
                    >
                      <option>Very Easy</option>
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                      <option>Very Hard</option>
                    </select>
                  </div>
                ))}
              </div>
              <div className="pt-4 flex justify-between gap-4">
                <Button variant="ghost" onClick={() => setStep("UPLOAD")} className="text-[10px] md:text-sm px-4 md:px-8">Back</Button>
                <Button onClick={() => setStep("PREFERENCES")} className="rounded-lg md:rounded-xl px-4 md:px-8 text-[10px] md:text-sm">Next Step</Button>
              </div>
            </div>
          )}

          {step === "PREFERENCES" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-1">
                <h3 className="text-lg md:text-2xl font-headline font-bold">Step 3: Study Preferences</h3>
                <p className="text-[10px] md:text-sm text-muted-foreground">When do you usually have free time for studying?</p>
              </div>
              <div className="space-y-4 md:space-y-6">
                <div className="p-4 md:p-6 bg-primary/5 rounded-xl md:rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs md:text-base font-bold">Weekday Availability</Label>
                    <span className="text-[9px] md:text-xs text-primary font-bold">17:00 - 21:00</span>
                  </div>
                  <Slider defaultValue={[17, 21]} max={24} step={1} className="py-2 md:py-4" />
                </div>
                <div className="p-4 md:p-6 bg-primary/5 rounded-xl md:rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs md:text-base font-bold">Weekend Intensity</Label>
                    <span className="text-[9px] md:text-xs text-primary font-bold">High (3 hours/day)</span>
                  </div>
                  <Slider defaultValue={[75]} max={100} className="py-2 md:py-4" />
                </div>
              </div>
              <div className="pt-4 flex justify-between gap-4">
                <Button variant="ghost" onClick={() => setStep("RANK")} className="text-[10px] md:text-sm px-4 md:px-8">Back</Button>
                <Button onClick={handleGenerate} className="rounded-lg md:rounded-xl px-4 md:px-8 text-[10px] md:text-sm gap-2">
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                  Generate Plan
                </Button>
              </div>
            </div>
          )}

          {step === "GENERATING" && (
            <div className="h-full flex flex-col items-center justify-center space-y-6 md:space-y-8 py-12 md:py-20 animate-pulse">
              <div className="relative">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <BrainCircuit className="w-6 h-6 md:w-10 md:h-10 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center space-y-2 px-4">
                <h3 className="text-lg md:text-2xl font-headline font-bold">Synthesizing Schedule...</h3>
                <p className="text-[10px] md:text-sm text-muted-foreground">Optimizing your time using neural algorithms.</p>
              </div>
            </div>
          )}

          {step === "FINISHED" && (
            <div className="h-full flex flex-col items-center justify-center space-y-6 md:space-y-8 py-12 md:py-20 animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                <CheckCircle2 className="w-10 h-10 md:w-16 md:h-16" />
              </div>
              <div className="text-center space-y-2 px-4">
                <h3 className="text-lg md:text-2xl font-headline font-bold">Success! Plan Ready.</h3>
                <p className="text-[10px] md:text-sm text-muted-foreground max-w-xs mx-auto">Your personalized study plan has been added to your calendar.</p>
              </div>
              <Link href="/timetable" className="w-full max-w-[200px] md:max-w-xs px-4">
                <Button size="lg" className="w-full rounded-xl md:rounded-2xl h-10 md:h-14 text-sm md:text-lg">
                  View My Timetable
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
