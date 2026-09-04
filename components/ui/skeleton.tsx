import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md bg-muted",
        className
      )}
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)",
        backgroundSize: "200% 100%",
        ...props.style,
      }}
      {...props}
    />
  )
}

export { Skeleton }
