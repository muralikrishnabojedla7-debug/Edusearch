"use client"

import { useState, useMemo } from "react"
import { Plus, Search, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { College } from "@/data/colleges"
import { colleges } from "@/data/colleges"
import { formatCurrencyINR as formatCurrency } from "@/lib/utils"
import { useCompareStore } from "@/lib/store"
import { cn } from "@/lib/utils"

interface AddCollegeDialogProps {
  triggerVariant?: "default" | "outline" | "secondary"
}

export function AddCollegeDialog({ triggerVariant = "default" }: AddCollegeDialogProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const { addCollege, isInCompare, collegeIds } = useCompareStore()
  const isFull = collegeIds.length >= 3

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return colleges.slice(0, 30)
    return colleges
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.shortName.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.state.toLowerCase().includes(q)
      )
      .slice(0, 30)
  }, [search])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} size="lg" disabled={isFull}>
          <Plus className="mr-2 h-5 w-5" />
          {isFull ? "Compare is full (3 max)" : "Add Colleges to Compare"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-3">
          <DialogTitle>Add Colleges to Compare</DialogTitle>
          <DialogDescription>
            Search and select up to 3 colleges to compare side by side.
            {collegeIds.length > 0 && (
              <span className="ml-1 text-primary">({collegeIds.length}/3 selected)</span>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, city, state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <ScrollArea className="flex-1 px-6 pb-3 max-h-[50vh]">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No colleges found matching your search.
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((college: College) => {
                const added = isInCompare(college.id)
                const disabled = !added && isFull
                return (
                  <button
                    key={college.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      if (added) return
                      addCollege(college.id)
                      if (collegeIds.length + 1 >= 3) {
                        setTimeout(() => setOpen(false), 300)
                      }
                    }}
                    className={cn(
                      "w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all",
                      added
                        ? "border-primary bg-primary/5"
                        : disabled
                        ? "opacity-50 cursor-not-allowed border-border"
                        : "hover:border-primary/40 hover:bg-muted/40 border-border"
                    )}
                  >
                    <div className="h-12 w-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                      <img src={college.image} alt={college.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm leading-tight line-clamp-1">{college.name}</h4>
                        {added && (
                          <Badge variant="default" className="shrink-0">
                            <Check className="mr-1 h-3 w-3" /> Added
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {college.city}, {college.state}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs">
                        <span className="text-amber-600 font-medium">★ {college.rating.overall.toFixed(1)}</span>
                        <span className="text-muted-foreground">{formatCurrency(college.annualFees)}</span>
                        <span className="text-emerald-600 font-medium">{college.placement.overallPercentage}% placed</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </ScrollArea>
        <DialogFooter className="p-6 pt-3 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
