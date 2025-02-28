import { cn } from "@/utils/ui"

const Skeleton: React.FC<React.ComponentProps<"div">> = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("animate-pulse rounded-md bg-muted", className)}
    {...props}
  />
)

export { Skeleton }
