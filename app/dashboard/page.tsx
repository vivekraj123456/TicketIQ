import { AdminDashboard } from "@/components/admin-dashboard"
import { Header } from "@/components/header"

export const metadata = {
  title: "Support Ticket Dashboard",
  description: "View and manage support tickets",
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <AdminDashboard />
    </main>
  )
}
