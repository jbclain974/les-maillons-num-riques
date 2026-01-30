import { useAdminEdit } from "@/contexts/AdminEditContext";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { 
  Edit3, 
  Eye, 
  LayoutDashboard, 
  Settings, 
  Menu, 
  Image, 
  FileText,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

const FloatingDock = () => {
  const { isAdmin, isEditor, isEditMode, toggleEditMode } = useAdminEdit();
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show for admins and editors
  if (!isAdmin && !isEditor) return null;

  const quickLinks = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Menu, label: "Navigation", href: "/admin/navigation" },
    { icon: Image, label: "Médias", href: "/admin/media" },
    { icon: FileText, label: "Pages", href: "/admin/pages" },
    { icon: Settings, label: "Paramètres", href: "/admin/settings" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
      <div
        className={cn(
          "bg-card/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl transition-all duration-300 ease-out",
          isExpanded ? "px-6 py-4" : "px-4 py-3"
        )}
      >
        <div className="flex items-center gap-4">
          {/* Toggle expand button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <X className="h-4 w-4" />
            ) : (
              <LayoutDashboard className="h-4 w-4" />
            )}
          </Button>

          {/* Quick links - only when expanded */}
          {isExpanded && (
            <div className="flex items-center gap-2 border-r border-border pr-4">
              {quickLinks.map((link) => (
                <Link key={link.href} to={link.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 gap-1.5 text-xs"
                  >
                    <link.icon className="h-3.5 w-3.5" />
                    <span className="hidden xl:inline">{link.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          )}

          {/* Edit mode toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {isEditMode ? (
                <Edit3 className="h-4 w-4 text-primary animate-pulse" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm font-medium whitespace-nowrap">
                {isEditMode ? "Mode Édition" : "Mode Lecture"}
              </span>
            </div>
            <Switch
              checked={isEditMode}
              onCheckedChange={toggleEditMode}
              className={cn(
                "data-[state=checked]:bg-primary",
                isEditMode && "ring-2 ring-primary/30"
              )}
            />
          </div>

          {/* Status indicator */}
          <div
            className={cn(
              "h-2 w-2 rounded-full transition-colors",
              isEditMode
                ? "bg-primary animate-pulse"
                : "bg-muted-foreground/50"
            )}
          />
        </div>

        {/* Edit mode helper text */}
        {isEditMode && (
          <div className="mt-2 pt-2 border-t border-border text-xs text-muted-foreground text-center">
            Cliquez sur les éléments avec un contour pour les modifier
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingDock;
