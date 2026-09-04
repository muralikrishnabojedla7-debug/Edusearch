import { NextResponse } from "next/server"
import { getColleges } from "@/lib/actions"
import type { CollegeFilters, SortOption } from "@/types"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const q = searchParams.get("query") || searchParams.get("search")
  const state = searchParams.get("state")

  const filters: Partial<CollegeFilters> = {
    search: q || undefined,
    state: state ? [state] : undefined,
    city: searchParams.get("city") ? [searchParams.get("city") as string] : undefined,
    course: searchParams.get("course") ? [searchParams.get("course") as string] : undefined,
    minRating: searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined,
    maxRating: searchParams.get("maxRating") ? Number(searchParams.get("maxRating")) : undefined,
    minFees: searchParams.get("minFees") ? Number(searchParams.get("minFees")) : undefined,
    maxFees: searchParams.get("maxFees") ? Number(searchParams.get("maxFees")) : undefined,
    minPlacement: searchParams.get("minPlacement")
      ? Number(searchParams.get("minPlacement"))
      : undefined,
  }

  const sort = (searchParams.get("sort") as SortOption) || "rating-desc"
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1
  const pageSize = searchParams.get("limit") ? Number(searchParams.get("limit")) : 12

  try {
    const result = await getColleges({ filters, sort, page, pageSize, delayMs: 0 })
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error"
    return NextResponse.json(
      {
        success: false,
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
        message,
      },
      { status: 500 }
    )
  }
}
