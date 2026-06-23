import type { TransactionType } from "@/types/api";

export type TransactionTypeFilter = "all" | TransactionType;

export interface TransactionFiltersState {
  period: string;
  categoryId: string;
  type: TransactionTypeFilter;
  search: string;
}

export function createDefaultTransactionFilters(): TransactionFiltersState {
  const now = new Date();
  const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return {
    period,
    categoryId: "all",
    type: "all",
    search: "",
  };
}
