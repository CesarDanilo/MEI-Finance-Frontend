export {
  formatCurrency,
  formatCurrencyCompact,
  parseCurrencyInput,
  maskCurrencyInput,
} from "@/lib/currency";

export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}
