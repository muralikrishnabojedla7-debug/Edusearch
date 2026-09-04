"use client"

import { Scale, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCompareStore } from "@/lib/store"
import { cn } from "@/lib/utils"

interface AddToCompareButtonProps {
  collegeId: string
  variant?: "default" | "outline" | "secondary"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function AddToCompareButton({ collegeId, variant = "outline", size = "default", className }: AddToCompareButtonProps) {
  const { isInCompare, addCollege, removeCollege, collegeIds } = useCompareStore()
  const inCompare = isInCompare(collegeId)
  const isFull = collegeIds.length >= 3 && !inCompare

  const handleToggle = () => {
    if (inCompare) {
      removeCollege(collegeId)
    } else {
      addCollege(collegeId)
    }
  }

  return (
    <Button
      variant={inCompare ? "default" : variant}
      size={size}
      onClick={handleToggle}
      disabled={isFull}
      className={className}
      asChild={false}
    >
      {inCompare ? (
        <>
          <Check className={cn("mr-2", size === "lg" ? "h-5 w-5" : "h-4 w-4")} />
          Added to Compare
        </>
      ) : (
        <>
          <Plus className={cn("mr-2", size === "lg" ? "h-5 w-5" : "h-4 w-4")} />
          Add to Compare
          <Scale className={cn("ml-2 opacity-70", size === "lg" ? "h-5 w-5" : "h-4 w-4")} />
        </>
      )}
    </Button>
  )
}
