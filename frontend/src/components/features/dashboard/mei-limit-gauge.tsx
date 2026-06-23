import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoneyValue } from "@/components/ui/money-value";
import { Progress } from "@/components/ui/progress";
import {
  getMeiLimitColorClass,
  getMeiLimitStatus,
  getMeiProgressColorClass,
  MEI_ANNUAL_LIMIT,
  projectLimitReachMonth,
} from "@/lib/mei-limit";

type MeiLimitGaugeProps = {
  yearToDateIncome: number;
};

export function MeiLimitGauge({ yearToDateIncome }: MeiLimitGaugeProps) {
  const percentUsed = Math.min((yearToDateIncome / MEI_ANNUAL_LIMIT) * 100, 100);
  const status = getMeiLimitStatus(percentUsed);
  const projectedMonth = projectLimitReachMonth(
    yearToDateIncome,
    new Date().getMonth() + 1,
  );

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
        <div>
          <CardTitle className="text-base font-semibold">Limite MEI anual</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Faturamento acumulado no ano corrente
          </p>
        </div>
        {status !== "safe" && (
          <Badge variant={status === "danger" ? "expense" : "warning"}>
            {status === "danger" ? "Limite atingido" : "Atenção"}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <MoneyValue
              value={yearToDateIncome}
              type="INCOME"
              className="text-2xl font-semibold"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              de {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
                maximumFractionDigits: 0,
              }).format(MEI_ANNUAL_LIMIT)}
            </p>
          </div>
          <span
            className={`font-tabular text-lg font-semibold tabular-nums ${getMeiLimitColorClass(status)}`}
          >
            {percentUsed.toFixed(0)}%
          </span>
        </div>

        <Progress
          value={percentUsed}
          indicatorClassName={getMeiProgressColorClass(status)}
        />

        {status === "warning" && (
          <div className="flex items-start gap-2 rounded-lg bg-finance-warning/10 px-3 py-2 text-sm text-finance-warning">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>Você já utilizou 80% ou mais do limite anual MEI.</span>
          </div>
        )}

        {projectedMonth && percentUsed < 100 && (
          <p className="text-sm text-muted-foreground">
            Mantendo o ritmo atual, você atingirá o limite em{" "}
            <span className="font-medium text-foreground">
              {format(projectedMonth, "MMMM 'de' yyyy", { locale: ptBR })}
            </span>
            .
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          {/* TODO: integrar com GET /api/dashboard/mei-limit quando disponível no backend */}
          Cálculo feito com base nas receitas registradas no app.
        </p>
      </CardContent>
    </Card>
  );
}
