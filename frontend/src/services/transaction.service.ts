import { api } from "@/lib/api/client";
import type {
  ApiCategory,
  ApiTransaction,
  DataResponse,
  TransactionType,
} from "@/types/api";

export type CreateTransactionPayload = {
  type: TransactionType;
  amount: number;
  description?: string;
  transactionDate: string;
  categoryId: string;
};

export type UpdateTransactionPayload = CreateTransactionPayload;

export const transactionService = {
  list(): Promise<ApiTransaction[]> {
    return api
      .get<DataResponse<ApiTransaction[]>>("/transaction")
      .then((res) => res.data);
  },

  getById(id: string): Promise<ApiTransaction> {
    return api
      .get<DataResponse<ApiTransaction>>(`/transaction/${id}`)
      .then((res) => res.data);
  },

  create(payload: CreateTransactionPayload): Promise<ApiTransaction> {
    return api
      .post<DataResponse<ApiTransaction>>("/transaction", payload)
      .then((res) => res.data);
  },

  update(
    id: string,
    payload: UpdateTransactionPayload,
  ): Promise<ApiTransaction> {
    return api
      .put<DataResponse<ApiTransaction>>(`/transaction/${id}`, payload)
      .then((res) => res.data);
  },

  delete(id: string): Promise<ApiTransaction> {
    return api
      .delete<DataResponse<ApiTransaction>>(`/transaction/${id}`)
      .then((res) => res.data);
  },
};

export const categoryService = {
  list(): Promise<ApiCategory[]> {
    return api
      .get<DataResponse<ApiCategory[]>>("/category")
      .then((res) => res.data);
  },

  create(name: string, type: TransactionType): Promise<ApiCategory> {
    return api
      .post<DataResponse<ApiCategory>>("/category", { name, type })
      .then((res) => res.data);
  },
};

export const DEFAULT_CATEGORIES: Array<{ name: string; type: TransactionType }> =
  [
    { name: "Vendas", type: "INCOME" },
    { name: "Serviços", type: "INCOME" },
    { name: "Outras receitas", type: "INCOME" },
    { name: "Material", type: "EXPENSE" },
    { name: "Aluguel", type: "EXPENSE" },
    { name: "Transporte", type: "EXPENSE" },
    { name: "Impostos", type: "EXPENSE" },
    { name: "Outras despesas", type: "EXPENSE" },
  ];

export async function seedDefaultCategories(): Promise<void> {
  const existing = await categoryService.list();
  if (existing.length > 0) return;

  await Promise.all(
    DEFAULT_CATEGORIES.map((category) =>
      categoryService.create(category.name, category.type),
    ),
  );
}
