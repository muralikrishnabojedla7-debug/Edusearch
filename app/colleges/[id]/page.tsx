import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  MapPin,
  Star,
  Calendar,
  Landmark,
  Award,
  Users,
  GraduationCap,
  Banknote,
  BookOpen,
  Scale,
  Building2,
  Library,
  BedDouble,
  Dumbbell,
  Utensils,
  Stethoscope,
  Bus,
  PlayCircle,
  Wrench,
  Lightbulb,
  Rocket,
  FlaskConical,
  Wifi,
  Home,
  Trophy,
  HeartPulse,
  Theater,
  Briefcase,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { AddToCompareButton } from "@/components/AddToCompareButton"
import { fetchCollegeById } from "@/lib/actions"
import { formatCurrencyINR as formatCurrency } from "@/lib/utils"
import type { Facility } from "@/types"
import { cn } from "@/lib/utils"

interface CollegeDetailPageProps {
  params: Promise<{ id: string }>
}

const FACILITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Central Library": Library,
  "Advanced Labs": FlaskConical,
  "WiFi Campus": Wifi,
  "Hostel Facilities": Home,
  "Sports Complex": Trophy,
  "Gymnasium": Dumbbell,
  "Cafeteria": Utensils,
  "Medical Center": HeartPulse,
  "Auditorium": Theater,
  "Transport": Bus,
  "Placement Cell": Briefcase,
  "Incubation Center": Rocket,
}

function getFacilityIcon(name: string) {
  return FACILITY_ICONS[name] || Building2
}

const STAT_ITEMS = [
  { key: "established", label: "Established", icon: Calendar },
  { key: "campusSize", label: "Campus Size", icon: Landmark },
  { key: "accredited", label: "Accredited", icon: Award },
  { key: "totalStudents", label: "Total Students", icon: Users },
  { key: "facultyCount", label: "Faculty Count", icon: GraduationCap },
] as const

type FlatCollege = Awaited<ReturnType<typeof fetchCollegeById>>

function getStatValue(college: NonNullable<FlatCollege>, key: string): string {
  switch (key) {
    case "established":
      return String(college.established)
    case "campusSize":
      return college.campusSize
    case "accredited":
      return college.accredited
    case "totalStudents":
      return college.totalStudents.toLocaleString()
    case "facultyCount":
      return college.facultyCount.toLocaleString()
    default:
      return "—"
  }
}

function Bar({ value, max, label, suffix = "" }: { value: number; max: number; label: string; suffix?: string }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span className="font-semibold">{typeof value === "number" && !Number.isInteger(value) ? value.toFixed(1) : value}{suffix}</span>
      </div>
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default async function CollegeDetailPage({ params }: CollegeDetailPageProps) {
  const { id } = await params
  const college = await fetchCollegeById(id)

  if (!college) {
    notFound()
  }

  const avgL = college.avgPackage / 100000
  const highestL = college.highestPackage / 100000

  return (
    <div className="container py-6 md:py-10">
      {/* Back Button */}
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="pl-0 hover:pl-0">
          <Link href="/colleges">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Colleges
          </Link>
        </Button>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border shadow-sm mb-8 bg-white dark:bg-slate-950">
        <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-br from-primary/30 via-primary/10 to-violet-400/20">
          <img
            src={college.image}
            alt={college.name}
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {college.featured && (
              <Badge variant="default" className="shadow-lg">
                <Star className="mr-1 h-3 w-3 fill-current" />
                Featured
              </Badge>
            )}
            <Badge variant="warning" className="shadow-lg">
              <Star className="mr-1 h-3 w-3 fill-amber-500 text-amber-500" />
              {college.rating.toFixed(1)} / 5 ({college.reviews.toLocaleString()} reviews)
            </Badge>
          </div>
        </div>
        <div className="p-5 sm:p-8 relative">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2 leading-tight">
                {college.name}
                <span className="ml-2 text-lg font-medium text-muted-foreground">({college.shortName})</span>
              </h1>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="mr-1.5 h-4 w-4 flex-shrink-0" />
                <span>{college.city}, {college.state}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 md:flex-col md:items-end md:gap-3">
              <AddToCompareButton collegeId={college.id} size="lg" />
            </div>
          </div>

          {/* Stats Overview Row */}
          <Separator className="my-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {STAT_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.key} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground mb-0.5">{item.label}</div>
                    <div className="font-semibold text-sm sm:text-base truncate">
                      {getStatValue(college, item.key)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white dark:bg-slate-950 rounded-2xl border shadow-sm p-5 sm:p-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full overflow-x-auto h-auto p-1 bg-muted rounded-xl whitespace-nowrap">
            <TabsTrigger value="overview" className="px-4 py-2">
              <BookOpen className="mr-2 h-4 w-4 inline" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="courses" className="px-4 py-2">
              <GraduationCap className="mr-2 h-4 w-4 inline" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="placements" className="px-4 py-2">
              <Scale className="mr-2 h-4 w-4 inline" />
              Placements
            </TabsTrigger>
            <TabsTrigger value="ratings" className="px-4 py-2">
              <Star className="mr-2 h-4 w-4 inline" />
              Ratings
            </TabsTrigger>
            <TabsTrigger value="facilities" className="px-4 py-2">
              <Building2 className="mr-2 h-4 w-4 inline" />
              Facilities
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="mt-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-3">About {college.shortName}</h2>
                  <p className="text-muted-foreground leading-relaxed">{college.description}</p>
                </div>
                <Separator />
                <div>
                  <h2 className="text-xl font-bold mb-5">Key Highlights</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-5 flex items-start gap-4">
                        <div className="h-11 w-11 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center flex-shrink-0">
                          <Banknote className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-0.5">Annual Fees</div>
                          <div className="font-bold text-lg">{formatCurrency(college.fees)}</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-5 flex items-start gap-4">
                        <div className="h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center flex-shrink-0">
                          <Scale className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-0.5">Placement Rate</div>
                          <div className="font-bold text-lg">{college.placementPercent}%</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-5 flex items-start gap-4">
                        <div className="h-11 w-11 rounded-xl bg-violet-50 dark:bg-violet-950 flex items-center justify-center flex-shrink-0">
                          <Award className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-0.5">Average Package</div>
                          <div className="font-bold text-lg">₹{avgL.toFixed(1)} LPA</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-5 flex items-start gap-4">
                        <div className="h-11 w-11 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center flex-shrink-0">
                          <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-0.5">Highest Package</div>
                          <div className="font-bold text-lg">₹{highestL.toFixed(1)} LPA</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-lg">Full Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: "Established", value: `${college.established}` },
                      { label: "Campus Area", value: college.campusSize },
                      { label: "Accreditation", value: college.accredited },
                      { label: "Total Students", value: college.totalStudents.toLocaleString() },
                      { label: "Faculty Members", value: college.facultyCount.toLocaleString() },
                      { label: "Courses Offered", value: `${college.courses.length} Programs` },
                      { label: "Facilities", value: `${college.facilities.length} Amenities` },
                      { label: "Student Reviews", value: `${college.reviews.toLocaleString()}` },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                          <span className="text-sm font-semibold">{item.value}</span>
                        </div>
                        {i < 7 && <Separator className="mt-3" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* COURSES TAB */}
          <TabsContent value="courses" className="mt-8">
            <h2 className="text-xl font-bold mb-5">Courses Offered ({college.courses.length})</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {college.courses.map((course) => (
                <Card key={course.id} className="overflow-hidden group hover:border-primary/30 transition-all">
                  <CardContent className="p-0">
                    <div className="p-5 sm:p-6">
                      <div className="mb-3">
                        <Badge variant="secondary" className="mb-2">
                          {course.eligibility}
                        </Badge>
                        <h3 className="font-semibold text-lg leading-tight">{course.name}</h3>
                      </div>
                      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-dashed">
                        <div>
                          <div className="text-xs text-muted-foreground mb-0.5">Duration</div>
                          <div className="font-semibold text-sm">{course.duration}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-0.5">Fees</div>
                          <div className="font-semibold text-sm text-primary">{formatCurrency(course.fees)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-0.5">Seats</div>
                          <div className="font-semibold text-sm">{course.seats}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* PLACEMENTS TAB */}
          <TabsContent value="placements" className="mt-8">
            <div className="grid md:grid-cols-3 gap-5 mb-8">
              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/50 dark:to-emerald-900/30 border-emerald-200 dark:border-emerald-800">
                <CardContent className="p-6">
                  <div className="text-sm text-emerald-700 dark:text-emerald-400 font-medium mb-1">Placement Rate</div>
                  <div className="text-4xl font-bold text-emerald-700 dark:text-emerald-400">{college.placementPercent}%</div>
                  <div className="text-xs text-emerald-600/80 dark:text-emerald-500/80 mt-1">Overall placement</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6">
                  <div className="text-sm text-blue-700 dark:text-blue-400 font-medium mb-1">Average Package</div>
                  <div className="text-4xl font-bold text-blue-700 dark:text-blue-400">₹{avgL.toFixed(1)}L</div>
                  <div className="text-xs text-blue-600/80 dark:text-blue-500/80 mt-1">Per annum (LPA)</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/50 dark:to-amber-900/30 border-amber-200 dark:border-amber-800">
                <CardContent className="p-6">
                  <div className="text-sm text-amber-700 dark:text-amber-400 font-medium mb-1">Highest Package</div>
                  <div className="text-4xl font-bold text-amber-700 dark:text-amber-400">₹{highestL.toFixed(1)}L</div>
                  <div className="text-xs text-amber-600/80 dark:text-amber-500/80 mt-1">Per annum (LPA)</div>
                </CardContent>
              </Card>
            </div>

            {/* Year-wise Trend */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg">Placement Trend (Year-wise)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {college.placementYears.map((year) => (
                    <div key={year.year} className="p-4 rounded-xl bg-muted/40 border">
                      <div className="text-lg font-bold mb-3">{year.year}</div>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Placement</span>
                            <span className="font-semibold text-foreground">{year.percentage}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                              style={{ width: `${year.percentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="pt-2 border-t flex justify-between text-xs">
                          <div>
                            <div className="text-muted-foreground">Avg</div>
                            <div className="font-semibold text-sm">₹{(year.avgPackage / 100000).toFixed(1)}L</div>
                          </div>
                          <div className="text-right">
                            <div className="text-muted-foreground">Highest</div>
                            <div className="font-semibold text-sm text-amber-600 dark:text-amber-400">₹{(year.highestPackage / 100000).toFixed(1)}L</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Avg vs Highest bars */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg">Package Comparison (Latest Year)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Bar
                  value={avgL}
                  max={100}
                  label="Average Package (LPA)"
                  suffix=" L"
                />
                <Bar
                  value={highestL}
                  max={100}
                  label="Highest Package (LPA)"
                  suffix=" L"
                />
                <Bar
                  value={college.placementPercent}
                  max={100}
                  label="Placement Percentage"
                  suffix="%"
                />
              </CardContent>
            </Card>

            {/* Top Recruiters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Recruiters ({college.recruiters.length} companies)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {college.recruiters.map((company) => (
                    <div
                      key={company}
                      className="px-4 py-2.5 bg-muted/60 rounded-lg border text-sm font-medium hover:bg-muted hover:border-primary/30 transition-all"
                    >
                      {company}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* RATINGS TAB */}
          <TabsContent value="ratings" className="mt-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div>
                <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-violet-50 dark:from-primary/10 dark:to-violet-950/50 border-primary/20">
                  <CardContent className="p-8 text-center">
                    <div className="text-sm font-medium text-muted-foreground mb-2">Overall Rating</div>
                    <div className="text-7xl font-bold bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent mb-2">
                      {college.rating.toFixed(1)}
                    </div>
                    <div className="flex justify-center gap-0.5 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-6 w-6 transition-colors",
                            i < Math.round(college.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/20"
                          )}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Based on {college.reviews.toLocaleString()} student reviews
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-2 space-y-8">
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h3 className="font-semibold mb-5">Category-wise Ratings</h3>
                      <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                        <Bar value={college.ratings.academics} max={5} label="Academics" />
                        <Bar value={college.ratings.infrastructure} max={5} label="Infrastructure" />
                        <Bar value={college.ratings.placements} max={5} label="Placements" />
                        <Bar value={college.ratings.faculty} max={5} label="Faculty" />
                      </div>
                    </div>
                    <Separator />
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: "Academics", val: college.ratings.academics, color: "text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400" },
                        { label: "Infrastructure", val: college.ratings.infrastructure, color: "text-violet-600 bg-violet-50 dark:bg-violet-950 dark:text-violet-400" },
                        { label: "Placements", val: college.ratings.placements, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400" },
                        { label: "Faculty", val: college.ratings.faculty, color: "text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400" },
                      ].map((item, i) => (
                        <div key={i} className={`p-4 rounded-xl ${item.color} text-center`}>
                          <div className={`text-3xl font-bold`}>
                            {item.val.toFixed(1)}
                          </div>
                          <div className="text-xs font-medium mt-1 opacity-80">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* FACILITIES TAB */}
          <TabsContent value="facilities" className="mt-8">
            <h2 className="text-xl font-bold mb-5">
              Campus Facilities & Amenities ({college.facilities.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {college.facilities.map((facility: Facility) => {
                const Icon = getFacilityIcon(facility.name)
                return (
                  <div
                    key={facility.id}
                    className="group flex flex-col items-center justify-center text-center p-5 rounded-xl border bg-white dark:bg-slate-950 hover:bg-primary/5 hover:border-primary/30 transition-all"
                  >
                    <div className="h-14 w-14 rounded-2xl bg-muted group-hover:bg-primary/10 flex items-center justify-center mb-3 transition-colors">
                      <Icon className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="text-sm font-medium leading-tight">{facility.name}</div>
                  </div>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
