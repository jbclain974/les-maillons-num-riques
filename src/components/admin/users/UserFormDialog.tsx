import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, UserPlus, Save, Crown, PenLine, Sparkles, Eye } from "lucide-react";

type AppRole = "admin" | "editor" | "animator" | "viewer";

interface UserFormData {
  email: string;
  full_name: string;
  password: string;
  role: AppRole;
}

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialData?: {
    id?: string;
    email?: string;
    full_name?: string;
    role?: AppRole;
  };
  onSubmit: (data: UserFormData & { id?: string }) => Promise<void>;
}

export const UserFormDialog = ({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
}: UserFormDialogProps) => {
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    full_name: "",
    password: "",
    role: "viewer",
  });
  const [loading, setLoading] = useState(false);

  // Reset form when dialog opens or initialData changes
  useEffect(() => {
    if (open) {
      setFormData({
        email: initialData?.email || "",
        full_name: initialData?.full_name || "",
        password: "",
        role: initialData?.role || "viewer",
      });
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        id: initialData?.id,
      });
      onOpenChange(false);
      setFormData({ email: "", full_name: "", password: "", role: "viewer" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "create" ? (
              <>
                <UserPlus className="h-5 w-5 text-primary" />
                Créer un utilisateur
              </>
            ) : (
              <>
                <Save className="h-5 w-5 text-primary" />
                Modifier l'utilisateur
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Créez un nouveau compte utilisateur avec un rôle assigné."
              : "Modifiez les informations de cet utilisateur."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nom complet</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
              placeholder="Jean Dupont"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="jean@exemple.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {mode === "create" ? "Mot de passe *" : "Nouveau mot de passe (optionnel)"}
            </Label>
            <Input
              id="password"
              type="password"
              required={mode === "create"}
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              placeholder={mode === "create" ? "••••••••" : "Laisser vide pour ne pas changer"}
              minLength={mode === "create" ? 6 : undefined}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select
              value={formData.role}
              onValueChange={(value: AppRole) => setFormData((prev) => ({ ...prev, role: value }))}
            >
              <SelectTrigger>
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
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {mode === "create" ? "Créer" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
