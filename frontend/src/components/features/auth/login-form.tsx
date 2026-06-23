import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/validators/auth";
import { AuthServiceError, authService } from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";
import { seedDefaultCategories } from "@/services/transaction.service";

type LoginFormProps = {
  onSwitchToRegister: () => void;
  onSuccess?: () => void;
};

export function LoginForm({ onSwitchToRegister, onSuccess }: LoginFormProps) {
  const { signIn } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      const response = await authService.login(values.email, values.password);
      signIn(response.token, response.user);
      await seedDefaultCategories().catch(() => undefined);
      onSuccess?.();
    } catch (error) {
      if (error instanceof AuthServiceError) {
        setError("root", { message: error.message });
        return;
      }
      setError("root", {
        message: "Erro inesperado. Tente novamente em instantes.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">E-mail</Label>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="seu@email.com"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password">Senha</Label>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          placeholder="Sua senha"
          aria-invalid={Boolean(errors.password)}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      {errors.root && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errors.root.message}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Entrando..." : "Entrar"}
      </Button>

      <button
        type="button"
        onClick={onSwitchToRegister}
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Não tem conta? <span className="font-medium text-primary">Criar conta</span>
      </button>
    </form>
  );
}
