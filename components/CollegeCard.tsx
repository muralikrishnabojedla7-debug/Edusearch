"use client"

import Link from "next/link"
import { MapPin, Star, GraduationCap, Scale, Plus, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrencyINR as formatCurrency, cn } from "@/lib/utils"
import { useCompareStore } from "@/lib/store"

interface CollegeCardProps {
  college: {
    id: string
    name: string
    shortName: string
    city: string
    state: string
    featured: boolean
    image: string
    rating: number
    annualFees: number
    placementPercent: number
    courses: { name: string }[]
  }
}

export function CollegeCard({ college }: CollegeCardProps) {
  const { isInCompare, addCollege, removeCollege, collegeIds } = useCompareStore()
  const inCompare = isInCompare(college.id)
  const isFull = collegeIds.length >= 3 && !inCompare

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (inCompare) {
      removeCollege(college.id)
    } else {
      addCollege(college.id)
    }
  }

  return (
    <Link href={`/colleges/${college.id}`} className="block group">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group-hover:border-primary/40">
        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
          <img
            src={college.image}
            alt={college.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
            {college.featured && (
              <Badge variant="default" className="shadow">Featured</Badge>
            )}
            <Badge variant="secondary" className="bg-white/90 backdrop-blur shadow-sm">
              <Star className="mr-1 h-3 w-3 fill-amber-400 text-amber-400" />
              {college.rating.toFixed(1)}
            </Badge>
          </div>
          <Button
            variant={inCompare ? "default" : "secondary"}
            size="icon"
            className="absolute top-3 right-3 h-9 w-9 rounded-full shadow-md backdrop-blur-sm bg-white/90 hover:bg-white"
            onClick={toggleCompare}
            disabled={isFull}
            asChild={false}
          >
            {inCompare ? (
              <Check className="h-4 w-4" />
            ) : (
              <Plus className={cn("h-4 w-4", isFull ? "text-muted-foreground" : "text-primary")} />
            )}
          </Button>
        </div>
        <CardContent className="p-5">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg leading-tight line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                {college.name}
              </h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{college.city}, {college.state}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-2 border-t border-dashed">
              <div className="flex items-center text-sm">
                <GraduationCap className="mr-1.5 h-4 w-4 text-primary/70" />
                <span className="font-medium">{formatCurrency(college.annualFees)}</span>
                <span className="text-muted-foreground ml-0.5 text-xs">/yr</span>
              </div>
              <div className="flex items-center text-sm ml-auto">
                <Scale className="mr-1.5 h-4 w-4 text-emerald-600/70" />
                <span className="font-medium text-emerald-700">{college.placementPercent}%</span>
                <span className="text-muted-foreground ml-0.5 text-xs">placed</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
