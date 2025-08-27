import { Home, TrendingUp, TrendingDown, FileText, LogOut, Target, BookOpen, User, CreditCard } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { CliiiLogo } from "./CliiiLogo";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Nova Receita",
    url: "/receitas",
    icon: TrendingUp,
  },
  {
    title: "Nova Despesa",
    url: "/despesas",
    icon: TrendingDown,
  },
  {
    title: "Metas",
    url: "/metas",
    icon: Target,
  },
  {
    title: "Dívidas",
    url: "/dividas",
    icon: CreditCard,
  },
  {
    title: "Relatórios",
    url: "/relatorios",
    icon: FileText,
  },
  {
    title: "Dicas Financeiras",
    url: "/dicas",
    icon: BookOpen,
  },
  {
    title: "Perfil",
    url: "/perfil",
    icon: User,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <CliiiLogo size={28} />
      </SidebarHeader>
      
      <SidebarContent className="p-3">
        <SidebarMenu className="space-y-1">
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                isActive={location.pathname === item.url}
                className="w-full justify-start gap-3 py-2.5 px-3 hover:bg-sidebar-accent rounded-lg transition-all duration-200 button-hover"
              >
                <Link to={item.url}>
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              className="w-full justify-start gap-3 py-2.5 px-3 hover:bg-sidebar-accent rounded-lg transition-all duration-200 text-destructive hover:bg-destructive/10 button-hover"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium text-sm">Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}