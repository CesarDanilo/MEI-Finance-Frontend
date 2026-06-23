import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { TransactionTypeBadge } from "@/components/transactions/transaction-type-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoneyValue } from "@/components/ui/money-value";
import { formatTransactionDate } from "@/lib/transactions";
import type { EnrichedTransaction } from "@/lib/transactions";

type RecentTransactionsProps = {
  transactions: EnrichedTransaction[];
};

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const recent = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.transactionDate).getTime() -
        new Date(a.transactionDate).getTime(),
    )
    .slice(0, 5);

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base font-semibold">
            Últimos lançamentos
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Movimentações mais recentes
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/transactions">
            Ver todos
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="divide-y divide-border p-0">
        {recent.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between gap-3 px-6 py-4"
          >
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <TransactionTypeBadge type={transaction.type} />
                <span className="truncate text-sm font-medium text-foreground">
                  {transaction.description || transaction.categoryName}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatTransactionDate(transaction.transactionDate)} ·{" "}
                {transaction.categoryName}
              </p>
            </div>
            <MoneyValue
              value={transaction.amountNumber}
              type={transaction.type}
              signed
              className="text-sm font-semibold"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
