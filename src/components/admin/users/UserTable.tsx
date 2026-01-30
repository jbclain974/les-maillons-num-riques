import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Crown,
  PenLine,
  Sparkles,
  Eye,
  MoreVertical,
  Key,
  Edit,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { roleConfig } from "./UserStatsCards";

type AppRole = "admin" | "editor" | "animator" | "viewer";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  is_account_active?: boolean;
}

interface UserTableProps {
  profiles: Profile[];
  roles: { [key: string]: string[] };
  onRoleChange: (userId: string, userName: string, newRole: AppRole) => void;
  onEdit: (profile: Profile) => void;
  onDelete: (profile: Profile) => void;
  onResetPassword: (profile: Profile) => void;
  onToggleActive: (profile: Profile) => void;
}

export const UserTable = ({
  profiles,
  roles,
  onRoleChange,
  onEdit,
  onDelete,
  onResetPassword,
  onToggleActive,
}: UserTableProps) => {
  const getRoleBadge = (userRoles: string[]) => {
    const role = (userRoles?.[0] as AppRole) || "viewer";
    const config = roleConfig[role] || roleConfig.viewer;
    const Icon = config.icon;

    return (
      <Badge className={`${config.bgColor} ${config.color} border gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200 gap-1">
          <UserCheck className="h-3 w-3" />
          Actif
        </Badge>
      );
    }
    return (
      <Badge className="bg-orange-100 text-orange-700 border-orange-200 gap-1">
        <UserX className="h-3 w-3" />
        Inactif
      </Badge>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Utilisateur</TableHead>
          <TableHead>Rôle</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Inscrit le</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {profiles.map((profile) => {
          const currentRole = (roles[profile.id]?.[0] as AppRole) || "viewer";
          const isActive = profile.is_account_active !== false;

          return (
            <TableRow key={profile.id} className={`hover:bg-muted/50 ${!isActive ? "opacity-60" : ""}`}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile.avatar_url || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold">
                      {(profile.full_name?.[0] || profile.email[0]).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {profile.full_name || "Utilisateur sans nom"}
                    </p>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Select
                  value={currentRole}
                  onValueChange={(value) =>
                    onRoleChange(profile.id, profile.full_name || profile.email, value as AppRole)
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      <span className="flex items-center gap-2">
                        <Crown className="h-3 w-3" /> Administrateur
                      </span>
                    </SelectItem>
                    <SelectItem value="editor">
                      <span className="flex items-center gap-2">
                        <PenLine className="h-3 w-3" /> Éditeur
                      </span>
                    </SelectItem>
                    <SelectItem value="animator">
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-3 w-3" /> Animateur
                      </span>
                    </SelectItem>
                    <SelectItem value="viewer">
                      <span className="flex items-center gap-2">
                        <Eye className="h-3 w-3" /> Lecteur
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>{getStatusBadge(isActive)}</TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(profile.created_at), "d MMM yyyy", { locale: fr })}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(profile)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onResetPassword(profile)}>
                      <Key className="h-4 w-4 mr-2" />
                      Reset mot de passe
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onToggleActive(profile)}>
                      {isActive ? (
                        <>
                          <UserX className="h-4 w-4 mr-2" />
                          Désactiver
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Réactiver
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(profile)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
