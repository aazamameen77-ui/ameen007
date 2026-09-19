import React, { useState, useEffect } from 'react';
import { Edit3, X } from 'lucide-react';
import { FileItem, FolderItem } from '../types';

interface RenameModalProps {
  item: FileItem | FolderItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRename: (id: string, newName: string) => void;
}

export const RenameModal: React.FC<RenameModalProps> = ({
  item,
  isOpen,
  onClose,
  onRename,
}) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (item) {
      setName(item.name);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onRename(item.id, name.trim());
      onClose();
    }
  };

  return (
    <div
      id="rename-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="rename-modal-dialog"
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Rename Item</h3>
          </div>
          <button
            id="rename-modal-close-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Enter new name
          </label>
          <input
            id="rename-input-field"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:bg-white"
          />

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              id="rename-cancel-btn"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="rename-save-btn"
              disabled={!name.trim()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
