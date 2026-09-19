import React, { useState } from 'react';
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  Folder,
  File,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { FileItem, FolderItem } from '../types';
import { formatBytes, formatDate } from '../utils/formatters';
import { ConfirmDialog } from './ConfirmDialog';

interface TrashViewProps {
  files: FileItem[];
  folders: FolderItem[];
  onRestoreFile: (fileId: string) => void;
  onRestoreFolder: (folderId: string) => void;
  onPermanentlyDeleteFile: (fileId: string) => void;
  onPermanentlyDeleteFolder: (folderId: string) => void;
  onEmptyTrash: () => void;
}

export const TrashView: React.FC<TrashViewProps> = ({
  files,
  folders,
  onRestoreFile,
  onRestoreFolder,
  onPermanentlyDeleteFile,
  onPermanentlyDeleteFolder,
  onEmptyTrash,
}) => {
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'file' | 'folder'; name: string } | null>(null);

  const trashFiles = files.filter((f) => f.inTrash);
  const trashFolders = folders.filter((f) => f.inTrash);
  const totalTrashCount = trashFiles.length + trashFolders.length;
  const totalTrashSize = trashFiles.reduce((acc, f) => acc + f.size, 0);

  return (
    <div id="trash-view-container" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-900">Items in Trash</h4>
            <p className="text-xs text-amber-700 mt-0.5">
              Files and folders in trash are automatically purged after 30 days. You can restore them or permanently remove them to free up storage.
            </p>
          </div>
        </div>

        {totalTrashCount > 0 && (
          <button
            id="empty-trash-top-btn"
            onClick={() => setShowEmptyConfirm(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            <span>Empty Trash ({formatBytes(totalTrashSize)})</span>
          </button>
        )}
      </div>

      {totalTrashCount === 0 ? (
        <div
          id="trash-empty-state"
          className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 text-slate-300 flex items-center justify-center mb-4">
            <Trash2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Trash is empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Items that you move to trash will show up here. You can safely restore them anytime within 30 days.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Folders in trash */}
          {trashFolders.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Folders in Trash ({trashFolders.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {trashFolders.map((folder) => (
                  <div
                    key={folder.id}
                    id={`trash-folder-card-${folder.id}`}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                        <Folder className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{folder.name}</p>
                        <p className="text-[10px] text-slate-400">
                          Deleted {folder.trashDate ? formatDate(folder.trashDate) : 'recently'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        id={`restore-folder-btn-${folder.id}`}
                        onClick={() => onRestoreFolder(folder.id)}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Restore folder"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        id={`delete-folder-forever-btn-${folder.id}`}
                        onClick={() => setItemToDelete({ id: folder.id, type: 'folder', name: folder.name })}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Permanently delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Files in trash */}
          {trashFiles.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Files in Trash ({trashFiles.length})
              </h4>
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-xs">
                {trashFiles.map((file) => (
                  <div
                    key={file.id}
                    id={`trash-file-row-${file.id}`}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                        <File className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{file.name}</p>
                        <p className="text-[11px] text-slate-400">
                          {formatBytes(file.size)} • Deleted {file.trashDate ? formatDate(file.trashDate) : 'recently'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        id={`restore-file-btn-${file.id}`}
                        onClick={() => onRestoreFile(file.id)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 text-xs font-semibold text-indigo-600 flex items-center gap-1.5 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restore</span>
                      </button>
                      <button
                        id={`delete-file-forever-btn-${file.id}`}
                        onClick={() => setItemToDelete({ id: file.id, type: 'file', name: file.name })}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={showEmptyConfirm}
        title="Empty Trash?"
        message={`Are you sure you want to permanently delete all ${totalTrashCount} items in the trash? This action cannot be undone.`}
        confirmLabel="Empty Trash"
        isDestructive={true}
        onConfirm={onEmptyTrash}
        onClose={() => setShowEmptyConfirm(false)}
      />

      <ConfirmDialog
        isOpen={!!itemToDelete}
        title={`Permanently delete "${itemToDelete?.name}"?`}
        message="This item will be deleted immediately and cannot be recovered."
        confirmLabel="Delete Forever"
        isDestructive={true}
        onConfirm={() => {
          if (!itemToDelete) return;
          if (itemToDelete.type === 'file') {
            onPermanentlyDeleteFile(itemToDelete.id);
          } else {
            onPermanentlyDeleteFolder(itemToDelete.id);
          }
          setItemToDelete(null);
        }}
        onClose={() => setItemToDelete(null)}
      />
    </div>
  );
};
