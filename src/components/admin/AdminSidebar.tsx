import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  Calendar,
  Activity,
  MessageSquare,
  Mail,
  Settings,
  Users,
  LogOut,
  Heart,
  Shield,
  Clock,
  Image,
  Menu,
  Home,
  Boxes,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { usePermissions } from "@/hooks/usePermissions";

const mainItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, module: 'dashboard' as const },
  { title: "File de validation", url: "/admin/validation", icon: Clock, module: 'posts' as const },
  { title: "Pages", url: "/admin/pages", icon: FileText, module: 'pages' as const },
  { title: "Actualités", url: "/admin/posts", icon: Newspaper, module: 'posts' as const },
  { title: "Événements", url: "/admin/events", icon: Calendar, module: 'events' as const },
  { title: "Ateliers", url: "/admin/activities", icon: Activity, module: 'activities' as const },
  { title: "Témoignages", url: "/admin/testimonials", icon: MessageSquare, module: 'testimonials' as const },
  { title: "Médias", url: "/admin/media", icon: Image, module: 'media' as const },
  { title: "Messages", url: "/admin/messages", icon: Mail, module: 'messages' as const },
];

const configItems = [
  { title: "Navigation", url: "/admin/navigation", icon: Menu, module: 'settings' as const },
  { title: "Page d'accueil", url: "/admin/homepage", icon: Home, module: 'settings' as const },
  { title: "Nos Actions", url: "/admin/actions", icon: Boxes, module: 'settings' as const },
  { title: "Utilisateurs", url: "/admin/users", icon: Users, module: 'users' as const },
  { title: "Permissions", url: "/admin/permissions", icon: Shield, module: 'users' as const },
  { title: "Paramètres", url: "/admin/settings", icon: Settings, module: 'settings' as const },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { signOut } = useAuth();
  const { canView, isAdmin } = usePermissions();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => location.pathname === path;

  // Filter items based on permissions
  const visibleMainItems = mainItems.filter(item => canView(item.module));
  const visibleConfigItems = configItems.filter(item => isAdmin || canView(item.module));

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary flex-shrink-0" fill="currentColor" />
          {!collapsed && <span className="font-bold text-sidebar-foreground">Admin</span>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Contenu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleMainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {visibleConfigItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Configuration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleConfigItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <NavLink to={item.url} end>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {!collapsed && "Déconnexion"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
