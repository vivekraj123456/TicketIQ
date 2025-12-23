import { TicketSubmissionForm } from "@/components/ticket-submission-form"
import { Header } from "@/components/header"

export const metadata = {
  title: "Support Ticket Auto-Triage",
  description: "Submit your support ticket for intelligent classification and routing",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-3">Submit a Support Ticket</h1>
            <p className="text-lg text-muted-foreground">
              Our intelligent system will automatically classify and route your ticket to the right team.
            </p>
          </div>
          <TicketSubmissionForm />
        </div>
      </div>
    </main>
  )
}
