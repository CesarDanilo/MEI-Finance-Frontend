import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { TransactionCard } from "@/components/transactions/transaction-card";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { TransactionsFilters } from "@/components/transactions/transactions-filters";
import { useTransactionsFilters } from "@/hooks/use-transactions-filters";
import { mockTransactions } from "@/mocks/transactions";
import { DialogTransactions } from "@/components/dialog/Dialog-transactions";

export const Route = createFileRoute("/_private/transactions")({
    component: TransactionsPage,
});

function TransactionsPage() {
    const { filters, updateFilter, filteredTransactions } = useTransactionsFilters(mockTransactions);

    return (
        <div className="flex min-h-screen flex-col bg-muted/30">
            <Header
                title="Lançamentos Financeiros"
                subtitle="Cadastre, edite e acompanhe todas as suas movimentações."
            />

            <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <TransactionsFilters filters={filters} onFilterChange={updateFilter} />

                    <DialogTransactions />
                </div>

                {/* Contador */}
                <div className="flex items-center justify-end">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {filteredTransactions.length} lançamentos
                    </span>
                </div>

                {/* Mobile: lista de cards. Desktop: tabela. */}
                <div className="overflow-hidden rounded-lg border border-border bg-card">
                    <div className="md:hidden">
                        {filteredTransactions.map((transaction) => (
                            <TransactionCard key={transaction.id} transaction={transaction} />
                        ))}
                    </div>

                    <div className="hidden md:block">
                        <TransactionsTable transactions={filteredTransactions} />
                    </div>
                </div>
            </main>
        </div>
    );
}