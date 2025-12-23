"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, RefreshCw } from "lucide-react"

interface Ticket {
  id: number
  ticket_id: string
  subject: string
  description: string
  category: string
  priority: string
  status: string
  created_at: string
}

const CATEGORY_COLORS: Record<string, string> = {
  "bug-report": "bg-red-100 text-red-800",
  "feature-request": "bg-blue-100 text-blue-800",
  "technical-issue": "bg-yellow-100 text-yellow-800",
  billing: "bg-purple-100 text-purple-800",
  account: "bg-green-100 text-green-800",
}

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function AdminDashboard() {
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [error, setError] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const {
    data: tickets = [],
    isLoading,
    mutate,
  } = useSWR<Ticket[]>("/api/tickets", fetcher, {
    refreshInterval: 5000, // Poll every 5 seconds
    dedupingInterval: 2000,
  })

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    setIsUpdating(true)
    setError("")

    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update ticket")

      await mutate()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsUpdating(false)
    }
  }

  const filteredTickets = tickets.filter((ticket) => {
    if (filterStatus !== "all" && ticket.status !== filterStatus) return false
    if (filterCategory !== "all" && ticket.category !== filterCategory) return false
    return true
  })

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-foreground">Support Ticket Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live Updates
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Total Tickets</div>
            <div className="text-3xl font-bold text-foreground">{stats.total}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Open</div>
            <div className="text-3xl font-bold text-blue-600">{stats.open}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Resolved</div>
            <div className="text-3xl font-bold text-green-600">{stats.resolved}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">In Progress</div>
            <div className="text-3xl font-bold text-orange-600">{stats.inProgress}</div>
          </Card>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Filter by Status</label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Filter by Category</label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="bug-report">Bug Report</SelectItem>
                <SelectItem value="feature-request">Feature Request</SelectItem>
                <SelectItem value="technical-issue">Technical Issue</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="account">Account</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={() => mutate()} disabled={isUpdating} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh Now
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <Card className="p-4 mb-6 border-red-200 bg-red-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </Card>
      )}

      {isLoading ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Loading tickets...</p>
        </Card>
      ) : filteredTickets.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No tickets found</p>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-semibold text-foreground">Ticket ID</th>
                <th className="text-left p-4 font-semibold text-foreground">Subject</th>
                <th className="text-left p-4 font-semibold text-foreground">Category</th>
                <th className="text-left p-4 font-semibold text-foreground">Priority</th>
                <th className="text-left p-4 font-semibold text-foreground">Status</th>
                <th className="text-left p-4 font-semibold text-foreground">Created</th>
                <th className="text-left p-4 font-semibold text-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-4 font-mono text-sm text-muted-foreground">{ticket.ticket_id}</td>
                  <td className="p-4">
                    <div className="max-w-xs truncate" title={ticket.subject}>
                      {ticket.subject}
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={CATEGORY_COLORS[ticket.category] || "bg-gray-100 text-gray-800"}>
                      {ticket.category.replace("-", " ")}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge className={PRIORITY_COLORS[ticket.priority] || "bg-gray-100 text-gray-800"}>
                      {ticket.priority}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Select
                      value={ticket.status}
                      onValueChange={(val) => handleStatusChange(ticket.ticket_id, val)}
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        /* View details */
                      }}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
