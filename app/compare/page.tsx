"use client"

import Link from "next/link"
import { ArrowLeft, Scale, SearchX, Trash2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddCollegeDialog } from "@/components/AddCollegeDialog"
import { CompareTable } from "@/components/CompareTable"
import { useCompareStore } from "@/lib/store"

export default function ComparePage() {
  const { collegeIds, getColleges, clearAll } = useCompareStore()
  const colleges = getColleges()

  return (
    <div className="container py-6 md:py-10">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="pl-0 hover:pl-0 mb-4">
          <Link href="/colleges">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Colleges
          </Link>
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
              <Scale className="h-8 w-8 text-primary" />
              Compare Colleges
            </h1>
            <p className="text-muted-foreground mt-2">
              Compare up to 3 colleges side by side on fees, placements, facilities, and more.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1.5 text-sm">
              {colleges.length} / 3 selected
            </Badge>
            {colleges.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearAll}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
            )}
          </div>
        </div>
      </div>

      {colleges.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/10 to-violet-100/50 flex items-center justify-center mb-6">
              <Scale className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">No colleges to compare</h2>
            <p className="text-muted-foreground max-w-md mb-8">
              Add colleges from listing or search below to start comparing them
              side-by-side on metrics that matter most.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <AddCollegeDialog triggerVariant="default" />
              <Button asChild variant="outline">
                <Link href="/colleges">
                  <SearchX className="mr-2 h-4 w-4" />
                  Browse Colleges
                </Link>
              </Button>
            </div>
            <div className="mt-10 p-4 rounded-xl bg-muted/50 text-left max-w-md w-full text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-foreground mb-1">Tips for comparing</div>
                  <ul className="space-y-1 text-xs list-disc pl-4">
                    <li>Click the + button on any college card to add it here</li>
                    <li>Maximum 3 colleges can be compared at a time</li>
                    <li>Compare placements, fees, and facilities to make the right choice</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <AddCollegeDialog triggerVariant={colleges.length < 3 ? "default" : "secondary"} />
          <div className="text-sm text-muted-foreground">
            {colleges.length === 1
              ? "Add 2 more colleges for a side-by-side comparison"
              : colleges.length === 2
              ? "You can add 1 more college to compare"
              : "Compare is full (3 colleges maximum)"}
          </div>
        </div>
        <CompareTable colleges={colleges} />
        </div>
      )}
    </div>
  )
}
