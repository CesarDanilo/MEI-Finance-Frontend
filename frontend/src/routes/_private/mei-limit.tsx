import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { MeiLimitGauge } from "@/components/features/dashboard/mei-limit-gauge";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoneyValue } from "@/components/ui/money-value";
import { QueryState } from "@/components/ui/query-state";
import {
  getMeiLimitStatus,
  getMeiProgressColorClass,
  MEI_ANNUAL_LIMIT,
  projectLimitReachMonth,
} from "@/lib/mei-limit";
import { getYearToDateIncome } from "@/lib/transactions";
import { Progress } from "@/components/ui/progress";
import { useTransactions } from "@/hooks/useTransactions";

export const Route = createFileRoute("/_private/mei-limit")({
  component: MeiLimitPage,
});

function MeiLimitPage() {
  const { transactions, isLoading, isError, refetch } = useTransactions();
  const yearToDateIncome = getYearToDateIncome(transactions);
  const percentUsed = Math.min((yearToDateIncome / MEI_ANNUAL_LIMIT) * 100, 100);
  const status = getMeiLimitStatus(percentUsed);
  const projectedMonth = projectLimitReachMonth(
    yearToDateIncome,
    new Date().getMonth() + 1,
  );
  const remaining = Math.max(MEI_ANNUAL_LIMIT - yearToDateIncome, 0);

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Header
        title="Limite MEI"
        subtitle="Acompanhe seu faturamento anual com antecedência"
      />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 md:p-6">
        <QueryState isLoading={isLoading} isError={isError} onRetry={refetch}>
          <MeiLimitGauge yearToDateIncome={yearToDateIncome} />

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Resumo anual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Metric label="Faturamento acumulado">
                  <MoneyValue
                    value={yearToDateIncome}
                    type="INCOME"
                    className="text-xl font-semibold"
                  />
                </Metric>
                <Metric label="Limite anual vigente">
                  <MoneyValue
                    value={MEI_ANNUAL_LIMIT}
                    className="text-xl font-semibold text-foreground"
                  />
                </Metric>
                <Metric label="Margem restante">
                  <MoneyValue
                    value={remaining}
                    type={remaining > 0 ? "INCOME" : "EXPENSE"}
                    className="text-xl font-semibold"
                  />
                </Metric>
                <Metric label="Percentual utilizado">
                  <span
                    className={`font-tabular text-xl font-semibold tabular-nums ${
                      status === "danger"
                        ? "text-finance-expense"
                        : status === "warning"
                          ? "text-finance-warning"
                          : "text-finance-income"
                    }`}
                  >
                    {percentUsed.toFixed(1)}%
                  </span>
                </Metric>
              </div>

              <Progress
                value={percentUsed}
                indicatorClassName={getMeiProgressColorClass(status)}
              />

              {projectedMonth && percentUsed < 100 && (
                <p className="text-sm text-muted-foreground">
                  Projeção: mantendo o ritmo atual, o limite será atingido em{" "}
                  <span className="font-medium text-foreground">
                    {format(projectedMonth, "MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                  .
                </p>
              )}

              <p className="text-xs text-muted-foreground">
                {/* TODO: integrar com GET /api/dashboard/mei-limit quando disponível */}
                Valor de limite referência: R$ 81.000/ano (2026). Atualize quando
                houver mudança legal ou endpoint dedicado no backend.
              </p>
            </CardContent>
          </Card>
        </QueryState>
      </main>
    </div>
  );
}

function Metric({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
