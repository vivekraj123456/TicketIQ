"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle2, Loader2, Lightbulb } from "lucide-react"

const CATEGORIES = [
  { value: "bug-report", label: "Bug Report", description: "Report a software defect or error" },
  { value: "feature-request", label: "Feature Request", description: "Suggest a new feature or enhancement" },
  { value: "technical-issue", label: "Technical Issue", description: "Need technical assistance" },
  { value: "billing", label: "Billing Inquiry", description: "Questions about invoices or payments" },
  { value: "account", label: "Account Management", description: "Account or access issues" },
]

const PRIORITIES = [
  { value: "low", label: "Low - Can wait" },
  { value: "medium", label: "Medium - Standard" },
  { value: "high", label: "High - Urgent" },
  { value: "critical", label: "Critical - Blocking" },
]

export function TicketSubmissionForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isClassifying, setIsClassifying] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [ticketId, setTicketId] = useState("")
  const [suggestedClassification, setSuggestedClassification] = useState<{
    category: string
    priority: string
    confidence: number
    reasoning: string
  } | null>(null)
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "",
    priority: "medium",
  })

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, description: e.target.value })

    // Clear previous suggestion if user is editing
    if (suggestedClassification) {
      setSuggestedClassification(null)
    }
  }

  const classifyTicket = async () => {
    if (!formData.subject || !formData.description) {
      setError("Please fill in subject and description first")
      return
    }

    setIsClassifying(true)
    setError("")

    try {
      const response = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: formData.subject,
          description: formData.description,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to classify ticket")
      }

      const data = await response.json()
      setSuggestedClassification(data)

      // Auto-fill category and priority
      setFormData({
        ...formData,
        category: data.category,
        priority: data.priority,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Classification failed")
    } finally {
      setIsClassifying(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to submit ticket")
      }

      const data = await response.json()
      setTicketId(data.ticket_id)
      setSuccess(true)
      setFormData({ subject: "", description: "", category: "", priority: "medium" })
      setSuggestedClassification(null)

      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="p-6 border-green-200 bg-green-50">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-900 mb-1">Ticket Submitted Successfully</h3>
            <p className="text-sm text-green-800 mb-3">
              Your ticket has been automatically classified and will be routed to the appropriate team.
            </p>
            <p className="text-sm font-mono text-green-700 bg-white px-3 py-2 rounded border border-green-200">
              ID: {ticketId}
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {suggestedClassification && (
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 mb-1">AI Classification</p>
              <p className="text-sm text-blue-800 mb-2">{suggestedClassification.reasoning}</p>
              <div className="flex items-center gap-2 text-xs text-blue-700">
                <span>Confidence: {(suggestedClassification.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
          <Input
            type="text"
            required
            placeholder="Brief summary of your issue"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Description</label>
          <Textarea
            required
            placeholder="Provide detailed information about your issue..."
            value={formData.description}
            onChange={handleDescriptionChange}
            className="w-full h-32"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={classifyTicket}
            disabled={isClassifying || !formData.subject || !formData.description}
            className="mt-3 bg-transparent"
          >
            {isClassifying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Classifying...
              </>
            ) : (
              <>
                <Lightbulb className="w-4 h-4 mr-2" />
                Get AI Suggestion
              </>
            )}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Category</label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex flex-col">
                      <span>{cat.label}</span>
                      <span className="text-xs text-muted-foreground">{cat.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((pri) => (
                  <SelectItem key={pri.value} value={pri.value}>
                    {pri.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Submitting..." : "Submit Ticket"}
        </Button>
      </form>
    </Card>
  )
}
