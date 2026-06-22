import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { mockCategories } from "@/mocks/categories";
import type {
    TransactionFiltersState,
    TransactionTypeFilter,
} from "@/types/transaction";

const PERIOD_OPTIONS = [
    { value: "2026-06", label: "Jun 2026" },
    { value: "2026-05", label: "Mai 2026" },
    { value: "2026-04", label: "Abr 2026" },
];

const TYPE_OPTIONS: { value: TransactionTypeFilter; label: string }[] = [
    { value: "all", label: "Todos" },
    { value: "income", label: "Receitas" },
    { value: "expense", label: "Despesas" },
];

interface TransactionsFiltersProps {
    filters: TransactionFiltersState;
    onFilterChange: <K extends keyof TransactionFiltersState>(
        key: K,
        value: TransactionFiltersState[K],
    ) => void;
}

export function TransactionsFilters({
    filters,
    onFilterChange,
}: TransactionsFiltersProps) {
    return (
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1 md:max-w-xs">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
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
                <SelectTrigger className="w-full md:w-[140px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {PERIOD_OPTIONS.map((option) => (
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
                <SelectTrigger className="w-full md:w-[160px]">
                    <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas categorias</SelectItem>
                    {mockCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                            {category.label}
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