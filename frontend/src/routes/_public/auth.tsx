import { createFileRoute, redirect } from "@tanstack/react-router";

import { AuthPage } from "@/pages/login";
import { authStorage } from "@/lib/auth-storage";

export const Route = createFileRoute("/_public/auth")({
  beforeLoad: () => {
    const token = authStorage.getToken();
    if (token) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: AuthPage,
});
