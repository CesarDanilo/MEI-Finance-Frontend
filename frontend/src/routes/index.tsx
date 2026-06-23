import { createFileRoute, redirect } from "@tanstack/react-router";

import { authStorage } from "@/lib/auth-storage";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const token = authStorage.getToken();
    throw redirect({ to: token ? "/dashboard" : "/auth" });
  },
});
