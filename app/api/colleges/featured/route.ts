import { NextResponse } from "next/server"
import { getColleges, getFeaturedColleges } from "@/lib/actions"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 6

  try {
    const all = await getColleges({
      filters: { featuredOnly: true },
      sort: "rating-desc",
      page: 1,
      pageSize: limit,
      delayMs: 0,
    })
    return NextResponse.json(all)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error"
    return NextResponse.json(
      {
        success: false,
        data: [],
        message,
      },
      { status: 500 }
    )
  }
}
