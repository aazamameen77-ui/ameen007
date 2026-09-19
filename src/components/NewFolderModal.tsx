import React, { useState } from 'react';
import { FolderPlus, X } from 'lucide-react';
import { FolderItem } from '../types';

interface NewFolderModalProps {
  isOpen: boolean;
  currentFolderId: string | null;
  onClose: () => void;
  onCreateFolder: (name: string, color: string, parentId: string | null) => void;
}

export const NewFolderModal: React.FC<NewFolderModalProps> = ({
  isOpen,
  currentFolderId,
  onClose,
  onCreateFolder,
}) => {
  const [folderName, setFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState('indigo');

  if (!isOpen) return null;

  const colors = [
    { id: 'indigo', name: 'Indigo', bg: 'bg-indigo-500' },
    { id: 'emerald', name: 'Emerald', bg: 'bg-emerald-500' },
    { id: 'amber', name: 'Amber', bg: 'bg-amber-500' },
    { id: 'blue', name: 'Sky Blue', bg: 'bg-blue-500' },
    { id: 'rose', name: 'Rose', bg: 'bg-rose-500' },
    { id: 'slate', name: 'Slate', bg: 'bg-slate-500' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      onCreateFolder(folderName.trim(), selectedColor, currentFolderId);
      setFolderName('');
      onClose();
    }
  };

  return (
    <div
      id="new-folder-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="new-folder-modal-dialog"
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FolderPlus className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Create New Folder</h3>
          </div>
          <button
            id="new-folder-close-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Folder name
          </label>
          <input
            id="new-folder-name-input"
            type="text"
            placeholder="e.g. Q4 Deliverables, Client Files"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            autoFocus
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:bg-white mb-4"
          />

          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Folder accent color
          </label>
          <div className="flex items-center gap-2.5 mb-6">
            {colors.map((c) => (
              <button
                key={c.id}
                type="button"
                id={`folder-color-select-${c.id}`}
                onClick={() => setSelectedColor(c.id)}
                className={`w-7 h-7 rounded-full ${c.bg} transition-transform ${
                  selectedColor === c.id
                    ? 'ring-2 ring-offset-2 ring-indigo-600 scale-110'
                    : 'opacity-70 hover:opacity-100 hover:scale-105'
                }`}
                title={c.name}
              />
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              id="new-folder-cancel-btn"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="new-folder-create-submit-btn"
              disabled={!folderName.trim()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              Create Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
