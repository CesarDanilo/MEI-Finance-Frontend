import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ApiCategory } from "@/types/api";
import type {
  TransactionFiltersState,
  TransactionTypeFilter,
} from "@/types/transaction";

const TYPE_OPTIONS: { value: TransactionTypeFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "INCOME", label: "Receitas" },
  { value: "EXPENSE", label: "Despesas" },
];

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

interface TransactionsFiltersProps {
  filters: TransactionFiltersState;
  categories: ApiCategory[];
  onFilterChange: <K extends keyof TransactionFiltersState>(
    key: K,
    value: TransactionFiltersState[K],
  ) => void;
}

export function TransactionsFilters({
  filters,
  categories,
  onFilterChange,
}: TransactionsFiltersProps) {
  const periodOptions = buildPeriodOptions();

  return (
    <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
      <div className="relative flex-1 md:max-w-xs">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por descrição..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="pl-8"
        />
      </div>

      <Select
        value={filters.period}
        onValueChange={(value) => onFilterChange("period", value)}
      >
        <SelectTrigger className="w-full md:w-[150px]">
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

      <Select
        value={filters.categoryId}
        onValueChange={(value) => onFilterChange("categoryId", value)}
      >
        <SelectTrigger className="w-full md:w-[170px]">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas categorias</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.type}
        onValueChange={(value) =>
          onFilterChange("type", value as TransactionTypeFilter)
        }
      >
        <SelectTrigger className="w-full md:w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TYPE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
