import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Moon, Sun } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/hooks/useAuth";
import {
  passwordSchema,
  profileSchema,
  type PasswordFormValues,
  type ProfileFormValues,
} from "@/lib/validators/transaction";

export const Route = createFileRoute("/_private/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, updateUser, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  function onProfileSubmit(values: ProfileFormValues) {
    if (!user) return;
    updateUser({ ...user, ...values });
    toast.success("Dados atualizados localmente.");
    toast.message("Alteração de perfil no servidor", {
      description:
        "Endpoint PUT /api/user ainda não exposto no backend. Preferências salvas localmente.",
    });
  }

  function onPasswordSubmit() {
    toast.message("Alteração de senha", {
      description:
        "Endpoint de atualização de senha ainda não disponível no backend.",
    });
    passwordForm.reset();
  }

  function handleLogout() {
    signOut();
    navigate({ to: "/auth" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Header title="Perfil" subtitle="Preferências da conta e aparência" />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-4 md:p-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Dados pessoais</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="profile-name">Nome</Label>
                <Input id="profile-name" {...profileForm.register("name")} />
                {profileForm.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {profileForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-email">E-mail</Label>
                <Input
                  id="profile-email"
                  type="email"
                  {...profileForm.register("email")}
                />
                {profileForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {profileForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button type="submit">Salvar alterações</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Alterar senha</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  {...passwordForm.register("password")}
                />
                {passwordForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">Confirmar senha</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  {...passwordForm.register("confirmPassword")}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" variant="outline">
                Atualizar senha
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Aparência</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {isDark ? (
                  <Moon className="size-4 text-muted-foreground" />
                ) : (
                  <Sun className="size-4 text-muted-foreground" />
                )}
                <div>
                  <p className="text-sm font-medium">Tema escuro</p>
                  <p className="text-xs text-muted-foreground">
                    Alternância rápida para leitura confortável de números.
                  </p>
                </div>
              </div>
              <Switch
                checked={isDark}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
                aria-label="Alternar tema escuro"
              />
            </div>
          </CardContent>
        </Card>

        <Button variant="destructive" onClick={handleLogout} className="w-fit">
          <LogOut className="size-4" />
          Sair da conta
        </Button>
      </main>
    </div>
  );
}
