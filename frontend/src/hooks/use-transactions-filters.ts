import { useMemo, useState } from "react";
import type { Transaction } from "@/types/transaction";
import {
    DEFAULT_TRANSACTION_FILTERS,
    type TransactionFiltersState,
} from "@/types/transaction";

function matchesPeriod(transaction: Transaction, period: string): boolean {
    // transaction.date assumido como ISO ("YYYY-MM-DD..."), slice evita criar Date desnecessariamente
    return transaction.date.slice(0, 7) === period;
}

function matchesSearch(transaction: Transaction, search: string): boolean {
    if (!search) return true;
    return transaction.description.toLowerCase().includes(search);
}

/**
 * Centraliza estado e lógica de filtragem das transações.
 *
 * A página consome apenas `filters`, `setFilters` e `filteredTransactions` —
 * não conhece a regra de matching, o que mantém SRP e facilita migrar
 * para filtragem server-side no futuro sem tocar na UI.
 */
export function useTransactionsFilters(transactions: Transaction[]) {
    const [filters, setFilters] = useState<TransactionFiltersState>(
        DEFAULT_TRANSACTION_FILTERS,
    );

    const normalizedSearch = filters.search.trim().toLowerCase();

    const filteredTransactions = useMemo(() => {
        return transactions.filter((transaction) => {
            if (!matchesPeriod(transaction, filters.period)) return false;
            if (filters.type !== "all" && transaction.type !== filters.type) return false;
            if (
                filters.categoryId !== "all" &&
                transaction.category !== filters.categoryId
            )
                return false;
            if (!matchesSearch(transaction, normalizedSearch)) return false;

            return true;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        transactions,
        filters.period,
        filters.type,
        filters.categoryId,
        normalizedSearch,
    ]);

    function updateFilter<K extends keyof TransactionFiltersState>(
        key: K,
        value: TransactionFiltersState[K],
    ) {
        setFilters((prev) => ({ ...prev, [key]: value }));
    }

    return { filters, updateFilter, filteredTransactions };
}