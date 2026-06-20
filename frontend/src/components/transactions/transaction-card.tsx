import { TransactionTypeBadge } from "@/components/transactions/transaction-type-badge";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types/transaction";

interface TransactionCardProps {
    transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
    const isIncome = transaction.type === "income";

    return (
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-b-0">
            <div className="flex min-w-0 flex-col gap-1">
                <span className="truncate text-sm font-medium text-foreground">
                    {transaction.description}
                </span>
                <div className="flex items-center gap-2">
                    <TransactionTypeBadge type={transaction.type} />
                    <span className="truncate text-xs text-muted-foreground">
                        {transaction.category}
                    </span>
                </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1">
                <span
                    className={cn(
                        "text-sm font-semibold whitespace-nowrap",
                        isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
                    )}
                >
                    {isIncome ? "+" : "−"} {formatCurrency(transaction.amount)}
                </span>
                <span className="text-xs text-muted-foreground">
                    {formatDate(transaction.date)}
                </span>
            </div>
        </div>
    );
}