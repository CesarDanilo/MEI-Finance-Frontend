import { useMemo, useState } from "react";

import {
  filterTransactions,
  type EnrichedTransaction,
} from "@/lib/transactions";
import {
  createDefaultTransactionFilters,
  type TransactionFiltersState,
} from "@/types/transaction";

export function useTransactionsFilters(transactions: EnrichedTransaction[]) {
  const [filters, setFilters] = useState<TransactionFiltersState>(
    createDefaultTransactionFilters,
  );

  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, filters),
    [transactions, filters],
  );

  function updateFilter<K extends keyof TransactionFiltersState>(
    key: K,
    value: TransactionFiltersState[K],
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return { filters, updateFilter, filteredTransactions };
}
