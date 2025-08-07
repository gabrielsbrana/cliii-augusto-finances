import { Home, TrendingUp, TrendingDown, FileText, LogOut, DollarSign } from "lucide-react";
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
    title: "Relatórios",
    url: "/relatorios",
    icon: FileText,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="financial-gradient p-2 rounded-lg">
            <DollarSign className="h-6 w-6 text-black" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-sidebar-foreground">Cliii</h2>
            <p className="text-sm text-sidebar-foreground/70">Augusto</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                isActive={location.pathname === item.url}
                className="w-full justify-start gap-3 py-3 px-4 hover:bg-sidebar-accent rounded-lg transition-colors"
              >
                <Link to={item.url}>
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              className="w-full justify-start gap-3 py-3 px-4 hover:bg-sidebar-accent rounded-lg transition-colors text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}