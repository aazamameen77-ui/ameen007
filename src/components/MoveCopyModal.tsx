import React, { useState } from 'react';
import { FolderInput, X, Folder, ChevronRight, Copy } from 'lucide-react';
import { FileItem, FolderItem } from '../types';

interface MoveCopyModalProps {
  item: FileItem | FolderItem | null;
  isOpen: boolean;
  folders: FolderItem[];
  currentFolderId: string | null;
  isCopyMode?: boolean;
  onClose: () => void;
  onExecute: (itemId: string, destinationFolderId: string | null, isCopy: boolean) => void;
}

export const MoveCopyModal: React.FC<MoveCopyModalProps> = ({
  item,
  isOpen,
  folders,
  currentFolderId,
  isCopyMode = false,
  onClose,
  onExecute,
}) => {
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [asCopy, setAsCopy] = useState(isCopyMode);

  if (!isOpen || !item) return null;

  // Filter out the item itself if it's a folder, plus any in trash
  const eligibleFolders = folders.filter((f) => !f.inTrash && f.id !== item.id);

  const handleConfirm = () => {
    onExecute(item.id, selectedTargetId, asCopy);
    onClose();
  };

  return (
    <div
      id="move-copy-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="move-copy-modal-dialog"
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              {asCopy ? <Copy className="w-4 h-4" /> : <FolderInput className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {asCopy ? 'Copy' : 'Move'} "{item.name}"
              </h3>
              <p className="text-xs text-slate-500">Choose destination directory</p>
            </div>
          </div>
          <button
            id="move-copy-close-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {/* Action Mode Toggle */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-4 text-xs font-semibold">
            <button
              type="button"
              id="mode-move-tab"
              onClick={() => setAsCopy(false)}
              className={`flex-1 py-1.5 rounded-lg transition-colors ${
                !asCopy ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Move
            </button>
            <button
              type="button"
              id="mode-copy-tab"
              onClick={() => setAsCopy(true)}
              className={`flex-1 py-1.5 rounded-lg transition-colors ${
                asCopy ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Make a Copy
            </button>
          </div>

          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Select Destination Folder
          </label>

          <div className="space-y-1.5 max-h-56 overflow-y-auto border border-slate-200 rounded-2xl p-2 bg-slate-50/50">
            {/* Root item */}
            <div
              id="destination-root-btn"
              onClick={() => setSelectedTargetId(null)}
              className={`p-2.5 rounded-xl flex items-center justify-between text-xs font-medium cursor-pointer transition-colors ${
                selectedTargetId === null
                  ? 'bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-slate-400" />
                <span>Root (Home)</span>
              </div>
              {selectedTargetId === null && <span className="text-[11px] text-indigo-600">Selected</span>}
            </div>

            {eligibleFolders.map((f) => (
              <div
                key={f.id}
                id={`destination-folder-${f.id}`}
                onClick={() => setSelectedTargetId(f.id)}
                className={`p-2.5 rounded-xl flex items-center justify-between text-xs font-medium cursor-pointer transition-colors ${
                  selectedTargetId === f.id
                    ? 'bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-indigo-500" />
                  <span>{f.name}</span>
                </div>
                {selectedTargetId === f.id && (
                  <span className="text-[11px] text-indigo-600">Selected</span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              id="move-copy-cancel-btn"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              id="move-copy-confirm-btn"
              onClick={handleConfirm}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              {asCopy ? 'Copy Here' : 'Move Here'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
