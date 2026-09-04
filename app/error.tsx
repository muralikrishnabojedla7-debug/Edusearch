"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[calc(100vh-16rem)] items-center justify-center py-16">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 -z-10 rounded-full bg-destructive/10 blur-3xl" />
          <div className="flex h-40 w-40 items-center justify-center rounded-full bg-muted">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Something went wrong
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-md">
          We hit a snag while processing your request. This might be a
          temporary issue. Please try again, or head back home.
        </p>

        {process.env.NODE_ENV === "development" && error?.message && (
          <div className="mt-6 w-full max-w-md rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-left">
            <p className="text-xs font-semibold text-destructive mb-2">
              Error (Dev Mode)
            </p>
            <code className="text-xs text-muted-foreground break-all">
              {error.message}
            </code>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
