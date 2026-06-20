import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TransactionTypeBadge } from "./transaction-type-badge";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types/transaction";

interface TransactionsTableProps {
    transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Data</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Tipo</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Categoria</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Descrição</TableHead>
                    <TableHead className="text-right text-xs uppercase tracking-wide text-muted-foreground">Valor</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.map((transaction) => {
                    const isIncome = transaction.type === "income";

                    return (
                        <TableRow key={transaction.id}>
                            <TableCell className="text-sm text-muted-foreground">
                                {formatDate(transaction.date)}
                            </TableCell>
                            <TableCell>
                                <TransactionTypeBadge type={transaction.type} />
                            </TableCell>
                            <TableCell className="text-sm font-medium text-foreground">
                                {transaction.category}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                                {transaction.description}
                            </TableCell>
                            <TableCell
                                className={cn(
                                    "text-right text-sm font-semibold whitespace-nowrap",
                                    isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
                                )}
                            >
                                {isIncome ? "+" : "−"} {formatCurrency(transaction.amount)}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}