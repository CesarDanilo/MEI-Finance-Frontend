import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { TransactionType } from "@/types/api";

interface TransactionTypeBadgeProps {
  type: TransactionType;
}

export function TransactionTypeBadge({ type }: TransactionTypeBadgeProps) {
  const isIncome = type === "INCOME";

  return (
    <Badge variant={isIncome ? "income" : "expense"}>
      {isIncome ? (
        <ArrowUpRight className="size-3" />
      ) : (
        <ArrowDownLeft className="size-3" />
      )}
      {isIncome ? "Receita" : "Despesa"}
    </Badge>
  );
}
