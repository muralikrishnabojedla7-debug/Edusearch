import { Suspense } from "react"
import Link from "next/link"
import { Filter, SearchX, Grid3X3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SearchBar } from "@/components/SearchBar"
import { CollegeCard } from "@/components/CollegeCard"
import { FilterPanel } from "@/components/FilterPanel"
import { PaginationControls } from "@/components/PaginationControls"
import { SortSelect } from "@/components/SortSelect"
import { fetchColleges } from "@/lib/actions"
import type { SortOption } from "@/types";

interface CollegesPageProps {
  searchParams: Promise<{
    query?: string
    state?: string
    minRating?: string
    maxFees?: string
    sort?: SortOption
    page?: string
  }>
}

const SORT_OPTIONS: { value: SortOption | "default"; label: string }[] = [
  { value: "rating-desc", label: "Rating: High → Low" },
  { value: "rating-asc", label: "Rating: Low → High" },
  { value: "name-asc", label: "Name: A → Z" },
  { value: "name-desc", label: "Name: Z → A" },
  { value: "fees-asc", label: "Fees: Low → High" },
  { value: "fees-desc", label: "Fees: High → Low" },
  { value: "placement-desc", label: "Placement: High → Low" },
]

function CollegeCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <Skeleton className="h-40 w-full rounded-none" />
      <CardContent className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="pt-2 border-t border-dashed flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  )
}

async function CollegesContent({ params }: { params: Awaited<CollegesPageProps["searchParams"]> }) {
  const query = params.query
  const state = params.state
  const minRating = params.minRating ? Number(params.minRating) : undefined
  const maxFees = params.maxFees ? Number(params.maxFees) : undefined
  const sort = (params.sort as SortOption) || "rating-desc"
  const page = params.page ? Number(params.page) : 1

  const result = await fetchColleges({
    query,
    state,
    minRating,
    maxFees,
    sort,
    page,
    limit: 12,
  })

  const ActiveFilters = () => {
    const filters: { label: string }[] = []
    if (state) filters.push({ label: `State: ${state}` })
    if (minRating !== undefined) filters.push({ label: `Min Rating: ${minRating}+ ★` })
    if (maxFees !== undefined) filters.push({ label: `Max Fees: ₹${(maxFees / 100000).toFixed(0)}L` })
    if (filters.length === 0) return null
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {filters.map((f, i) => (
          <Badge key={i} variant="secondary" className="px-3 py-1">
            {f.label}
          </Badge>
        ))}
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg font-semibold">
            {result.total.toLocaleString()} {result.total === 1 ? "college" : "colleges"} found
            {query && <span className="text-muted-foreground font-normal"> for &quot;{query}&quot;</span>}
          </h2>
          <ActiveFilters />
        </div>
        <SortSelect initialValue={sort} />
      </div>

      {result.colleges.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-5">
              <SearchX className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No colleges found</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Try adjusting your search or filters to find colleges that match your criteria.
            </p>
            <Button asChild>
              <Link href="/colleges">Clear All Filters</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.colleges.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
          <PaginationControls
            totalPages={result.totalPages}
            currentPage={result.page}
            className="mt-10"
          />
        </>
      )}
    </div>
  )
}

export default async function CollegesPage({ searchParams }: CollegesPageProps) {
  const params = await searchParams
  const sort = (params.sort as SortOption) || "rating-desc"

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <Grid3X3 className="h-8 w-8 text-primary" />
          Browse Colleges
        </h1>
        <p className="text-muted-foreground">
          Explore and filter colleges across India using advanced filters and sorting options.
        </p>
      </div>

      <div className="mb-6">
        <SearchBar redirectOnSubmit={false} />
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 border rounded-xl p-5 bg-white shadow-sm max-h-[calc(100vh-120px)] overflow-y-auto">
            <FilterPanel />
          </div>
        </aside>

        {/* Mobile Filter + Content */}
        <div className="min-w-0">
          <div className="flex lg:hidden mb-4 gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[90%] max-w-sm p-0">
                <div className="p-6 h-full flex flex-col">
                  <SheetHeader className="mb-6">
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto -mx-6 px-6">
                    <FilterPanel />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Suspense
            key={`${params.query || ""}-${params.state || ""}-${params.minRating || ""}-${params.maxFees || ""}-${sort}-${params.page || "1"}`}
            fallback={
              <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                  <Skeleton className="h-6 w-64" />
                  <Skeleton className="h-10 w-[220px]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <CollegeCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            }
          >
            <CollegesContent params={params} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
