import {
    LayoutDashboard,
    Users,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
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
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

/**
 * Itens de menu visíveis para todo usuário autenticado.
 * Adicione novas rotas aqui conforme o projeto crescer.
 */
const baseItems = [
    { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
];

/**
 * Itens extras, visíveis só pra admin.
 * São concatenados depois dos baseItems no menu final.
 */
const adminItems = [
    { title: "Users", icon: Users, url: "/users" },
];

export function AppSideBar() {
    const { user } = useAuth();
    // `state` vem como "expanded" | "collapsed" — controla o ícone do toggle
    const { state, toggleSidebar } = useSidebar();
    const isCollapsed = state === "collapsed";

    // Junta os itens base com os de admin, se aplicável.
    // (Bug do original: slice(0,3) e baseItems[3] não faziam sentido
    // com um array de 1 item — aqui é só uma concatenação direta)
    const menuItems = user?.admin === true
        ? [...baseItems, ...adminItems]
        : baseItems;

    // Nome/subtítulo/logo configuráveis por projeto via .env
    const appName = import.meta.env.VITE_APP_NAME ?? "Nome fantasia";
    const appSubtitle = import.meta.env.VITE_APP_SUBTITLE ?? "Subtítulo";
    const appLogo = import.meta.env.VITE_APP_LOGO_URL ?? "";

    return (
        // collapsible="icon" permite retrair pra só os ícones (em vez de "offcanvas",
        // que só funciona escondendo tudo — bom pra mobile, mas não dá um modo "compacto" no desktop)
        <Sidebar collapsible="icon">
            <SidebarHeader
                className={cn(
                    "flex h-16 flex-row items-center gap-x-3 border-b border-border px-6",
                    isCollapsed && "justify-center px-2",
                )}
            >
                {appLogo ? (
                    <img className="w-8 shrink-0" src={appLogo} alt="logo" />
                ) : (
                    // Fallback enquanto não tem logo: evita <img> quebrado
                    <div className="size-8 shrink-0 rounded-md bg-muted" />
                )}

                {/* Texto some quando colapsado, sem desmontar o componente */}
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
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem
                                    key={item.title}
                                    className="border-l-2 border-transparent transition-colors hover:border-primary"
                                >
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        className="rounded-none px-6"
                                    >
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer com o botão de retrair/expandir.
                Só aparece em desktop (md:flex) — em mobile a sidebar já é
                off-canvas controlada pelo SidebarTrigger do header. */}
            <SidebarFooter className="hidden border-t border-border p-2 md:flex">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="w-full justify-center text-muted-foreground hover:text-foreground"
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