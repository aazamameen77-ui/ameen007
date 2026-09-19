import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="confirm-dialog-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="confirm-dialog-panel"
        className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div
            className={`w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
              isDestructive
                ? 'bg-rose-50 text-rose-600 border border-rose-100'
                : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
            }`}
          >
            <AlertTriangle className="w-6 h-6 stroke-[2]" />
          </div>

          <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-6">{message}</p>

          <div className="flex gap-2">
            <button
              id="confirm-dialog-cancel-btn"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              id="confirm-dialog-action-btn"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 py-2.5 rounded-xl text-white text-xs font-semibold transition-colors shadow-xs ${
                isDestructive
                  ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
