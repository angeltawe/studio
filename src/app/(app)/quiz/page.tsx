"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { BrainCircuit, Loader2, Send, CheckCircle2, XCircle, Sparkles, RefreshCcw } from "lucide-react"
import { generateStudyQuiz, type GenerateStudyQuizOutput } from "@/ai/flows/generate-study-quiz-flow"
import { cn } from "@/lib/utils"

export default function QuizPage() {
  const [topic, setTopic] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [quiz, setQuiz] = useState<GenerateStudyQuizOutput | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResult, setShowResult] = useState(false)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic) return
    setIsLoading(true)
    try {
      const result = await generateStudyQuiz({ topic, numQuestions: 5, difficulty: "medium" })
      setQuiz(result)
      setCurrentStep(0)
      setAnswers({})
      setShowResult(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswer = (option: string) => {
    setAnswers({ ...answers, [currentStep]: option })
    if (currentStep < (quiz?.length || 0) - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300)
    } else {
      setTimeout(() => setShowResult(true), 300)
    }
  }

  const reset = () => {
    setQuiz(null)
    setTopic("")
  }

  if (showResult && quiz) {
    const score = quiz.reduce((acc, q, i) => acc + (answers[i] === q.correctAnswer ? 1 : 0), 0)
    return (
      <div className="container max-w-2xl mx-auto p-4 md:p-8 animate-in zoom-in-95 duration-500">
        <Card className="rounded-[1.5rem] md:rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white text-center p-6 md:p-12 space-y-6 md:space-y-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 md:border-8 border-primary/10 border-t-primary flex items-center justify-center">
              <span className="text-2xl md:text-4xl font-headline font-bold text-primary">{Math.round((score/quiz.length)*100)}%</span>
            </div>
            <Sparkles className="absolute -top-2 -right-2 text-accent w-6 h-6 md:w-10 md:h-10 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-headline font-bold">Quiz Complete!</h2>
            <p className="text-sm md:text-base text-muted-foreground">You got {score} out of {quiz.length} questions correct.</p>
          </div>
          <div className="grid gap-3 md:gap-4 text-left">
             {quiz.map((q, i) => (
               <div key={i} className={cn("p-3 md:p-4 rounded-xl md:rounded-2xl flex items-start gap-3", answers[i] === q.correctAnswer ? "bg-green-50" : "bg-red-50")}>
                  {answers[i] === q.correctAnswer ? <CheckCircle2 className="text-green-600 w-4 h-4 md:w-5 md:h-5 shrink-0 mt-0.5" /> : <XCircle className="text-red-600 w-4 h-4 md:w-5 md:h-5 shrink-0 mt-0.5" />}
                  <div className="min-w-0">
                    <p className="font-bold text-xs md:text-sm mb-1 leading-tight">{q.question}</p>
                    <p className="text-[10px] md:text-xs opacity-70">Correct: {q.correctAnswer}</p>
                  </div>
               </div>
             ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Button variant="outline" className="flex-1 rounded-xl md:rounded-2xl h-10 md:h-12 text-sm md:text-base" onClick={reset}>Try Another Topic</Button>
            <Button className="flex-1 rounded-xl md:rounded-2xl h-10 md:h-12 text-sm md:text-base" onClick={() => { setCurrentStep(0); setAnswers({}); setShowResult(false); }}>Review Quiz</Button>
          </div>
        </Card>
      </div>
    )
  }

  if (quiz) {
    const q = quiz[currentStep]
    const progress = ((currentStep + 1) / quiz.length) * 100
    return (
      <div className="container max-w-3xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-6 md:mb-8 space-y-3 md:space-y-4">
          <div className="flex justify-between items-center text-[10px] md:text-sm font-bold">
            <span className="text-primary uppercase tracking-widest">Question {currentStep + 1} of {quiz.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-1.5 md:h-2 bg-primary/10" />
        </div>
        
        <Card className="rounded-[1.5rem] md:rounded-[2.5rem] border-none shadow-xl bg-white p-6 md:p-12 space-y-6 md:space-y-8">
          <h2 className="text-xl md:text-3xl font-headline font-bold leading-tight">{q.question}</h2>
          <div className="grid gap-3 md:gap-4">
            {q.options.map((option) => (
              <Button
                key={option}
                variant="outline"
                className={cn(
                  "h-auto py-4 md:py-5 px-6 md:px-8 justify-start text-left text-sm md:text-lg rounded-xl md:rounded-2xl border-2 hover:border-primary hover:bg-primary/5 transition-all whitespace-normal break-words",
                  answers[currentStep] === option && "border-primary bg-primary/5"
                )}
                onClick={() => handleAnswer(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-[70vh] md:min-h-[80vh] space-y-8 md:space-y-12">
      <div className="text-center space-y-4 max-w-2xl px-4">
        <div className="inline-flex p-3 md:p-4 rounded-2xl md:rounded-3xl bg-primary/10 text-primary mb-2 md:mb-4 animate-bounce">
          <BrainCircuit className="w-10 h-10 md:w-12 md:h-12" />
        </div>
        <h1 className="text-3xl md:text-6xl font-headline font-bold tracking-tight">AI Quiz Generator</h1>
        <p className="text-sm md:text-lg text-muted-foreground">Enter any subject or specific topic, and our AI will generate a tailored quiz to test your knowledge.</p>
      </div>

      <form onSubmit={handleGenerate} className="w-full max-w-xl relative group px-4">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[1.5rem] md:rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 mx-4" />
        <Card className="relative rounded-[1.5rem] md:rounded-[2rem] border-none shadow-xl bg-white p-2 md:p-4">
          <div className="flex gap-2">
            <Input 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Organic Chemistry, French Revolution..." 
              className="flex-1 border-none bg-transparent h-12 md:h-14 text-sm md:text-lg focus-visible:ring-0 placeholder:text-muted-foreground/60 px-4"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl shrink-0" 
              disabled={isLoading || !topic}
            >
              {isLoading ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> : <Send className="w-5 h-5 md:w-6 md:h-6" />}
            </Button>
          </div>
        </Card>
      </form>

      <div className="flex gap-2 md:gap-4 flex-wrap justify-center px-4">
        {["History", "Quantum Physics", "Algebra", "Biology"].map(t => (
          <Button 
            key={t}
            variant="outline" 
            className="rounded-full bg-white px-4 md:px-6 py-1 h-8 md:h-10 text-xs md:text-sm border-primary/20 hover:border-primary transition-all"
            onClick={() => { setTopic(t); }}
          >
            {t}
          </Button>
        ))}
      </div>
    </div>
  )
}
