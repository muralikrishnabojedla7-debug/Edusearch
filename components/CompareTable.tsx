"use client"

import { X, MapPin, Star, GraduationCap, Scale, Building2, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { College } from "@/data/colleges"
import { formatCurrencyINR as formatCurrency } from "@/lib/utils"
import { useCompareStore } from "@/lib/store"

interface CompareTableProps {
  colleges: College[]
}

const ROWS = [
  { key: "location", label: "Location", icon: MapPin },
  { key: "rating", label: "Rating", icon: Star },
  { key: "reviews", label: "Reviews", icon: Users },
  { key: "fees", label: "Annual Fees", icon: GraduationCap },
  { key: "placement", label: "Placement %", icon: Scale },
  { key: "avgPackage", label: "Avg Package", icon: Award },
  { key: "highestPackage", label: "Highest Package", icon: Award },
  { key: "established", label: "Established", icon: Building2 },
  { key: "campusSize", label: "Campus Size", icon: MapPin },
  { key: "students", label: "Total Students", icon: Users },
  { key: "faculty", label: "Faculty Count", icon: Users },
  { key: "courses", label: "Courses Offered", icon: GraduationCap },
  { key: "facilities", label: "Top Facilities", icon: Award },
  { key: "accredited", label: "Accreditation", icon: Award },
] as const

export function CompareTable({ colleges }: CompareTableProps) {
  const { removeCollege } = useCompareStore()

  const computeTotalStudents = (c: College): number =>
    c.courses.reduce((sum, co) => sum + co.seats, 0) * 4

  const getValue = (college: College, key: string): React.ReactNode => {
    switch (key) {
      case "location": return `${college.city}, ${college.state}`
      case "rating":
        return (
          <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {college.rating.overall.toFixed(1)}/10
          </span>
        )
      case "reviews": return `${college.rating.reviewsCount.toLocaleString()} reviews`
      case "fees": return `${formatCurrency(college.annualFees)}/yr`
      case "placement": return <span className="font-semibold text-emerald-600">{college.placement.overallPercentage}%</span>
      case "avgPackage": return `₹${(college.placement.averagePackage / 100000).toFixed(1)} LPA`
      case "highestPackage": return `₹${(college.placement.highestPackage / 100000).toFixed(1)} LPA`
      case "established": return `Est. ${college.establishedYear}`
      case "campusSize": return college.campusSize
      case "students": return computeTotalStudents(college).toLocaleString()
      case "faculty": return Math.round(college.courses.length * 8)
      case "courses": return college.courses.map(c => c.name).join(", ")
      case "facilities": return college.facilities.map(f => f.name).slice(0, 5).join(", ")
      case "accredited":
        return <Badge variant="secondary">{college.accredited}</Badge>
      default: return "—"
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-white dark:bg-slate-950 shadow-sm">
      <table className="w-full border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="sticky left-0 z-10 bg-muted/50 w-48 p-4 text-left text-sm font-semibold text-muted-foreground border-r">
              Attribute
            </th>
            {colleges.map((college) => (
              <th key={college.id} className="p-4 text-left align-top min-w-[280px]">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="h-24 w-full overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 mb-3">
                      <img src={college.image} alt={college.name} className="h-full w-full object-cover" />
                    </div>
                    <h3 className="font-semibold leading-tight">{college.name}</h3>
                    {college.featured && (
                      <Badge variant="default" className="mt-2">Featured</Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCollege(college.id)}
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </th>
            ))}
            {colleges.length < 3 && (
              <th className="p-4 text-center min-w-[280px] text-muted-foreground font-normal">
                <div className="h-full flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-xl border-border">
                  <span className="text-sm">Add a college to compare</span>
                </div>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => {
            const Icon = row.icon
            return (
              <tr key={row.key} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                <td className="sticky left-0 z-10 bg-background p-4 border-r text-sm font-medium">
                  <span className="inline-flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {row.label}
                  </span>
                </td>
                {colleges.map((college) => (
                  <td key={college.id} className="p-4 text-sm align-top">
                    {getValue(college, row.key)}
                  </td>
                ))}
                {colleges.length < 3 && <td className="p-4"></td>}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
