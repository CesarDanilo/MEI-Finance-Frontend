export type TransactionType = "income" | "expense";
export type TransactionTypeFilter = "all" | "income" | "expense";

export interface Transaction {
    id: string;
    date: string; // ISO 8601 (yyyy-MM-dd)
    type: TransactionType;
    category: string;
    description: string;
    amount: number; // sempre positivo; o sinal é derivado de `type`
}

export interface TransactionFiltersState {
    /** Formato "YYYY-MM" — mesmo padrão já usado no Select de período existente */
    period: string;
    categoryId: string; // "all" | id da categoria
    type: TransactionTypeFilter;
    search: string;
}

export const DEFAULT_TRANSACTION_FILTERS: TransactionFiltersState = {
    period: "2026-06",
    categoryId: "all",
    type: "all",
    search: "",
};
