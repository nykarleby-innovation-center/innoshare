import { cn } from "@/utils/ui"

export function PageHeader(props: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h1
      className={cn(
        "text-2xl font-black uppercase tracking-tighter hyphens-auto break-words mb-16 sm:text-3xl lg:text-4xl ",
        props.className
      )}
    >
      {props.children}
    </h1>
  )
}
