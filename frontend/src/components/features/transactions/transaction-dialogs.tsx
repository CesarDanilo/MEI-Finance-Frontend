import { useState } from "react";
import { toast } from "sonner";

import { TransactionForm } from "@/components/features/transactions/transaction-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTransactionMutations } from "@/hooks/useTransactions";
import type { EnrichedTransaction } from "@/lib/transactions";
import type { ApiCategory } from "@/types/api";

type TransactionDialogsProps = {
  categories: ApiCategory[];
  editingTransaction: EnrichedTransaction | null;
  deletingTransaction: EnrichedTransaction | null;
  onCloseEdit: () => void;
  onCloseDelete: () => void;
};

export function TransactionDialogs({
  categories,
  editingTransaction,
  deletingTransaction,
  onCloseEdit,
  onCloseDelete,
}: TransactionDialogsProps) {
  const { deleteMutation } = useTransactionMutations();
  const [isDeleting, setIsDeleting] = useState(false);

  async function confirmDelete() {
    if (!deletingTransaction) return;
    setIsDeleting(true);
    try {
      await deleteMutation.mutateAsync(deletingTransaction.id);
      toast.success("Lançamento excluído.");
      onCloseDelete();
    } catch {
      toast.error("Não foi possível excluir o lançamento.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <TransactionForm
        categories={categories}
        transaction={editingTransaction ?? undefined}
        open={Boolean(editingTransaction)}
        onOpenChange={(open) => {
          if (!open) onCloseEdit();
        }}
        trigger={null}
      />

      <Dialog
        open={Boolean(deletingTransaction)}
        onOpenChange={(open) => {
          if (!open) onCloseDelete();
        }}
      >
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Excluir lançamento?</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. O lançamento será removido
              permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={onCloseDelete}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
