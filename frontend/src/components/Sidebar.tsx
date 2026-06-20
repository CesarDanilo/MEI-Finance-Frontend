import {
    LayoutDashboard,
    Users,
    ChevronLeft,
    ChevronRight,
    ArrowLeftRight,
} from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
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

const baseItems = [
    { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
    { title: "Lançamentos", icon: ArrowLeftRight, url: "/transactions" },
];

const adminItems = [
    { title: "Users", icon: Users, url: "/users" },
];

export function AppSideBar() {
    const { user } = useAuth();
    const { state, toggleSidebar } = useSidebar();
    const isCollapsed = state === "collapsed";
    const location = useLocation();

    const menuItems = user?.admin === true
        ? [...baseItems, ...adminItems]
        : baseItems;

    const appName = import.meta.env.VITE_APP_NAME ?? "Nome fantasia";
    const appSubtitle = import.meta.env.VITE_APP_SUBTITLE ?? "Subtítulo";
    const appLogo = import.meta.env.VITE_APP_LOGO_URL ?? "";

    return (
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
                    <div className="size-8 shrink-0 rounded-md bg-muted" />
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
                    <SidebarGroupContent className="px-3">
                        <SidebarMenu className="gap-1">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.url
                                    || location.pathname.startsWith(`${item.url}/`);

                                return (
                                    <SidebarMenuItem key={item.url}>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={item.title}
                                            isActive={isActive}
                                            className={cn(
                                                "rounded-lg px-3 transition-colors duration-150",
                                                isActive
                                                    ? "bg-primary/10 text-primary font-medium hover:bg-primary/15 hover:text-primary"
                                                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                                            )}
                                        >
                                            <Link to={item.url}>
                                                <item.icon className="size-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

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