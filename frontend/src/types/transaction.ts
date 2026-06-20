export type TransactionType = "income" | "expense";

export interface Transaction {
    id: string;
    date: string; // ISO 8601 (yyyy-MM-dd)
    type: TransactionType;
    category: string;
    description: string;
    amount: number; // sempre positivo; o sinal é derivado de `type`
}