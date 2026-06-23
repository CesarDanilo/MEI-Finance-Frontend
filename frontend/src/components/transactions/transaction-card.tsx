import { Pencil, Trash2 } from "lucide-react";

import { TransactionTypeBadge } from "@/components/transactions/transaction-type-badge";
import { Button } from "@/components/ui/button";
import { MoneyValue } from "@/components/ui/money-value";
import {
  formatTransactionDate,
  type EnrichedTransaction,
} from "@/lib/transactions";

interface TransactionCardProps {
  transaction: EnrichedTransaction;
  onEdit: (transaction: EnrichedTransaction) => void;
  onDelete: (transaction: EnrichedTransaction) => void;
}

export function TransactionCard({
  transaction,
  onEdit,
  onDelete,
}: TransactionCardProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-b-0">
      <div className="flex min-w-0 flex-col gap-1">
        <span className="truncate text-sm font-medium text-foreground">
          {transaction.description || transaction.categoryName}
        </span>
        <div className="flex items-center gap-2">
          <TransactionTypeBadge type={transaction.type} />
          <span className="truncate text-xs text-muted-foreground">
            {transaction.categoryName}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="flex flex-col items-end gap-1">
          <MoneyValue
            value={transaction.amountNumber}
            type={transaction.type}
            signed
            className="text-sm font-semibold"
          />
          <span className="font-tabular text-xs text-muted-foreground tabular-nums">
            {formatTransactionDate(transaction.transactionDate)}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Editar"
            onClick={() => onEdit(transaction)}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Excluir"
            onClick={() => onDelete(transaction)}
          >
            <Trash2 className="size-4 text-finance-expense" />
          </Button>
        </div>
      </div>
    </div>
  );
}
