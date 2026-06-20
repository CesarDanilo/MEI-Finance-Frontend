import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { TransactionCard } from "@/components/transactions/transaction-card"; 
import { TransactionsTable } from "@/components/transactions/transactions-table"; 
import { mockTransactions } from "@/mocks/transactions";

export const Route = createFileRoute("/_private/transactions")({
    component: TransactionsPage,
});

function TransactionsPage() {
    const transactions = mockTransactions;

    return (
        <div className="flex min-h-screen flex-col bg-muted/30">
            <Header
                title="Lançamentos Financeiros"
                subtitle="Cadastre, edite e acompanhe todas as suas movimentações."
            />

            <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                {/* Ação principal — full width no mobile, alinhada à direita no desktop */}
                <div className="flex justify-end">
                    <Button className="w-full md:w-auto">
                        <Plus className="size-4" />
                        Novo Lançamento
                    </Button>
                </div>

                {/* Filtro + contador */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Filtrar por:</span>
                        <Select defaultValue="2026-06">
                            <SelectTrigger className="w-[140px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2026-06">Jun 2026</SelectItem>
                                <SelectItem value="2026-05">Mai 2026</SelectItem>
                                <SelectItem value="2026-04">Abr 2026</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {transactions.length} lançamentos
                    </span>
                </div>

                {/* Mobile: lista de cards. Desktop: tabela. */}
                <div className="overflow-hidden rounded-lg border border-border bg-card">
                    <div className="md:hidden">
                        {transactions.map((transaction) => (
                            <TransactionCard key={transaction.id} transaction={transaction} />
                        ))}
                    </div>

                    <div className="hidden md:block">
                        <TransactionsTable transactions={transactions} />
                    </div>
                </div>
            </main>
        </div>
    );
}