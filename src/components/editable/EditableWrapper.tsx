import { ReactNode } from "react";
import { useAdminEdit } from "@/contexts/AdminEditContext";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";

interface EditableWrapperProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
  label?: string;
}

/**
 * A generic wrapper that adds edit mode styling to any element.
 * Use this for custom editing experiences where EditableText/EditableImage don't fit.
 */
const EditableWrapper = ({
  children,
  onClick,
  className,
  label = "Modifier",
}: EditableWrapperProps) => {
  const { canEdit } = useAdminEdit();

  if (!canEdit) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn(
        "relative cursor-pointer group transition-all duration-200",
        "outline outline-2 outline-dashed outline-transparent",
        "hover:outline-primary/50 hover:bg-primary/5 rounded-md",
        className
      )}
      onClick={onClick}
    >
      {children}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="absolute top-2 right-2 flex items-center gap-1.5 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium shadow-lg">
          <Pencil className="h-3 w-3" />
          {label}
        </span>
      </div>
    </div>
  );
};

export default EditableWrapper;
