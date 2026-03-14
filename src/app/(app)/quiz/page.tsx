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
      <div className="container max-w-2xl mx-auto p-8 animate-in zoom-in-95 duration-500">
        <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white text-center p-12 space-y-8">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full border-8 border-primary/10 border-t-primary flex items-center justify-center">
              <span className="text-4xl font-headline font-bold text-primary">{Math.round((score/quiz.length)*100)}%</span>
            </div>
            <Sparkles className="absolute -top-4 -right-4 text-accent w-10 h-10 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-headline font-bold">Quiz Complete!</h2>
            <p className="text-muted-foreground">You got {score} out of {quiz.length} questions correct.</p>
          </div>
          <div className="grid gap-4 text-left">
             {quiz.map((q, i) => (
               <div key={i} className={cn("p-4 rounded-2xl flex items-start gap-3", answers[i] === q.correctAnswer ? "bg-green-50" : "bg-red-50")}>
                  {answers[i] === q.correctAnswer ? <CheckCircle2 className="text-green-600 w-5 h-5 shrink-0 mt-0.5" /> : <XCircle className="text-red-600 w-5 h-5 shrink-0 mt-0.5" />}
                  <div>
                    <p className="font-bold text-sm mb-1">{q.question}</p>
                    <p className="text-xs opacity-70">Correct: {q.correctAnswer}</p>
                  </div>
               </div>
             ))}
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1 rounded-2xl h-12" onClick={reset}>Try Another Topic</Button>
            <Button className="flex-1 rounded-2xl h-12" onClick={() => { setCurrentStep(0); setAnswers({}); setShowResult(false); }}>Review Quiz</Button>
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
        <div className="mb-8 space-y-4">
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-primary uppercase tracking-widest">Question {currentStep + 1} of {quiz.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2 bg-primary/10" />
        </div>
        
        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 md:p-12 space-y-8">
          <h2 className="text-2xl md:text-3xl font-headline font-bold leading-tight">{q.question}</h2>
          <div className="grid gap-4">
            {q.options.map((option) => (
              <Button
                key={option}
                variant="outline"
                className={cn(
                  "h-auto py-5 px-8 justify-start text-left text-lg rounded-2xl border-2 hover:border-primary hover:bg-primary/5 transition-all",
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
    <div className="container max-w-4xl mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-[80vh] space-y-12">
      <div className="text-center space-y-4 max-w-2xl">
        <div className="inline-flex p-4 rounded-3xl bg-primary/10 text-primary mb-4 animate-bounce">
          <BrainCircuit className="w-12 h-12" />
        </div>
        <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight">AI Quiz Generator</h1>
        <p className="text-lg text-muted-foreground">Enter any subject or specific topic, and our AI will generate a tailored quiz to test your knowledge.</p>
      </div>

      <form onSubmit={handleGenerate} className="w-full max-w-xl relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
        <Card className="relative rounded-[2rem] border-none shadow-xl bg-white p-4">
          <div className="flex gap-2">
            <Input 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Organic Chemistry, French Revolution..." 
              className="flex-1 border-none bg-transparent h-14 text-lg focus-visible:ring-0 placeholder:text-muted-foreground/60"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              className="h-14 w-14 rounded-2xl shrink-0" 
              disabled={isLoading || !topic}
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
            </Button>
          </div>
        </Card>
      </form>

      <div className="flex gap-4 flex-wrap justify-center">
        {["History", "Quantum Physics", "Algebra", "Biology"].map(t => (
          <Button 
            key={t}
            variant="outline" 
            className="rounded-full bg-white px-6 border-primary/20 hover:border-primary transition-all"
            onClick={() => { setTopic(t); }}
          >
            {t}
          </Button>
        ))}
      </div>
    </div>
  )
}