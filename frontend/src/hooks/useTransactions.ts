import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  enrichTransactions,
  type EnrichedTransaction,
} from "@/lib/transactions";
import {
  categoryService,
  seedDefaultCategories,
  transactionService,
  type CreateTransactionPayload,
  type UpdateTransactionPayload,
} from "@/services/transaction.service";

export const transactionKeys = {
  all: ["transactions"] as const,
  categories: ["categories"] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: transactionKeys.categories,
    queryFn: async () => {
      await seedDefaultCategories();
      return categoryService.list();
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useTransactions() {
  const categoriesQuery = useCategories();

  const transactionsQuery = useQuery({
    queryKey: transactionKeys.all,
    queryFn: () => transactionService.list(),
  });

  const categoryMap = new Map(
    (categoriesQuery.data ?? []).map((category) => [category.id, category.name]),
  );

  const enriched: EnrichedTransaction[] = enrichTransactions(
    transactionsQuery.data ?? [],
    categoryMap,
  );

  return {
    transactions: enriched,
    categories: categoriesQuery.data ?? [],
    isLoading: transactionsQuery.isLoading || categoriesQuery.isLoading,
    isError: transactionsQuery.isError || categoriesQuery.isError,
    error: transactionsQuery.error ?? categoriesQuery.error,
    refetch: () => {
      void transactionsQuery.refetch();
      void categoriesQuery.refetch();
    },
  };
}

export function useTransactionMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: transactionKeys.all });
  };

  const createMutation = useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      transactionService.create(payload),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTransactionPayload;
    }) => transactionService.update(id, payload),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => transactionService.delete(id),
    onSuccess: invalidate,
  });

  const createCategoryMutation = useMutation({
    mutationFn: ({
      name,
      type,
    }: {
      name: string;
      type: "INCOME" | "EXPENSE";
    }) => categoryService.create(name, type),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: transactionKeys.categories });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    createCategoryMutation,
  };
}
