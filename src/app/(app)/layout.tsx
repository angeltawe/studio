import { Navigation } from "@/components/navigation"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background pb-16 md:pb-0">
      <Navigation />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}