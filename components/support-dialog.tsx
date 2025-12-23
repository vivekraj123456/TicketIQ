"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

interface SupportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SupportDialog({ open, onOpenChange }: SupportDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to send support request")
      }

      setSuccess(true)
      setFormData({ email: "", subject: "", message: "" })

      setTimeout(() => {
        setSuccess(false)
        onOpenChange(false)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contact Support</DialogTitle>
          <DialogDescription>
            Have a question or need assistance? Send us a message and we'll get back to you shortly.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
            <p className="text-center font-medium text-foreground">Thank you!</p>
            <p className="text-center text-sm text-muted-foreground">
              We've received your message and will respond shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <Input
                type="email"
                required
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
              <Input
                type="text"
                required
                placeholder="What do you need help with?"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
              <Textarea
                required
                placeholder="Tell us more..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full h-24"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
