import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/lib/validators/auth";
import { AuthServiceError, authService } from "@/services/auth.service";

type RegisterFormProps = {
  onSwitchToLogin: (message?: string) => void;
};

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    try {
      await authService.register(values.name, values.email, values.password);
      onSwitchToLogin("Conta criada com sucesso! Faça login para continuar.");
    } catch (error) {
      if (error instanceof AuthServiceError) {
        if (error.code === "EMAIL_IN_USE") {
          setError("email", { message: error.message });
          return;
        }
        if (error.code === "VALIDATION") {
          setError("root", { message: error.message });
          return;
        }
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
        <Label htmlFor="register-name">Nome</Label>
        <Input
          id="register-name"
          autoComplete="name"
          placeholder="Seu nome"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-email">E-mail</Label>
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          placeholder="seu@email.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password">Senha</Label>
        <Input
          id="register-password"
          type="password"
          autoComplete="new-password"
          placeholder="Mín. 8 caracteres, 1 maiúscula e 1 número"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-confirm">Confirmar senha</Label>
        <Input
          id="register-confirm"
          type="password"
          autoComplete="new-password"
          placeholder="Repita a senha"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {errors.root && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errors.root.message}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Cadastrando..." : "Criar conta"}
      </Button>

      <button
        type="button"
        onClick={() => onSwitchToLogin()}
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Já tenho conta. <span className="font-medium text-primary">Entrar</span>
      </button>
    </form>
  );
}
