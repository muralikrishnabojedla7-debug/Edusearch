import { NextResponse } from "next/server"
import { getCollegeById } from "@/lib/actions"

export const dynamic = "force-dynamic"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const result = await getCollegeById(id, 0)
    if (!result.success || !result.data) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: result.message || "College not found",
        },
        { status: 404 }
      )
    }
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error"
    return NextResponse.json(
      {
        success: false,
        data: null,
        message,
      },
      { status: 500 }
    )
  }
}
