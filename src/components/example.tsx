import { cn } from "@/lib/utils"

function LandingRow({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className="w-full relative z-10">
      <div
        data-slot="example-wrapper"
        className={cn(
          "mx-auto flex flex-col lg:grid lg:grid-cols-3 w-full min-w-0 content-center items-start gap-x-8 gap-y-8 p-4 pt-2 sm:gap-12 sm:p-6 l",
          className
        )}
        {...props}
      />
    </div>
  )
}

function Example({
  title,
  children,
  className,
  containerClassName,
  ...props
}: React.ComponentProps<"div"> & {
  title?: string
  containerClassName?: string
}) {
  return (
    <div
      data-slot="example"
      className={cn(
        "flex w-dfull min-w-0 flex-col gap-1 self-stretch lg:max-w-none",
        containerClassName
      )}
      {...props}
    >
      {title && (
        <div className="text-muted-foreground dpx-1.5 py-2 text-xs font-medium">
          {title}
        </div>
      )}
      <div
        data-slot="example-content"
        className={cn(
          " flex min-w-0 flex-1 items-start gap-6 border border-dashed p-4 sm:p-6",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

export { LandingRow, Example }
