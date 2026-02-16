import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className={cn("w-full max-w-xl rounded-3xl bg-white p-6 shadow-soft", className)}>
        <div className="flex items-center justify-between">
          {title ? <h3 className="text-lg font-semibold">{title}</h3> : <span />}
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-100 text-brand-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
