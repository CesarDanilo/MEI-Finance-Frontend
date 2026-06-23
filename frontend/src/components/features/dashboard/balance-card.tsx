import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoneyValue } from "@/components/ui/money-value";
import { cn } from "@/lib/utils";

type BalanceCardProps = {
  balance: number;
  income: number;
  expense: number;
  periodLabel: string;
};

export function BalanceCard({
  balance,
  income,
  expense,
  periodLabel,
}: BalanceCardProps) {
  return (
    <section className="space-y-4">
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="px-6 py-8 md:px-8 md:py-10">
          <p className="text-sm font-medium text-muted-foreground">
            Saldo do mês · {periodLabel}
          </p>
          <MoneyValue
            value={balance}
            signed
            className="mt-2 block text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
          />
          <p className="mt-3 text-sm text-muted-foreground">
            Receitas menos despesas do período atual
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <SummaryMiniCard
          title="Receitas"
          value={income}
          type="INCOME"
          hint="Entradas registradas no mês"
        />
        <SummaryMiniCard
          title="Despesas"
          value={expense}
          type="EXPENSE"
          hint="Saídas registradas no mês"
        />
      </div>
    </section>
  );
}

function SummaryMiniCard({
  title,
  value,
  type,
  hint,
}: {
  title: string;
  value: number;
  type: "INCOME" | "EXPENSE";
  hint: string;
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
          className="text-2xl font-semibold md:text-3xl"
        />
        <p className={cn("mt-2 text-xs text-muted-foreground")}>{hint}</p>
      </CardContent>
    </Card>
  );
}
