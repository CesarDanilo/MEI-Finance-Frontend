import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { LoginForm } from "@/components/features/auth/login-form";
import { RegisterForm } from "@/components/features/auth/register-form";
import { Card, CardContent } from "@/components/ui/card";

import appLogo from "../../public/logo.png";

export function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const appName = import.meta.env.VITE_APP_NAME ?? "MEI Finance";
  const appSubtitle = import.meta.env.VITE_APP_SUBTITLE ?? "Controle simples";

  function switchToLogin(message?: string) {
    setMode("login");
    setSuccessMessage(message ?? null);
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md rounded-2xl border-border shadow-lg">
        <CardContent className="flex flex-col gap-6 p-6 md:p-8">
        <div className="flex items-center justify-center gap-4">
          <img src={appLogo} alt="Logo" className="w-24 h-24 object-contain" />
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {appName}
            </h1>
            <p className="text-sm text-muted-foreground">{appSubtitle}</p>
            <p className="text-sm text-muted-foreground">
              {mode === "login"
                ? "Entre para acompanhar suas finanças"
                : "Crie sua conta em menos de 1 minuto"}
            </p>
          </div>
        </div>

          {successMessage && (
            <p className="rounded-md bg-finance-income/10 px-3 py-2 text-sm text-finance-income">
              {successMessage}
            </p>
          )}

          {mode === "login" ? (
            <LoginForm
              onSwitchToRegister={() => {
                setSuccessMessage(null);
                setMode("register");
              }}
              onSuccess={() => setTimeout(() => {
                navigate({ to: "/dashboard" });
              }, 0)}
            />
          ) : (
          <RegisterForm onSwitchToLogin={switchToLogin} />
          )}

          <p className="text-center text-xs text-muted-foreground">
            Seus dados financeiros são protegidos por autenticação segura.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
