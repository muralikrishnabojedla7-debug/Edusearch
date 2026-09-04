import Link from "next/link"
import {
  GraduationCap,
  Search as SearchIcon,
  CheckCircle2,
  ShieldCheck,
  GitCompare,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SearchBar } from "@/components/SearchBar"
import { CollegeCard } from "@/components/CollegeCard"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchFeaturedColleges } from "@/lib/actions"

const FEATURES = [
  {
    icon: SearchIcon,
    title: "Advanced Filters",
    desc: "Narrow down colleges by state, fees, rating, courses, and more with our powerful filtering system.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: ShieldCheck,
    title: "Verified Data",
    desc: "Every college listing is carefully verified for accuracy, so you can trust the information you see.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: GitCompare,
    title: "Compare Colleges",
    desc: "Side-by-side comparisons of up to 3 colleges on fees, placements, facilities, ratings, and more.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: TrendingUp,
    title: "Placement Insights",
    desc: "Real placement data with average & highest packages, year-wise trends, and top recruiters for each college.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
]

async function FeaturedCollegesSection() {
  const colleges = await fetchFeaturedColleges(6)

  return (
    <section className="container py-20">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
        <div>
          <Badge variant="secondary" className="mb-3">
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />
            Top Rated
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured Colleges</h2>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Handpicked institutions with outstanding placements, infrastructure, and student satisfaction.
          </p>
        </div>
        <Button asChild variant="outline" size="lg">
          <Link href="/colleges">
            View All Colleges
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {colleges.map((college) => (
          <CollegeCard key={college.id} college={college} />
        ))}
      </div>
    </section>
  )
}

function FeaturedCollegesSkeleton() {
  return (
    <section className="container py-20">
      <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <Skeleton className="h-6 w-24 mb-3" />
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-11 w-44" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
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
        ))}
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 pt-10 md:pt-16 pb-20 md:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-violet-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <Badge variant="secondary" className="mb-5 px-4 py-1.5 text-sm backdrop-blur bg-white/60 border shadow-sm">
              <GraduationCap className="mr-2 h-4 w-4 text-primary" />
              India's #1 College Discovery Platform
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
              Find Your{" "}
              <span className="bg-gradient-to-r from-primary via-blue-600 to-violet-600 bg-clip-text text-transparent">
                Dream College
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Discover, compare, and explore the best colleges in India with verified data,
              advanced filters, and in-depth placement insights.
            </p>

            <div className="max-w-3xl mx-auto mb-6">
              <SearchBar size="lg" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                60+ Top Colleges
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                15 States
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Placement Data
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE FEATURES SECTION */}
      <section className="container py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="secondary" className="mb-3">Why EduSearch</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Everything You Need to Decide
          </h2>
          <p className="text-muted-foreground text-lg">
            We bring transparency and clarity to college admissions with data-driven insights
            and powerful comparison tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon
            return (
              <Card key={i} className="group border bg-white hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-6 pt-8">
                  <div className={`${feature.bg} ${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* FEATURED COLLEGES */}
      <FeaturedCollegesSection />

      {/* CTA SECTION */}
      <section className="container pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-blue-600 to-violet-600 p-8 md:p-14 text-primary-foreground shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.1),transparent_40%)] pointer-events-none" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-primary-foreground/90 text-lg mb-8 max-w-lg">
                Browse thousands of colleges, filter by your preferences, and compare institutions
                side-by-side. Your future starts with a well-informed decision.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" variant="secondary" className="text-primary">
                  <Link href="/colleges">
                    Browse All Colleges
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white">
                  <Link href="/compare">
                    <GitCompare className="mr-2 h-4 w-4" />
                    Compare Colleges
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-end">
              <div className="grid grid-cols-2 gap-4 max-w-sm">
                {[
                  { label: "Colleges", value: "60+" },
                  { label: "States", value: "15" },
                  { label: "Courses", value: "50+" },
                  { label: "Recruiters", value: "24" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5">
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm text-white/80 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
