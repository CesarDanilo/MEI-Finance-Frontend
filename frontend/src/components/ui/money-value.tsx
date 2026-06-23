import { cn } from "@/lib/utils";

type MoneyProps = {
  value: number;
  className?: string;
  signed?: boolean;
  type?: "INCOME" | "EXPENSE" | "balance";
};

export function MoneyValue({
  value,
  className,
  signed = false,
  type = "balance",
}: MoneyProps) {
  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Math.abs(value));

  const display =
    signed && value !== 0
      ? `${value > 0 ? "+" : "-"} ${formatted.replace("-", "").trim()}`
      : formatted;

  const toneClass =
    type === "INCOME"
      ? "text-finance-income"
      : type === "EXPENSE"
        ? "text-finance-expense"
        : value >= 0
          ? "text-finance-income"
          : "text-finance-expense";

  return (
    <span className={cn("font-tabular tabular-nums", toneClass, className)}>
      {display}
    </span>
  );
}
