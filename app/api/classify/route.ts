// The rule-based system provides reliable categorization without external API calls

export async function POST(request: Request) {
  try {
    const { subject, description } = await request.json()

    if (!subject || !description) {
      return Response.json({ error: "Subject and description are required" }, { status: 400 })
    }

    // Rule-based classification that doesn't require AI credits
    const text = `${subject} ${description}`.toLowerCase()

    // Keywords for each category
    const bugKeywords = ["bug", "error", "crash", "broken", "issue", "not working", "failed", "problem", "exception"]
    const featureKeywords = ["feature", "request", "suggest", "enhancement", "add", "would like", "new", "wish"]
    const techKeywords = [
      "help",
      "how",
      "guide",
      "troubleshoot",
      "configure",
      "setup",
      "install",
      "tutorial",
      "documentation",
    ]
    const billingKeywords = [
      "invoice",
      "billing",
      "payment",
      "charge",
      "subscription",
      "refund",
      "cost",
      "price",
      "fee",
    ]
    const accountKeywords = [
      "login",
      "password",
      "account",
      "access",
      "profile",
      "username",
      "authentication",
      "sign in",
    ]

    let category = "technical-issue"
    const matchCount = 0

    // Count keyword matches for each category
    const bugMatches = bugKeywords.filter((kw) => text.includes(kw)).length
    const featureMatches = featureKeywords.filter((kw) => text.includes(kw)).length
    const techMatches = techKeywords.filter((kw) => text.includes(kw)).length
    const billingMatches = billingKeywords.filter((kw) => text.includes(kw)).length
    const accountMatches = accountKeywords.filter((kw) => text.includes(kw)).length

    // Determine category based on highest match count
    const matches = [
      { category: "bug-report", count: bugMatches },
      { category: "feature-request", count: featureMatches },
      { category: "technical-issue", count: techMatches },
      { category: "billing", count: billingMatches },
      { category: "account", count: accountMatches },
    ]

    const topMatch = matches.reduce((prev, current) => (prev.count > current.count ? prev : current))

    category = topMatch.count > 0 ? topMatch.category : "technical-issue"

    // Priority assignment based on keywords
    let priority = "medium"
    const criticalKeywords = [
      "urgent",
      "critical",
      "blocked",
      "blocking",
      "cannot",
      "unable",
      "broke",
      "down",
      "emergency",
    ]
    const highKeywords = ["important", "asap", "need", "required", "immediate"]
    const lowKeywords = ["minor", "small", "tiny", "cosmetic", "suggestion", "later"]

    const criticalMatches = criticalKeywords.filter((kw) => text.includes(kw)).length
    const highMatches = highKeywords.filter((kw) => text.includes(kw)).length
    const lowMatches = lowKeywords.filter((kw) => text.includes(kw)).length

    if (criticalMatches > 0) {
      priority = "critical"
    } else if (highMatches > 1) {
      priority = "high"
    } else if (lowMatches > 1) {
      priority = "low"
    }

    const confidence = Math.min(0.95, 0.6 + topMatch.count * 0.1)

    const reasoning = `Based on content analysis: detected keywords related to ${category.replace("-", " ")} with ${priority} priority.`

    return Response.json({
      category,
      priority,
      confidence,
      reasoning,
    })
  } catch (error) {
    console.error("[v0] Classification error:", error)
    return Response.json(
      {
        error: "Failed to classify ticket",
        category: "technical-issue",
        priority: "medium",
        confidence: 0.5,
        reasoning: "Using default classification due to error",
      },
      { status: 500 },
    )
  }
}
