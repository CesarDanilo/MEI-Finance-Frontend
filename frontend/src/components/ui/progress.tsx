import * as React from "react";
import { cn } from "@/lib/utils";

function Progress({
  className,
  value,
  indicatorClassName,
  ...props
}: React.ComponentProps<"div"> & {
  value?: number;
  indicatorClassName?: string;
}) {
  return (
    <div
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-muted",
        className,
      )}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 transition-all duration-200 ease-out",
          indicatorClassName,
        )}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </div>
  );
}

export { Progress };
