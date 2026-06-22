// src/pages/Login.tsx
//
// ============================================================================
// TEMPLATE: Tela de Login / Cadastro
// ============================================================================
// Esse componente é um SKELETON pensado para ser reaproveitado em outros
// projetos. Ele já vem com:
//   - Tema shadcn (light/dark) via variáveis CSS (bg-background, etc.)
//   - Validação de formulário com Zod
//   - Alternância entre "Entrar" e "Criar conta" no mesmo formulário
//   - Integração com um AuthContext (signIn)
//
// Para reaproveitar em um novo projeto, procure as marcações:
//   // CUSTOMIZE: ...   -> coisas que você provavelmente vai querer mudar
//   // TODO: ...        -> integrações que dependem do backend/projeto
// ============================================================================

import { useState } from "react";
import { z } from "zod";

import { useNavigate } from "@tanstack/react-router";

//import { useAuth } from "@/context/auth-context";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ============================================================================
// BRANDING / TEXTOS
// ============================================================================
// CUSTOMIZE: centralizar aqui o que muda de projeto pra projeto evita ter
// que caçar texto espalhado pelo JSX toda vez que for reaproveitar a tela.

const BRAND = {
  logoSrc: "", // CUSTOMIZE: caminho do logo (ex: "/logo.svg")
  appName: "Bem-vindo",
  footerText: "Chat2Order • Plataforma segura", // CUSTOMIZE
  redirectAfterLogin: "/", // CUSTOMIZE: rota pós-login
};

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================
// CUSTOMIZE: ajuste as regras (tamanho mínimo de senha, campos extras, etc.)
// conforme as regras de negócio de cada projeto.

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

const signUpSchema = loginSchema
  .extend({
    name: z.string().min(2, "Nome muito curto"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

// Tipos inferidos automaticamente dos schemas acima.
//type LoginPayload = z.infer<typeof loginSchema>;
type SignUpPayload = z.infer<typeof signUpSchema>;

export function Login() {
  // ==========================================================================
  // NAVIGATION / AUTH
  // ==========================================================================
  // TODO: ajuste a assinatura de `signIn` conforme o seu AuthContext.
  // Aqui assumimos `signIn({ email, password }) => Promise<void>`.

  const navigate = useNavigate();
  //const { signIn } = useAuth();

  // ==========================================================================
  // STATES
  // ==========================================================================

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // 1) Escolhe o schema certo conforme o modo (login ou cadastro)
    const schema = createAccount ? signUpSchema : loginSchema;
    const payload = createAccount
      ? { email, password, name, confirmPassword }
      : { email, password };

    // 2) Valida com Zod antes de bater no backend
    const result = schema.safeParse(payload);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Dados inválidos");
      return;
    }

    setLoading(true);

    try {
      if (createAccount) {
        // TODO: chamar a função de cadastro do seu AuthContext/API
        // ex: await signUp(result.data as SignUpPayload)
        console.log("Cadastro:", result.data as SignUpPayload);
      } else {
        // TODO: ajustar conforme a assinatura real de `signIn`
        // await signIn(result.data as LoginPayload);
      }

      navigate({ to: BRAND.redirectAfterLogin });
    } catch {
      // TODO: tratar erros específicos da API (ex: credenciais inválidas,
      // email já cadastrado, etc.) em vez de uma mensagem genérica.
      setError("Não foi possível concluir. Verifique seus dados.");
    } finally {
      setLoading(false);
    }
  }

  function toggleMode() {
    setError(null);
    setCreateAccount((prev) => !prev);
  }

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm rounded-2xl border-border shadow-lg">
        <CardContent className="flex flex-col justify-center gap-6 p-6">
          {/* ==================== HEADER ==================== */}
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <div className="flex items-center justify-center gap-2">
              {/* CUSTOMIZE: remova esse <img> se não tiver logo ainda */}
              <div className="w-6">
                <img src={BRAND.logoSrc} alt="logo" />
              </div>

              <h1 className="text-2xl font-bold text-foreground">
                {BRAND.appName}
              </h1>
            </div>

            <p className="text-sm text-muted-foreground">
              {createAccount
                ? "Crie sua conta para continuar"
                : "Entre com sua conta para continuar"}
            </p>
          </div>

          {/* ==================== FORM ==================== */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* EMAIL (sempre visível) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Email
              </label>

              <Input
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            {/* NAME (só aparece no modo cadastro) */}
            {createAccount && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">
                  Nome
                </label>

                <Input
                  type="text"
                  placeholder="Digite seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            )}

            {/* PASSWORD (sempre visível) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Senha
              </label>

              <Input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={createAccount ? "new-password" : "current-password"}
              />
            </div>

            {/* CONFIRM PASSWORD (só aparece no modo cadastro) */}
            {createAccount && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">
                  Confirmar senha
                </label>

                <Input
                  type="password"
                  placeholder="Digite novamente sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            )}

            {/* ERROR MESSAGE */}
            {/* CUSTOMIZE: trocar por toast/sonner se o projeto já usar isso */}
            {error && <p className="text-sm text-destructive">{error}</p>}

            {/* BUTTONS */}
            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={loading} className="w-full">
                {loading
                  ? createAccount
                    ? "Cadastrando..."
                    : "Entrando..."
                  : createAccount
                    ? "Criar conta"
                    : "Entrar"}
              </Button>

              <span
                className="mt-2 flex cursor-pointer items-center justify-center text-sm text-muted-foreground hover:text-foreground"
                onClick={toggleMode}
              >
                {createAccount ? "Já tenho uma conta" : "Criar conta"}
              </span>
            </div>
          </form>

          {/* ==================== FOOTER ==================== */}
          <p className="text-center text-xs text-muted-foreground">
            {BRAND.footerText}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}