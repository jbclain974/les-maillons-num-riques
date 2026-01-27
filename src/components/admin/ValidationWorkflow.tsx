import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
  ThumbsDown,
  ThumbsUp,
  XCircle,
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

export type ValidationStatus = 'draft' | 'pending_editor' | 'pending_admin' | 'published' | 'rejected';

interface ValidationWorkflowProps {
  currentStatus: ValidationStatus;
  onStatusChange: (newStatus: ValidationStatus, notes?: string) => Promise<void>;
  contentType: 'post' | 'event';
  reviewNotes?: string | null;
  rejectionReason?: string | null;
  disabled?: boolean;
}

const statusConfig: Record<ValidationStatus, { label: string; icon: React.ReactNode; color: string }> = {
  draft: { label: 'Brouillon', icon: <Clock className="h-4 w-4" />, color: 'bg-muted text-muted-foreground' },
  pending_editor: { label: 'En attente éditeur', icon: <AlertCircle className="h-4 w-4" />, color: 'bg-amber-100 text-amber-800' },
  pending_admin: { label: 'En attente admin', icon: <AlertCircle className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800' },
  published: { label: 'Publié', icon: <CheckCircle className="h-4 w-4" />, color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejeté', icon: <XCircle className="h-4 w-4" />, color: 'bg-red-100 text-red-800' },
};

export function ValidationWorkflow({
  currentStatus,
  onStatusChange,
  contentType,
  reviewNotes,
  rejectionReason,
  disabled = false,
}: ValidationWorkflowProps) {
  const { isAdmin, isEditor, canValidate } = usePermissions();
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const config = statusConfig[currentStatus];

  const handleAction = async (newStatus: ValidationStatus, notes?: string) => {
    setLoading(true);
    try {
      await onStatusChange(newStatus, notes);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    await handleAction('rejected', rejectNotes);
    setShowRejectDialog(false);
    setRejectNotes('');
  };

  // Determine available actions based on current status and user role
  const getAvailableActions = () => {
    const actions: React.ReactNode[] = [];

    if (disabled || loading) return actions;

    switch (currentStatus) {
      case 'draft':
        // Anyone can submit for review
        actions.push(
          <Button
            key="submit"
            onClick={() => handleAction('pending_editor')}
            className="bg-amber-500 hover:bg-amber-600 text-white"
            disabled={loading}
          >
            <Send className="mr-2 h-4 w-4" />
            Soumettre pour validation
          </Button>
        );
        break;

      case 'pending_editor':
        // Editor can approve (forward to admin) or reject
        if (isEditor || isAdmin) {
          actions.push(
            <Button
              key="approve-editor"
              onClick={() => handleAction('pending_admin', 'Approuvé par éditeur')}
              className="bg-blue-500 hover:bg-blue-600 text-white"
              disabled={loading}
            >
              <ThumbsUp className="mr-2 h-4 w-4" />
              Valider (→ Admin)
            </Button>
          );
          actions.push(
            <Button
              key="reject-editor"
              variant="destructive"
              onClick={() => setShowRejectDialog(true)}
              disabled={loading}
            >
              <ThumbsDown className="mr-2 h-4 w-4" />
              Rejeter
            </Button>
          );
        }
        break;

      case 'pending_admin':
        // Only admin can publish or reject
        if (isAdmin) {
          actions.push(
            <Button
              key="publish"
              onClick={() => handleAction('published', 'Publié par administrateur')}
              className="bg-green-500 hover:bg-green-600 text-white"
              disabled={loading}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Publier
            </Button>
          );
          actions.push(
            <Button
              key="reject-admin"
              variant="destructive"
              onClick={() => setShowRejectDialog(true)}
              disabled={loading}
            >
              <ThumbsDown className="mr-2 h-4 w-4" />
              Rejeter
            </Button>
          );
        }
        break;

      case 'rejected':
        // Can resubmit
        actions.push(
          <Button
            key="resubmit"
            onClick={() => handleAction('draft')}
            variant="outline"
            disabled={loading}
          >
            Repasser en brouillon
          </Button>
        );
        break;

      case 'published':
        // Admin can unpublish
        if (isAdmin) {
          actions.push(
            <Button
              key="unpublish"
              onClick={() => handleAction('draft')}
              variant="outline"
              disabled={loading}
            >
              Dépublier
            </Button>
          );
        }
        break;
    }

    return actions;
  };

  return (
    <>
      <Card className="border-l-4" style={{ borderLeftColor: config.color.includes('green') ? '#22c55e' : config.color.includes('amber') ? '#f59e0b' : config.color.includes('blue') ? '#3b82f6' : config.color.includes('red') ? '#ef4444' : '#6b7280' }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            {config.icon}
            Workflow de validation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Statut actuel:</span>
            <Badge className={config.color}>
              {config.icon}
              <span className="ml-1">{config.label}</span>
            </Badge>
          </div>

          {reviewNotes && currentStatus !== 'draft' && (
            <div className="rounded-md bg-muted p-3">
              <Label className="text-xs text-muted-foreground">Notes de révision</Label>
              <p className="text-sm mt-1">{reviewNotes}</p>
            </div>
          )}

          {rejectionReason && currentStatus === 'rejected' && (
            <div className="rounded-md bg-red-50 p-3 border border-red-200">
              <Label className="text-xs text-red-600">Raison du rejet</Label>
              <p className="text-sm mt-1 text-red-800">{rejectionReason}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {getAvailableActions()}
          </div>

          {/* Workflow diagram */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className={`flex flex-col items-center ${currentStatus === 'draft' ? 'text-primary font-medium' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${currentStatus === 'draft' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>1</div>
                <span className="mt-1">Brouillon</span>
              </div>
              <div className="flex-1 h-0.5 bg-muted mx-2" />
              <div className={`flex flex-col items-center ${currentStatus === 'pending_editor' ? 'text-amber-600 font-medium' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${currentStatus === 'pending_editor' ? 'bg-amber-500 text-white' : 'bg-muted'}`}>2</div>
                <span className="mt-1">Éditeur</span>
              </div>
              <div className="flex-1 h-0.5 bg-muted mx-2" />
              <div className={`flex flex-col items-center ${currentStatus === 'pending_admin' ? 'text-blue-600 font-medium' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${currentStatus === 'pending_admin' ? 'bg-blue-500 text-white' : 'bg-muted'}`}>3</div>
                <span className="mt-1">Admin</span>
              </div>
              <div className="flex-1 h-0.5 bg-muted mx-2" />
              <div className={`flex flex-col items-center ${currentStatus === 'published' ? 'text-green-600 font-medium' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${currentStatus === 'published' ? 'bg-green-500 text-white' : 'bg-muted'}`}>✓</div>
                <span className="mt-1">Publié</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter le contenu</DialogTitle>
            <DialogDescription>
              Expliquez la raison du rejet pour aider l'auteur à améliorer son contenu.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reject-reason">Raison du rejet</Label>
              <Textarea
                id="reject-reason"
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                placeholder="Expliquez pourquoi ce contenu est rejeté..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectNotes.trim()}>
              Confirmer le rejet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
