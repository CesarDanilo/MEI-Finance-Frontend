import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  maskCurrencyInput,
  parseCurrencyInput,
} from "@/lib/currency";
import {
  transactionSchema,
  type TransactionFormValues,
} from "@/lib/validators/transaction";
import { toApiDate, type EnrichedTransaction } from "@/lib/transactions";
import { useTransactionMutations } from "@/hooks/useTransactions";
import type { ApiCategory, TransactionType } from "@/types/api";

type TransactionFormProps = {
  categories: ApiCategory[];
  transaction?: EnrichedTransaction;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
};

export function TransactionForm({
  categories,
  transaction,
  open: controlledOpen,
  onOpenChange,
  trigger,
}: TransactionFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [amountInput, setAmountInput] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const { createMutation, updateMutation, createCategoryMutation } =
    useTransactionMutations();

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "INCOME",
      amount: 0,
      categoryId: "",
      transactionDate: new Date(),
      description: "",
    },
  });

  const selectedType = form.watch("type");
  const filteredCategories = categories.filter(
    (category) => category.type === selectedType,
  );

  useEffect(() => {
    if (!open) return;

    if (transaction) {
      form.reset({
        type: transaction.type,
        amount: transaction.amountNumber,
        categoryId: transaction.categoryId,
        transactionDate: new Date(transaction.transactionDate),
        description: transaction.description ?? "",
      });
      setAmountInput(
        maskCurrencyInput(String(Math.round(transaction.amountNumber * 100))),
      );
      return;
    }

    const defaultCategory = categories.find(
      (category) => category.type === "INCOME",
    );

    form.reset({
      type: "INCOME",
      amount: 0,
      categoryId: defaultCategory?.id ?? "",
      transactionDate: new Date(),
      description: "",
    });
    setAmountInput("");
  }, [open, transaction, form, categories]);

  async function onSubmit(values: TransactionFormValues) {
    const payload = {
      type: values.type,
      amount: values.amount,
      categoryId: values.categoryId,
      description: values.description?.trim() || undefined,
      transactionDate: toApiDate(values.transactionDate),
    };

    try {
      if (transaction) {
        await updateMutation.mutateAsync({ id: transaction.id, payload });
        toast.success("Lançamento atualizado com sucesso.");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Lançamento registrado com sucesso.");
      }
      setOpen(false);
    } catch {
      toast.error("Não foi possível salvar o lançamento.");
    }
  }

  async function handleCreateCategory() {
    const name = newCategoryName.trim();
    if (!name) return;

    try {
      const category = await createCategoryMutation.mutateAsync({
        name,
        type: selectedType,
      });
      form.setValue("categoryId", category.id);
      setCreatingCategory(false);
      setNewCategoryName("");
      toast.success("Categoria criada.");
    } catch {
      toast.error("Não foi possível criar a categoria.");
    }
  }

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger !== undefined ? (
        trigger
      ) : (
        !transaction && (
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto">
              <Plus className="size-4" />
              Novo Lançamento
            </Button>
          </DialogTrigger>
        )
      )}

      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Editar lançamento" : "Novo lançamento"}
          </DialogTitle>
          <DialogDescription>
            Informe o tipo, valor e categoria para manter seu controle em dia.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="space-y-2">
            <Label>Tipo</Label>
            <div className="grid grid-cols-2 gap-2">
              {(["INCOME", "EXPENSE"] as TransactionType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    form.setValue("type", type);
                    form.setValue("categoryId", "");
                  }}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm font-medium transition-colors duration-150",
                    selectedType === type
                      ? type === "INCOME"
                        ? "border-finance-income bg-finance-income/10 text-finance-income"
                        : "border-finance-expense bg-finance-expense/10 text-finance-expense"
                      : "border-border text-muted-foreground hover:bg-muted",
                  )}
                >
                  {type === "INCOME" ? "Receita" : "Despesa"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <Input
              id="amount"
              inputMode="decimal"
              placeholder="R$ 0,00"
              value={amountInput}
              onChange={(event) => {
                const masked = maskCurrencyInput(event.target.value);
                setAmountInput(masked);
                form.setValue("amount", parseCurrencyInput(masked), {
                  shouldValidate: true,
                });
              }}
            />
            {form.formState.errors.amount && (
              <p className="text-sm text-destructive">
                {form.formState.errors.amount.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label>Categoria</Label>
              <button
                type="button"
                className="text-xs font-medium text-primary"
                onClick={() => setCreatingCategory((prev) => !prev)}
              >
                {creatingCategory ? "Cancelar nova categoria" : "Nova categoria"}
              </button>
            </div>

            {creatingCategory ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Nome da categoria"
                  value={newCategoryName}
                  onChange={(event) => setNewCategoryName(event.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCreateCategory}
                  disabled={createCategoryMutation.isPending}
                >
                  Criar
                </Button>
              </div>
            ) : (
              <Select
                value={form.watch("categoryId")}
                onValueChange={(value) => form.setValue("categoryId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {form.formState.errors.categoryId && (
              <p className="text-sm text-destructive">
                {form.formState.errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !form.watch("transactionDate") && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="size-4" />
                  {form.watch("transactionDate")
                    ? format(form.watch("transactionDate"), "PPP", {
                        locale: ptBR,
                      })
                    : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.watch("transactionDate")}
                  onSelect={(date) =>
                    date && form.setValue("transactionDate", date)
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Ex: Venda de produto"
              {...form.register("description")}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Salvando..." : "Salvar lançamento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
