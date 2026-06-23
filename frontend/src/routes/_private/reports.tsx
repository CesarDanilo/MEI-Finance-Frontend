import { createFileRoute } from "@tanstack/react-router";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoneyValue } from "@/components/ui/money-value";
import { QueryState } from "@/components/ui/query-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  filterTransactions,
  getMonthlyBalance,
  sumByType,
} from "@/lib/transactions";
import { useTransactions } from "@/hooks/useTransactions";

export const Route = createFileRoute("/_private/reports")({
  component: ReportsPage,
});

function buildPeriodOptions(count = 12) {
  const now = new Date();
  return Array.from({ length: count }, (_, index) => {
    const date = subMonths(now, index);
    return {
      value: format(date, "yyyy-MM"),
      label: format(date, "MMM yyyy", { locale: ptBR }),
    };
  });
}

function ReportsPage() {
  const { transactions, isLoading, isError, refetch } = useTransactions();
  const periodOptions = buildPeriodOptions();
  const [period, setPeriod] = useState(periodOptions[0]?.value ?? "");

  const periodTransactions = useMemo(
    () => filterTransactions(transactions, { period }),
    [transactions, period],
  );

  const income = sumByType(periodTransactions, "INCOME");
  const expense = sumByType(periodTransactions, "EXPENSE");
  const balance = getMonthlyBalance(periodTransactions);

  function handleExportCsv() {
    // TODO: integrar com GET /api/reports/export/csv quando disponível no backend
    toast.message("Exportação CSV", {
      description:
        "Endpoint de exportação ainda não disponível no backend. Em breve.",
    });
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Header
        title="Relatórios"
        subtitle="Resumo financeiro por período"
        action={
          <Button variant="outline" onClick={handleExportCsv}>
            <Download className="size-4" />
            Exportar CSV
          </Button>
        }
      />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Período</p>
            <p className="text-sm text-muted-foreground">
              Selecione o mês para ver receitas, despesas e saldo.
            </p>
          </div>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <QueryState
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          isEmpty={!isLoading && !isError && periodTransactions.length === 0}
          emptyTitle="Sem movimentações no período"
          emptyDescription="Altere o período ou registre lançamentos para gerar o relatório."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <SummaryCard title="Total receitas" value={income} type="INCOME" />
            <SummaryCard title="Total despesas" value={expense} type="EXPENSE" />
            <SummaryCard title="Saldo do período" value={balance} />
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Detalhes do período</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                {periodTransactions.length} lançamentos considerados neste
                relatório.
              </p>
              <p>
                {/* TODO: integrar com GET /api/reports/monthly quando disponível */}
                Relatório calculado com base nos lançamentos registrados no app.
              </p>
            </CardContent>
          </Card>
        </QueryState>
      </main>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  type,
}: {
  title: string;
  value: number;
  type?: "INCOME" | "EXPENSE";
}) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MoneyValue
          value={value}
          type={type}
          signed={type !== undefined}
          className="text-2xl font-semibold"
        />
      </CardContent>
    </Card>
  );
}
