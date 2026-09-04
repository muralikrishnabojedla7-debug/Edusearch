"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { SortOption } from "@/types"

const SORT_OPTIONS: { value: SortOption | "default"; label: string }[] = [
  { value: "rating-desc", label: "Rating: High → Low" },
  { value: "rating-asc", label: "Rating: Low → High" },
  { value: "name-asc", label: "Name: A → Z" },
  { value: "name-desc", label: "Name: Z → A" },
  { value: "fees-asc", label: "Fees: Low → High" },
  { value: "fees-desc", label: "Fees: High → Low" },
  { value: "placement-desc", label: "Placement: High → Low" },
]

export function SortSelect({ initialValue }: { initialValue: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const onSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "default") {
      params.set("sort", value)
    } else {
      params.delete("sort")
    }
    params.delete("page")
    router.push(`/colleges?${params.toString()}`)
  }

  return (
    <Select defaultValue={initialValue} onValueChange={onSortChange}>
      <SelectTrigger className="w-full sm:w-[220px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
