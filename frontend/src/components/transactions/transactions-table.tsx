import { Pencil, Trash2 } from "lucide-react";

import { TransactionTypeBadge } from "@/components/transactions/transaction-type-badge";
import { Button } from "@/components/ui/button";
import { MoneyValue } from "@/components/ui/money-value";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatTransactionDate, type EnrichedTransaction } from "@/lib/transactions";

interface TransactionsTableProps {
  transactions: EnrichedTransaction[];
  onEdit: (transaction: EnrichedTransaction) => void;
  onDelete: (transaction: EnrichedTransaction) => void;
}

export function TransactionsTable({
  transactions,
  onEdit,
  onDelete,
}: TransactionsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead className="text-right">Valor</TableHead>
          <TableHead className="w-[100px] text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="font-tabular text-sm text-muted-foreground tabular-nums">
              {formatTransactionDate(transaction.transactionDate)}
            </TableCell>
            <TableCell>
              <TransactionTypeBadge type={transaction.type} />
            </TableCell>
            <TableCell className="text-sm font-medium">
              {transaction.categoryName}
            </TableCell>
            <TableCell className="max-w-[240px] truncate text-sm text-muted-foreground">
              {transaction.description || "—"}
            </TableCell>
            <TableCell className="text-right">
              <MoneyValue
                value={transaction.amountNumber}
                type={transaction.type}
                signed
                className="text-sm font-semibold"
              />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Editar lançamento ${transaction.id}`}
                  onClick={() => onEdit(transaction)}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Excluir lançamento ${transaction.id}`}
                  onClick={() => onDelete(transaction)}
                >
                  <Trash2 className="size-4 text-finance-expense" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
