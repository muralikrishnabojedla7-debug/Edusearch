"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { X, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { states } from "@/data/colleges"
import { cn } from "@/lib/utils"

interface FilterPanelProps {
  onClose?: () => void
  className?: string
}

export function FilterPanel({ onClose, className }: FilterPanelProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const state = searchParams.get("state") || undefined
  const minRating = Number(searchParams.get("minRating") || 0)
  const maxFees = Number(searchParams.get("maxFees") || 2500000)

  const updateParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    params.delete("page")
    router.push(`/colleges?${params.toString()}`)
  }

  const resetFilters = () => {
    const params = new URLSearchParams()
    const query = searchParams.get("query")
    if (query) params.set("query", query)
    router.push(`/colleges?${params.toString()}`)
  }

  const hasActiveFilters = state || minRating > 0 || maxFees < 2500000

  return (
    <div className={cn("flex h-full flex-col gap-6", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-xs">
              <RotateCcw className="mr-1 h-3 w-3" />
              Reset
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 md:hidden">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto pr-1">
        <div className="space-y-3">
          <Label>State</Label>
          <Select value={state || "all"} onValueChange={(val) => updateParams({ state: val === "all" ? undefined : val })}>
            <SelectTrigger>
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {states.map((s: string) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Minimum Rating</Label>
            <span className="text-sm font-medium text-primary">{minRating > 0 ? `${minRating}+ ★` : "Any"}</span>
          </div>
          <Slider
            value={[minRating]}
            min={0}
            max={10}
            step={0.5}
            onValueChange={(vals) => updateParams({ minRating: vals[0] > 0 ? String(vals[0]) : undefined })}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Maximum Fees</Label>
            <span className="text-sm font-medium text-primary">
              {maxFees >= 2500000 ? "No limit" : `₹${(maxFees / 100000).toFixed(0)}L`}
            </span>
          </div>
          <Slider
            value={[maxFees]}
            min={100000}
            max={2500000}
            step={50000}
            onValueChange={(vals) => updateParams({ maxFees: vals[0] < 2500000 ? String(vals[0]) : undefined })}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₹1L</span>
            <span>₹12L</span>
            <span>₹25L+</span>
          </div>
        </div>
      </div>
    </div>
  )
}
