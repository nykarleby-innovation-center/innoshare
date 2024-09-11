import { cn } from "@/utils/ui"

export function PageHeader(props: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h1
      className={cn(
        "text-3xl font-black uppercase tracking-tighter mb-16 lg:text-4xl ",
        props.className
      )}
    >
      {props.children}
    </h1>
  )
}
