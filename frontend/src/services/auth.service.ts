import { ApiError, api } from "@/lib/api/client";
import type { LoginResponse, RegisterResponse } from "@/types/api";

export class AuthServiceError extends Error {
  code: "INVALID_CREDENTIALS" | "EMAIL_IN_USE" | "VALIDATION" | "UNKNOWN";

  constructor(
    code: AuthServiceError["code"],
    message: string,
  ) {
    super(message);
    this.name = "AuthServiceError";
    this.code = code;
  }
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      return await api.post<LoginResponse>(
        "/auth/login",
        { email, passwordHash: password },
        { auth: false },
      );
    } catch (error) {
      throw mapAuthError(error);
    }
  },

  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<RegisterResponse> {
    try {
      return await api.post<RegisterResponse>(
        "/user",
        { name, email, passwordHash: password },
        { auth: false },
      );
    } catch (error) {
      throw mapAuthError(error);
    }
  },
};

function mapAuthError(error: unknown): AuthServiceError {
  if (error instanceof ApiError) {
    const payload =
      typeof error.data === "object" && error.data !== null
        ? (error.data as Record<string, unknown>)
        : null;
    const detail =
      (typeof payload?.error === "string" && payload.error) ||
      error.message;

    if (
      detail.toLowerCase().includes("invalid credentials") ||
      detail.toLowerCase().includes("user not found")
    ) {
      return new AuthServiceError(
        "INVALID_CREDENTIALS",
        "E-mail ou senha inválidos.",
      );
    }

    if (detail.toLowerCase().includes("email already in use")) {
      return new AuthServiceError(
        "EMAIL_IN_USE",
        "Este e-mail já está cadastrado.",
      );
    }

    if (error.status === 400) {
      return new AuthServiceError("VALIDATION", detail);
    }
  }

  if (error instanceof AuthServiceError) {
    return error;
  }

  return new AuthServiceError(
    "UNKNOWN",
    "Não foi possível concluir. Tente novamente.",
  );
}
