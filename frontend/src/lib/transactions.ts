import {
  endOfMonth,
  format,
  isWithinInterval,
  parseISO,
  startOfMonth,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";

import { decimalToNumber } from "@/lib/currency";
import type { ApiTransaction, TransactionType } from "@/types/api";

export type EnrichedTransaction = ApiTransaction & {
  amountNumber: number;
  categoryName: string;
};

export function enrichTransactions(
  transactions: ApiTransaction[],
  categoryMap: Map<string, string>,
): EnrichedTransaction[] {
  return transactions.map((transaction) => ({
    ...transaction,
    amountNumber: decimalToNumber(transaction.amount),
    categoryName: categoryMap.get(transaction.categoryId) ?? "Sem categoria",
  }));
}

export function filterTransactions(
  transactions: EnrichedTransaction[],
  filters: {
    period?: string;
    type?: "all" | TransactionType;
    categoryId?: string;
    search?: string;
  },
): EnrichedTransaction[] {
  return transactions.filter((transaction) => {
    if (filters.type && filters.type !== "all" && transaction.type !== filters.type) {
      return false;
    }

    if (
      filters.categoryId &&
      filters.categoryId !== "all" &&
      transaction.categoryId !== filters.categoryId
    ) {
      return false;
    }

    if (filters.period) {
      const [year, month] = filters.period.split("-").map(Number);
      const date = parseISO(transaction.transactionDate);
      if (date.getFullYear() !== year || date.getMonth() + 1 !== month) {
        return false;
      }
    }

    if (filters.search?.trim()) {
      const query = filters.search.trim().toLowerCase();
      const haystack = [
        transaction.description ?? "",
        transaction.categoryName,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    return true;
  });
}

export function sumByType(
  transactions: EnrichedTransaction[],
  type: TransactionType,
): number {
  return transactions
    .filter((t) => t.type === type)
    .reduce((acc, t) => acc + t.amountNumber, 0);
}

export function getMonthlyBalance(transactions: EnrichedTransaction[]): number {
  return sumByType(transactions, "INCOME") - sumByType(transactions, "EXPENSE");
}

export function getYearToDateIncome(
  transactions: EnrichedTransaction[],
  year = new Date().getFullYear(),
): number {
  return transactions
    .filter((t) => {
      if (t.type !== "INCOME") return false;
      return parseISO(t.transactionDate).getFullYear() === year;
    })
    .reduce((acc, t) => acc + t.amountNumber, 0);
}

export type MonthlyChartPoint = {
  month: string;
  label: string;
  income: number;
  expense: number;
};

export function buildMonthlyChartData(
  transactions: EnrichedTransaction[],
  months = 6,
): MonthlyChartPoint[] {
  const now = new Date();

  return Array.from({ length: months }, (_, index) => {
    const date = subMonths(now, months - 1 - index);
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    const monthTransactions = transactions.filter((t) =>
      isWithinInterval(parseISO(t.transactionDate), { start, end }),
    );

    return {
      month: format(date, "yyyy-MM"),
      label: format(date, "MMM", { locale: ptBR }),
      income: sumByType(monthTransactions, "INCOME"),
      expense: sumByType(monthTransactions, "EXPENSE"),
    };
  });
}

export function formatTransactionDate(isoDate: string): string {
  return format(parseISO(isoDate), "dd/MM/yyyy");
}

export function toApiDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function currentPeriod(): string {
  return format(new Date(), "yyyy-MM");
}
