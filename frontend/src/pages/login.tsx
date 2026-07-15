import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { LoginForm } from "@/components/features/auth/login-form";
import { RegisterForm } from "@/components/features/auth/register-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import appLogo from "../../public/logo.png";

export function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const appName = import.meta.env.VITE_APP_NAME ?? "MEI Finance";
  const appSubtitle = import.meta.env.VITE_APP_SUBTITLE ?? "Controle simples";
  const apiUrl = import.meta.env.VITE_API_URL;

  function switchToLogin(message?: string) {
    setMode("login");
    setSuccessMessage(message ?? null);
  }

  function handleGoogleLogin() {
    window.location.href = `${apiUrl}/auth/google`;
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

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">ou</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={handleGoogleLogin}
          >
            <GoogleIcon className="h-4 w-4" />
            Continuar com Google
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Seus dados financeiros são protegidos por autenticação segura.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09A6.6 6.6 0 0 1 5.48 12c0-.73.13-1.43.36-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}