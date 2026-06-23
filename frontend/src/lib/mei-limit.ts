/** Limite anual MEI vigente (2026) — atualizar quando legislação mudar. */
export const MEI_ANNUAL_LIMIT = 81_000;

export type MeiLimitStatus = "safe" | "warning" | "danger";

export function getMeiLimitStatus(percentUsed: number): MeiLimitStatus {
  if (percentUsed >= 100) return "danger";
  if (percentUsed >= 80) return "warning";
  return "safe";
}

export function getMeiLimitColorClass(status: MeiLimitStatus): string {
  switch (status) {
    case "danger":
      return "text-finance-expense";
    case "warning":
      return "text-finance-warning";
    default:
      return "text-finance-income";
  }
}

export function getMeiProgressColorClass(status: MeiLimitStatus): string {
  switch (status) {
    case "danger":
      return "bg-finance-expense";
    case "warning":
      return "bg-finance-warning";
    default:
      return "bg-finance-income";
  }
}

/** Estima mês em que o limite será atingido com base no ritmo YTD. */
export function projectLimitReachMonth(
  yearToDateIncome: number,
  currentMonth: number,
): Date | null {
  if (yearToDateIncome <= 0 || currentMonth < 1 || currentMonth > 12) {
    return null;
  }

  const monthlyAverage = yearToDateIncome / currentMonth;
  if (monthlyAverage <= 0) return null;

  const monthsToLimit = MEI_ANNUAL_LIMIT / monthlyAverage;
  if (monthsToLimit > 12) return null;

  const reachMonthIndex = Math.ceil(monthsToLimit) - 1;
  const year = new Date().getFullYear();
  return new Date(year, reachMonthIndex, 1);
}
