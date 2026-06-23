import { lazy, Suspense } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { MonthlyChartPoint } from "@/lib/transactions";

const RevenueChartInner = lazy(() =>
  import("./revenue-chart-inner").then((mod) => ({
    default: mod.RevenueChartInner,
  })),
);

type RevenueChartProps = {
  data: MonthlyChartPoint[];
};

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Receitas vs despesas
        </CardTitle>
        <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
      </CardHeader>
      <CardContent>
        <Suspense
          fallback={<Skeleton className="h-[240px] w-full rounded-lg" />}
        >
          <RevenueChartInner data={data} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
