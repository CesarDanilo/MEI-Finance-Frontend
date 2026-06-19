import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { AppSideBar } from "@/components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export const Route = createFileRoute("/_private")({
  beforeLoad: () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw redirect({ to: "/auth" });
    }
  },
  component: PrivateLayout,
});

function PrivateLayout() {
  const appName = import.meta.env.VITE_APP_NAME ?? "App";

  return (
    // TooltipProvider precisa envolver a árvore que usa tooltips —
    // o SidebarMenuButton com prop `tooltip` depende disso internamente
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AppSideBar />

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="flex h-14 items-center border-b border-border bg-background px-4 md:hidden">
              <SidebarTrigger className="text-muted-foreground" />
              <span className="ml-3 text-sm font-semibold text-foreground">
                {appName}
              </span>
            </header>

            <main className="min-w-0 flex-1">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}