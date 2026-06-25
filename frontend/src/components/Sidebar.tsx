import {
  ArrowLeftRight,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Gauge,
  LayoutDashboard,
  LogOut,
  UserRound,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

import appLogo from "../../public/logo.png";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
  { title: "Lançamentos", icon: ArrowLeftRight, url: "/transactions" },
  { title: "Relatórios", icon: BarChart3, url: "/reports" },
  { title: "Limite MEI", icon: Gauge, url: "/mei-limit" },
  { title: "Perfil", icon: UserRound, url: "/profile" },
];

export function AppSideBar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const location = useLocation();

  const appName = import.meta.env.VITE_APP_NAME ?? "MEI Finance";
  const appSubtitle = import.meta.env.VITE_APP_SUBTITLE ?? "Controle simples";

  function handleLogout() {
    signOut();
    navigate({ to: "/auth" });
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader
        className={cn(
          "flex h-16 flex-row items-center gap-x-3 border-b border-border px-6",
          isCollapsed && "justify-center px-2",
        )}
      >
        {appLogo ? (
          <img className="size-8 shrink-0" src={appLogo} alt="logo" />
        ) : (
          <div className="size-8 shrink-0 rounded-md bg-primary/10" />
        )}

        {!isCollapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-base font-semibold tracking-tight text-foreground">
              {appName}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {appSubtitle}
            </span>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupContent className={cn("px-3", isCollapsed && "px-2")}>
            <SidebarMenu className="gap-1">
              {menuItems.map((item) => {
                const isActive =
                  location.pathname === item.url ||
                  location.pathname.startsWith(`${item.url}/`);

                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                      className={cn(
                        "rounded-lg transition-colors duration-150",
                        isCollapsed ? "px-0" : "px-3",
                        isActive
                          ? "bg-primary/10 font-medium text-primary hover:bg-primary/15 hover:text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      )}
                    >
                      <Link
                        to={item.url}
                        className={cn(
                          "flex items-center gap-2",
                          isCollapsed && "justify-center",
                        )}
                      >
                        <item.icon className="size-4 shrink-0" />
                        {!isCollapsed && (
                          <span className="truncate">{item.title}</span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="space-y-2 border-t border-border p-2">
        {!isCollapsed && user && (
          <div className="px-2 py-1">
            <p className="truncate text-xs font-medium text-foreground">
              {user.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        )}

        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "default"}
          onClick={handleLogout}
          className={cn(
            "w-full text-muted-foreground hover:text-foreground",
            !isCollapsed && "justify-start",
          )}
        >
          <LogOut className="size-4" />
          {!isCollapsed && "Sair"}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hidden w-full justify-center text-muted-foreground hover:text-foreground md:flex"
          aria-label={isCollapsed ? "Expandir menu" : "Retrair menu"}
        >
          {isCollapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
