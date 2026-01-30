import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

interface AdminEditContextType {
  isAdmin: boolean;
  isEditor: boolean;
  isEditMode: boolean;
  toggleEditMode: () => void;
  setEditMode: (mode: boolean) => void;
  canEdit: boolean;
}

const AdminEditContext = createContext<AdminEditContextType | undefined>(undefined);

export const AdminEditProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsEditor(false);
        setIsEditMode(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error || !data) {
        setIsAdmin(false);
        setIsEditor(false);
        return;
      }

      const roles = data.map((r) => r.role);
      setIsAdmin(roles.includes("admin"));
      setIsEditor(roles.includes("editor") || roles.includes("admin"));
    };

    checkRole();
  }, [user]);

  const toggleEditMode = () => {
    if (isAdmin || isEditor) {
      setIsEditMode((prev) => !prev);
    }
  };

  const setEditMode = (mode: boolean) => {
    if (isAdmin || isEditor) {
      setIsEditMode(mode);
    }
  };

  // Can edit if user has rights AND edit mode is ON
  const canEdit = (isAdmin || isEditor) && isEditMode;

  return (
    <AdminEditContext.Provider
      value={{
        isAdmin,
        isEditor,
        isEditMode,
        toggleEditMode,
        setEditMode,
        canEdit,
      }}
    >
      {children}
    </AdminEditContext.Provider>
  );
};

export const useAdminEdit = () => {
  const context = useContext(AdminEditContext);
  if (context === undefined) {
    throw new Error("useAdminEdit must be used within an AdminEditProvider");
  }
  return context;
};
