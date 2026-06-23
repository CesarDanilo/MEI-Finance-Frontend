import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { BalanceCard } from "@/components/features/dashboard/balance-card";
import { MeiLimitGauge } from "@/components/features/dashboard/mei-limit-gauge";
import { RecentTransactions } from "@/components/features/dashboard/recent-transactions";
import { RevenueChart } from "@/components/features/dashboard/revenue-chart";
import { TransactionForm } from "@/components/features/transactions/transaction-form";
import { Header } from "@/components/Header";
import { QueryState } from "@/components/ui/query-state";
import { Button } from "@/components/ui/button";
import {
  buildMonthlyChartData,
  currentPeriod,
  filterTransactions,
  getMonthlyBalance,
  getYearToDateIncome,
  sumByType,
} from "@/lib/transactions";
import { useTransactions } from "@/hooks/useTransactions";

export const Route = createFileRoute("/_private/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { transactions, categories, isLoading, isError, refetch } =
    useTransactions();

  const period = currentPeriod();
  const monthTransactions = filterTransactions(transactions, { period });
  const balance = getMonthlyBalance(monthTransactions);
  const income = sumByType(monthTransactions, "INCOME");
  const expense = sumByType(monthTransactions, "EXPENSE");
  const chartData = buildMonthlyChartData(transactions);
  const yearToDateIncome = getYearToDateIncome(transactions);

  const [year, month] = period.split("-").map(Number);
  const periodLabel = format(new Date(year, month - 1, 1), "MMMM yyyy", {
    locale: ptBR,
  });

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Header
        title="Dashboard"
        subtitle="Visão geral das suas finanças"
        action={
          <TransactionForm categories={categories} />
        }
      />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-6">
        <QueryState
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          emptyTitle="Comece registrando seu primeiro lançamento"
          emptyDescription="Assim você vê saldo, gráficos e limite MEI com clareza."
          isEmpty={!isLoading && !isError && transactions.length === 0}
          emptyAction={<TransactionForm categories={categories} />}
        >
          <BalanceCard
            balance={balance}
            income={income}
            expense={expense}
            periodLabel={periodLabel}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <MeiLimitGauge yearToDateIncome={yearToDateIncome} />
            <RevenueChart data={chartData} />
          </div>

          <RecentTransactions transactions={transactions} />

          <div className="flex justify-center pb-4 md:hidden">
            <TransactionForm
              categories={categories}
              trigger={
                <Button size="lg" className="w-full max-w-sm">
                  Novo Lançamento
                </Button>
              }
            />
          </div>
        </QueryState>
      </main>
    </div>
  );
}
