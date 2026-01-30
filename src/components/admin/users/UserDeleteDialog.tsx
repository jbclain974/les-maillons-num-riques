import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2, UserX, AlertTriangle } from "lucide-react";

interface UserDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  userEmail: string;
  onDelete: (hardDelete: boolean) => Promise<void>;
}

export const UserDeleteDialog = ({
  open,
  onOpenChange,
  userName,
  userEmail,
  onDelete,
}: UserDeleteDialogProps) => {
  const [deleteType, setDeleteType] = useState<"soft" | "hard">("soft");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(deleteType === "hard");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Supprimer l'utilisateur
          </DialogTitle>
          <DialogDescription>
            Vous êtes sur le point de supprimer <strong>{userName}</strong> ({userEmail}).
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup value={deleteType} onValueChange={(v: "soft" | "hard") => setDeleteType(v)}>
            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="soft" id="soft" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="soft" className="flex items-center gap-2 font-medium cursor-pointer">
                  <UserX className="h-4 w-4 text-muted-foreground" />
                  Désactiver le compte
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  L'utilisateur ne pourra plus se connecter mais ses données seront conservées.
                  Vous pourrez réactiver le compte ultérieurement.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-lg border border-destructive/30 hover:bg-destructive/5 transition-colors mt-2">
              <RadioGroupItem value="hard" id="hard" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="hard" className="flex items-center gap-2 font-medium cursor-pointer text-destructive">
                  <Trash2 className="h-4 w-4" />
                  Supprimer définitivement
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong className="text-destructive">Action irréversible.</strong> Toutes les données
                  de l'utilisateur seront supprimées de façon permanente.
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {deleteType === "soft" ? "Désactiver" : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
