import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, subject, message } = body

    if (!email || !subject || !message) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Handle cookie setting errors
          }
        },
      },
    })

    const { error } = await supabase.from("support_messages").insert([
      {
        email,
        subject,
        message,
        created_at: new Date().toISOString(),
      },
    ])

    if (error) {
      console.error("Supabase error:", error)
      return Response.json({ error: "Failed to save support message" }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
