import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  Calendar,
  Activity,
  MessageSquare,
  Image,
  Mail,
  Settings,
  Users,
  LogOut,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Pages", href: "/admin/pages", icon: FileText },
  { name: "Actualités", href: "/admin/posts", icon: Newspaper },
  { name: "Projets & Événements", href: "/admin/events", icon: Calendar },
  { name: "Ateliers", href: "/admin/activities", icon: Activity },
  { name: "Témoignages", href: "/admin/testimonials", icon: MessageSquare },
  { name: "Médias", href: "/admin/media", icon: Image },
  { name: "Messages", href: "/admin/messages", icon: Mail },
  { name: "Utilisateurs", href: "/admin/users", icon: Users },
  { name: "Paramètres", href: "/admin/settings", icon: Settings },
];

const Sidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link to="/admin" className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-primary" fill="currentColor" />
          <span className="font-bold text-sidebar-foreground">Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50"
          onClick={signOut}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
