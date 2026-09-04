"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  className?: string
  size?: "default" | "lg"
  initialValue?: string
  redirectOnSubmit?: boolean
}

export function SearchBar({ className, size = "default", initialValue = "", redirectOnSubmit = true }: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialValue || searchParams.get("query") || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query) {
      params.set("query", query)
    } else {
      params.delete("query")
    }
    params.delete("page")
    if (redirectOnSubmit) {
      router.push(`/colleges?${params.toString()}`)
    } else {
      router.replace(`/colleges?${params.toString()}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative flex w-full gap-2", className)}>
      <div className="relative flex-1">
        <Search className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none",
          size === "lg" ? "h-6 w-6" : "h-5 w-5"
        )} />
        <Input
          type="search"
          placeholder="Search colleges, courses, cities..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={cn(
            size === "lg" ? "h-16 pl-14 pr-4 text-base rounded-xl shadow-lg" : "pl-12"
          )}
        />
      </div>
      <Button
        type="submit"
        size={size === "lg" ? "lg" : "default"}
        className={cn(size === "lg" && "px-8 text-base shadow-lg")}
      >
        <Search className={cn("mr-2", size === "lg" ? "h-5 w-5" : "h-4 w-4")} />
        Search
      </Button>
    </form>
  )
}
