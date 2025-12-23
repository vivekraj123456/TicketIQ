import { createClient } from "@/lib/supabase/server"
import { nanoid } from "nanoid"

export async function POST(request: Request) {
  try {
    const { subject, description, category, priority } = await request.json()

    // Validate input
    if (!subject || !description || !category) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()
    const ticketId = `TKT-${nanoid(8).toUpperCase()}`

    const { data, error } = await supabase
      .from("tickets")
      .insert([
        {
          ticket_id: ticketId,
          subject,
          description,
          category,
          priority,
          status: "open",
        },
      ])
      .select()
      .single()

    if (error) throw error

    return Response.json({ ticket_id: data.ticket_id }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating ticket:", error)
    return Response.json({ error: "Failed to create ticket" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100)

    if (error) throw error

    return Response.json(data || [])
  } catch (error) {
    console.error("[v0] Error fetching tickets:", error)
    return Response.json({ error: "Failed to fetch tickets" }, { status: 500 })
  }
}
