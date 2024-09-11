import { cn } from "@/utils/ui"

export function HtmlForm(props: React.HTMLProps<HTMLFormElement>) {
  return (
    <form {...props} className={cn("max-w-2xl flex flex-col gap-8", props.className)}>
      {props.children}
    </form>
  )
}
