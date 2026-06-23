import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido").trim(),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Nome deve ter no mínimo 2 caracteres")
      .max(100, "Nome deve ter no máximo 100 caracteres"),
    email: z.string().email("E-mail inválido").trim(),
    password: z
      .string()
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .max(72, "Senha deve ter no máximo 72 caracteres")
      .regex(/[A-Z]/, "Senha deve conter ao menos uma letra maiúscula")
      .regex(/[0-9]/, "Senha deve conter ao menos um número"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
