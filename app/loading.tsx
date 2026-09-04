export default function Loading() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-4">
          <div className="h-10 w-48 animate-pulse rounded-md bg-muted" />
          <div className="h-5 w-96 max-w-full animate-pulse rounded-md bg-muted" />
          <div className="h-5 w-72 max-w-full animate-pulse rounded-md bg-muted" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="h-14 w-14 animate-pulse rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 animate-pulse rounded-md bg-muted" />
                  <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
                <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted" />
                <div className="h-4 w-4/6 animate-pulse rounded-md bg-muted" />
              </div>
              <div className="mt-6 flex gap-2">
                <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
                <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
                <div className="h-6 w-14 animate-pulse rounded-full bg-muted" />
              </div>
              <div className="mt-6">
                <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center py-8">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
