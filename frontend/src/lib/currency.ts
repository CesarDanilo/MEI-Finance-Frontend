export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatCurrencyCompact(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** Parses masked BRL input ("1.234,56") to number. */
export function parseCurrencyInput(value: string): number {
  const digits = value.replace(/\D/g, "");
  if (!digits) return 0;
  return Number(digits) / 100;
}

/** Formats cents to masked BRL while typing. */
export function maskCurrencyInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  const cents = digits ? Number(digits) : 0;
  return formatCurrency(cents / 100);
}

export function decimalToNumber(value: string | number): number {
  return typeof value === "number" ? value : Number(value);
}
