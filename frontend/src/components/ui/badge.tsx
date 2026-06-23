import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & {
  variant?: "default" | "income" | "expense" | "warning" | "outline";
}) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        variant === "default" && "border-transparent bg-primary text-primary-foreground",
        variant === "income" &&
          "border-transparent bg-finance-income/15 text-finance-income",
        variant === "expense" &&
          "border-transparent bg-finance-expense/15 text-finance-expense",
        variant === "warning" &&
          "border-transparent bg-finance-warning/15 text-finance-warning",
        variant === "outline" && "text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
