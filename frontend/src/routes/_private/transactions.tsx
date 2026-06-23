import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { TransactionDialogs } from "@/components/features/transactions/transaction-dialogs";
import { TransactionForm } from "@/components/features/transactions/transaction-form";
import { Header } from "@/components/Header";
import { TransactionCard } from "@/components/transactions/transaction-card";
import { TransactionsFilters } from "@/components/transactions/transactions-filters";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { QueryState } from "@/components/ui/query-state";
import { useTransactionsFilters } from "@/hooks/use-transactions-filters";
import { useTransactions } from "@/hooks/useTransactions";
import type { EnrichedTransaction } from "@/lib/transactions";

export const Route = createFileRoute("/_private/transactions")({
  component: TransactionsPage,
});

function TransactionsPage() {
  const { transactions, categories, isLoading, isError, refetch } =
    useTransactions();
  const { filters, updateFilter, filteredTransactions } =
    useTransactionsFilters(transactions);

  const [editingTransaction, setEditingTransaction] =
    useState<EnrichedTransaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] =
    useState<EnrichedTransaction | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Header
        title="Lançamentos"
        subtitle="Cadastre, edite e acompanhe todas as movimentações."
        action={<TransactionForm categories={categories} />}
      />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-4 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <TransactionsFilters
            filters={filters}
            categories={categories}
            onFilterChange={updateFilter}
          />
        </div>

        <div className="flex items-center justify-end">
          <span className="text-sm whitespace-nowrap text-muted-foreground">
            {filteredTransactions.length} lançamentos
          </span>
        </div>

        <QueryState
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          isEmpty={!isLoading && !isError && transactions.length === 0}
          emptyTitle="Nenhum lançamento ainda"
          emptyDescription="Adicione seu primeiro lançamento para começar o controle."
          emptyAction={<TransactionForm categories={categories} />}
        >
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="md:hidden">
              {filteredTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={setEditingTransaction}
                  onDelete={setDeletingTransaction}
                />
              ))}
            </div>

            <div className="hidden md:block">
              <TransactionsTable
                transactions={filteredTransactions}
                onEdit={setEditingTransaction}
                onDelete={setDeletingTransaction}
              />
            </div>
          </div>
        </QueryState>
      </main>

      <TransactionDialogs
        categories={categories}
        editingTransaction={editingTransaction}
        deletingTransaction={deletingTransaction}
        onCloseEdit={() => setEditingTransaction(null)}
        onCloseDelete={() => setDeletingTransaction(null)}
      />
    </div>
  );
}
