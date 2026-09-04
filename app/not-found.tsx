"use client";

import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[calc(100vh-16rem)] items-center justify-center py-16">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 -z-10 rounded-full bg-primary/10 blur-3xl" />
          <div className="flex h-40 w-40 items-center justify-center rounded-full bg-muted">
            <div className="flex items-baseline gap-1 text-7xl font-bold tracking-tight">
              <span className="text-primary">4</span>
              <Search className="h-16 w-16 text-muted-foreground" />
              <span className="text-primary">4</span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Page Not Found
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-md">
          Oops! The page you're looking for seems to have wandered off campus.
          It might have been moved, renamed, or never existed in the first
          place.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/colleges">
              <Search className="mr-2 h-4 w-4" />
              Browse Colleges
            </Link>
          </Button>
        </div>

        <div className="mt-12 flex items-center gap-2 text-sm text-muted-foreground">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back to previous page
          </button>
        </div>
      </div>
    </div>
  );
}
