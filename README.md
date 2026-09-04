# EduSearch — College Discovery Platform

A production-quality college discovery platform built as a Frontend Engineer internship assignment. Features advanced search, filtering, sorting, pagination, side-by-side college comparison, college detail pages with placements & ratings, and a responsive, dark-mode-ready dashboard UI.

**Tech Stack:** Next.js 15 (App Router) · React 18 · TypeScript · Tailwind CSS · ShadCN UI · Zustand · next-themes

---

## ✨ Features

### Pages
1. **Home** — Hero, large search bar, stats strip, feature cards, featured colleges grid, CTA.
2. **Colleges Listing** — Search by name, filter by state / rating / fee range, 7 sort options, pagination, responsive 1–3 column card grid, mobile filter drawer, empty state, active filter badges.
3. **College Detail** — 5 tabs (Overview / Courses / Placements / Ratings / Facilities), hero with key stats, 4-year placement trend with avg + highest package LPA, per-category 5-star ratings, facility icon grid, sticky sidebar stats.
4. **Compare Colleges** — Add up to 3 colleges, fixed side-by-side comparison table on Fees, Rating, Placement %, Location, Avg / Highest Package, Courses, Facilities, Accredited, Established, Campus size, Students, Faculty. Empty & add-college dialog.
5. **Error Boundary** (`/app/error.tsx`) — Graceful client error UI with retry + home buttons.
6. **404 Page** (`/app/not-found.tsx`) — Illustrated not-found page with Home / Browse / Back actions.
7. **Loading Skeletons** — Global fallback (`/app/loading.tsx`), per-page Suspense fallbacks, skeleton card / filter panel / detail / compare table loaders in `components/skeletons.tsx`.

### Components (reusable, responsive, typed)
`Navbar`, `Footer`, `SearchBar`, `FilterPanel`, `CollegeCard`, `CompareTable`, `PaginationControls`, `SortSelect`, `AddCollegeDialog`, `AddToCompareButton`, `ThemeProvider`, `ThemeToggle`, plus all ShadCN UI primitives (`button`, `card`, `sheet`, `input`, `select`, `slider`, `checkbox`, `badge`, `pagination`, `separator`, `label`, `progress`, `skeleton`, `dropdown-menu`, `dialog`, `tabs`, `scroll-area`, `switch`).

### Data & State
- **30 mock colleges** deterministically generated with seeded helpers covering IITs, NITs, IIITs, BITS/VIT/SRM, Karnataka belt colleges (RVCE/BMS/MSRIT/…) and more (see `data/colleges.ts`). Each record has:
  - Basic info: id, name, shortName, city, state, country, logo, images, description, establishedYear, campusSize, type, accredited, website, contactEmail, phone
  - Nested: `courses[]`, `placement` (overall %, avg/highest package, 4-year stats, top recruiters), `rating` (overall, academics, infrastructure, placements, faculty, reviewsCount), `facilities[]` (id, name, icon, available)
- **Zustand** global store for compare list (id-based, max 3 colleges, add/toggle/remove/clear).
- **URL searchParams-driven** filter / sort / pagination state — shareable links, server-side readable.
- **next-themes** dark mode with system default, no hydration flash (attribute class + suppressHydrationWarning).

### Mock API Layer (two flavors, no backend required)
1. **Server Actions** — `lib/actions.ts` (`"use server"`): `getColleges`, `getCollegeById`, `getFeaturedColleges`, plus display-optimized `fetchColleges`, `fetchFeaturedColleges`, `fetchCollegeById` (flatten nested data for cards/details). Implements latency via `sleep()`, full filter/sort/paginate pipeline.
2. **HTTP Route Handlers** (for deployable REST-style API, per spec):
   - `GET /api/colleges` — accepts `query`, `state`, `city`, `course`, `minRating`, `maxRating`, `minFees`, `maxFees`, `minPlacement`, `sort`, `page`, `limit` query params.
   - `GET /api/colleges/featured?limit=6`
   - `GET /api/colleges/:id`

Both layers share the same in-memory dataset — zero backend dependencies, fully static/SSG-friendly.

---

## 📁 Project Structure

```
.
├── app/
│   ├── api/colleges/             # Explicit mock API routes (per spec)
│   │   ├── route.ts              # GET /api/colleges
│   │   ├── featured/route.ts     # GET /api/colleges/featured
│   │   └── [id]/route.ts         # GET /api/colleges/:id
│   ├── colleges/
│   │   ├── page.tsx              # Listing page (search/filter/sort/paginate)
│   │   └── [id]/page.tsx         # College detail page (5 tabs)
│   ├── compare/page.tsx          # Compare up to 3 colleges
│   ├── error.tsx                 # Error boundary
│   ├── globals.css               # Tailwind + HSL CSS variables (light/dark)
│   ├── layout.tsx                # Root layout: fonts, metadata, ThemeProvider, Navbar/Footer
│   ├── loading.tsx               # Global loading skeleton
│   ├── not-found.tsx             # 404 page
│   └── page.tsx                  # Home page (Hero + Featured)
├── components/
│   ├── ui/                       # ShadCN/Radix primitives
│   ├── AddCollegeDialog.tsx      # "Add college to compare" dialog with filter search
│   ├── AddToCompareButton.tsx    # Compare toggle button (id-based store ops)
│   ├── CollegeCard.tsx           # Flattened-college display card
│   ├── CompareTable.tsx          # 3-slot side-by-side compare table
│   ├── FilterPanel.tsx           # State + Rating + Fee filters, URL-driven
│   ├── PaginationControls.tsx    # Prev/Next + numbered pages, URL-driven
│   ├── SearchBar.tsx             # Debounced search input
│   ├── SortSelect.tsx            # Sort dropdown (client-side router.push)
│   ├── footer.tsx
│   ├── navbar.tsx                # Sticky nav, ThemeToggle, mobile Sheet drawer
│   ├── skeletons.tsx             # Reusable skeleton loaders
│   ├── theme-provider.tsx        # next-themes wrapper
│   └── theme-toggle.tsx          # Sun/Moon theme switch
├── data/
│   └── colleges.ts               # 30 seeded mock colleges + helpers + exports
├── hooks/
│   └── use-college-filters.ts    # Optional client hook for filter state (unused by pages)
├── lib/
│   ├── actions.ts                # Server actions + flattenCollege data layer
│   ├── store.ts                  # Zustand compare-list store (id-based)
│   └── utils.ts                  # cn(), formatCurrencyINR(), sleep(), etc.
├── types/
│   └── index.ts                  # Course/Placement/Rating/Facility/College/Filters/SortOption/ApiResponse
├── components.json               # ShadCN config
├── next.config.ts
├── package.json
├── postcss.config.js
├── tailwind.config.ts            # Container center + padding, CSS-variable colors, dark:class
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js ≥ 18.17** (tested on v24)
- **npm ≥ 9** (tested on v11; use `--legacy-peer-deps` if you hit peer warnings)

### Setup

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Run the development server (http://localhost:3000)
npm run dev

# 3. Production build (verify Vercel-deployable state)
npm run build

# 4. Serve the production build locally
npm run start
```

> Note for Windows PowerShell 5 users: Use `npm.cmd` instead of `npm` if your shell resolves `npm.ps1` and blocks unsigned scripts (PSSecurityException). Example: `npm.cmd run dev`.

### Environment
No `.env` file is required — everything runs against the local mock dataset. If you add real API keys later, follow Next.js env conventions.

---

## 🔍 Usage Examples

### Browse & filter
```
/colleges?state=Karnataka&minRating=4&maxFees=300000&sort=placement-desc&page=1
```

### College detail
```
/colleges/iit-bombay
```

### Compare
Visit `/compare` → click **Add College** and pick up to 3 colleges. Compare link is shareable via compare-list state persisted in memory per tab.

### Mock HTTP API (curl examples)
```bash
# All colleges (paginated)
curl http://localhost:3000/api/colleges?limit=6

# Featured
curl http://localhost:3000/api/colleges/featured?limit=3

# By ID
curl http://localhost:3000/api/colleges/iit-bombay

# Filtered + sorted
curl "http://localhost:3000/api/colleges?state=Maharashtra&minRating=4.2&sort=fees-asc"
```

---

## 🎨 Design Notes

- **Mobile-first, fully responsive**: Breakpoints at `sm`, `md`, `lg`, `2xl`. Filter drawer on mobile (<lg), sidebar on desktop.
- **Dark mode system-default**: `next-themes` attribute-class strategy with `suppressHydrationWarning` on `<html>` to avoid FOUC.
- **Optimized rendering**: Server components handle data fetching + Suspense fallbacks; client components only where interactivity is required (ThemeToggle, Compare store, FilterPanel URL updates, sort selector).
- **Type safety**: Strict TypeScript. Two explicit college shapes separated by contract:
  - `lib/actions` fetches → *flattened* scalar shape for cards/detail.
  - `lib/store.getColleges()` → raw nested shape from `data/colleges.ts` for CompareTable.
- **No backend dependencies.** Entire app is deployable on Vercel out of the box.

---

## ☁️ Deploy on Vercel

The project is a standard Next.js 15 App Router app and is fully optimized for Vercel:

```bash
# Install Vercel CLI if not present
npm i -g vercel

# From project root
vercel           # First-time: link project, accept defaults
vercel --prod    # Deploy to production
```

Or push this repo to GitHub/GitLab/Bitbucket, import it in the Vercel dashboard, accept the default Next.js preset and click **Deploy**. No build-command or env overrides required.

---

## 📊 Test Checklist (verified during build)

| Item | Status |
|------|--------|
| `npx tsc --noEmit` — Zero TS errors | ✅ |
| `npm run build` — Next build succeeds, all 6 routes generated | ✅ |
| Home page `/` — Hero + Featured + Search work | ✅ Build, smoke-test pending runtime |
| Colleges `/colleges` — Search / State filter / Rating slider / Fee slider / Sort / Pagination all update URL | ✅ Build, smoke-test pending runtime |
| Detail `/colleges/[id]` — 5 Tabs, placement LPA div-by-100000, 5-star rating, Facility map by name | ✅ |
| Compare `/compare` — Add up to 3, highlight max values, remove works | ✅ |
| Dark mode toggle — Navbar, `ThemeProvider` attribute-class, no hydration flash | ✅ |
| HTTP API routes — `/api/colleges`, `/api/colleges/featured`, `/api/colleges/:id` | ✅ |
| Responsive breakpoints (mobile filter drawer / desktop sidebar) | ✅ |
| 30 seeded colleges in `data/colleges.ts` | ✅ |

---

## 🛡️ License

For demonstration / internship evaluation purposes.
