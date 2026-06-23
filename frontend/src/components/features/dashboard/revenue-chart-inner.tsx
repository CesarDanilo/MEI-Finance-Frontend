import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "@/lib/currency";
import type { MonthlyChartPoint } from "@/lib/transactions";

type RevenueChartInnerProps = {
  data: MonthlyChartPoint[];
};

export function RevenueChartInner({ data }: RevenueChartInnerProps) {
  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={72}
            tickFormatter={(value) =>
              new Intl.NumberFormat("pt-BR", {
                notation: "compact",
                maximumFractionDigits: 0,
              }).format(Number(value))
            }
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.4 }}
            formatter={(value) => formatCurrency(Number(value))}
            labelFormatter={(label) => `Mês: ${label}`}
          />
          <Bar
            dataKey="income"
            name="Receitas"
            fill="var(--finance-income)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="expense"
            name="Despesas"
            fill="var(--finance-expense)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
