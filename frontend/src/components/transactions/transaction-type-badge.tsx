import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TransactionType } from "@/types/transaction";

interface TransactionTypeBadgeProps {
    type: TransactionType;
}

export function TransactionTypeBadge({ type }: TransactionTypeBadgeProps) {
    const isIncome = type === "income";

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
                isIncome
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                    : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
            )}
        >
            {isIncome ? (
                <ArrowUpRight className="size-3" />
            ) : (
                <ArrowDownLeft className="size-3" />
            )}
            {isIncome ? "Receita" : "Despesa"}
        </span>
    );
}