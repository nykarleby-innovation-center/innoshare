export function PageWrapper(props: {
  breadcrumb: React.ReactNode
  header: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <main className="max-w-6xl ml-auto mr-auto flex min-h-[60vh] flex-col mt-32 mb-32 relative px-4 xl:px-0">
      {props.breadcrumb}
      {props.header}
      {props.children}
    </main>
  )
}
