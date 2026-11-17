import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  title,
  subtitle,
  onClose,
  children,
}) => {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#10291f]/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-[540px] overflow-y-auto rounded-2xl border border-[#dce6df] bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-[#edf2ee] pb-4">
          <div>
            <h3
              id="modal-title"
              className="font-display text-lg font-bold text-[#162e23]"
            >
              {title}
            </h3>
            {subtitle && (
              <p className="mt-1 text-xs text-[#5d7266]">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup formulir"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#f2f6f3] text-[#455c50] transition-colors hover:bg-[#e5ece7] hover:text-[#162e23] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18794e]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
