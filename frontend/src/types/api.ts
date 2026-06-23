export type TransactionType = "INCOME" | "EXPENSE";

export type ApiUser = {
  id: string;
  name: string;
  email: string;
};

export type ApiCategory = {
  id: string;
  name: string;
  type: TransactionType;
  userId: string;
  createdAt: string;
};

export type ApiTransaction = {
  id: string;
  type: TransactionType;
  amount: string | number;
  description: string | null;
  transactionDate: string;
  userId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
};

export type LoginResponse = {
  user: ApiUser;
  token: string;
};

export type RegisterResponse = {
  data: ApiUser & { passwordHash?: string };
  message: string;
};

export type DataResponse<T> = {
  data: T;
  message?: string;
};
