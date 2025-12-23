"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SupportDialog } from "./support-dialog"

export function Header() {
  const [supportOpen, setSupportOpen] = useState(false)

  return (
    <>
      <header className="border-b border-border bg-foreground/95 backdrop-blur supports-[backdrop-filter]:bg-foreground/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">T</span>
            </div>
            <span className="font-bold text-lg text-background">TicketFlow</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-background hover:text-background/80 transition-colors">
              Submit Ticket
            </Link>
            <Link href="/dashboard" className="text-background hover:text-background/80 transition-colors">
              Dashboard
            </Link>
            <Button
              variant="outline"
              className="border-background text-background hover:bg-background hover:text-foreground bg-transparent"
              onClick={() => setSupportOpen(true)}
            >
              Support
            </Button>
          </nav>
        </div>
      </header>

      <SupportDialog open={supportOpen} onOpenChange={setSupportOpen} />
    </>
  )
}
