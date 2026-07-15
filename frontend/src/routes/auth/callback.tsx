// src/routes/auth/callback.tsx (ou onde suas rotas do TanStack Router ficam)
import { useEffect } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { token?: string };

  useEffect(() => {
    const token = search.token;

    if (!token) {
      navigate({ to: "/auth" });
      return;
    }

    // ajuste aqui pro mesmo mecanismo que o LoginForm já usa
    // ex: localStorage.setItem("token", token)
    // ex: authStore.setToken(token)
    localStorage.setItem("token", token);

    navigate({ to: "/dashboard" });
  }, [search.token, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-muted-foreground">Entrando...</p>
    </div>
  );
}