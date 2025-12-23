import { createClient } from "@/lib/supabase/server"

export async function PATCH(request: Request, { params }: { params: { ticketId: string } }) {
  try {
    const { status } = await request.json()

    if (!status) {
      return Response.json({ error: "Status is required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("tickets")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("ticket_id", params.ticketId)
      .select()
      .single()

    if (error) throw error

    return Response.json(data)
  } catch (error) {
    console.error("[v0] Error updating ticket:", error)
    return Response.json({ error: "Failed to update ticket" }, { status: 500 })
  }
}
