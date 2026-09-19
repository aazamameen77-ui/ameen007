import React, { useState, useRef, useEffect } from 'react';
import {
  Folder,
  MoreVertical,
  Star,
  Edit2,
  Trash2,
  FolderInput,
  FolderOpen,
  Share2,
} from 'lucide-react';
import { FolderItem, FileItem } from '../types';
import { formatBytes } from '../utils/formatters';

interface FolderCardProps {
  folder: FolderItem;
  files: FileItem[];
  allFolders: FolderItem[];
  onClick: (folder: FolderItem) => void;
  onStarToggle: (folderId: string) => void;
  onRename: (folder: FolderItem) => void;
  onMove: (folder: FolderItem) => void;
  onDelete: (folderId: string) => void;
  onDropFilesIntoFolder?: (files: FileList | FileItem[], targetFolderId: string) => void;
}

export const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  files,
  onClick,
  onStarToggle,
  onRename,
  onMove,
  onDelete,
  onDropFilesIntoFolder,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Files currently contained in this folder (excluding trash)
  const folderFiles = files.filter((f) => f.folderId === folder.id && !f.inTrash);
  const totalSize = folderFiles.reduce((acc, f) => acc + f.size, 0);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    // If external files dropped
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && onDropFilesIntoFolder) {
      onDropFilesIntoFolder(e.dataTransfer.files, folder.id);
      return;
    }

    // If internal file dragged
    const draggedFileId = e.dataTransfer.getData('text/plain');
    if (draggedFileId && onDropFilesIntoFolder) {
      const match = files.find((f) => f.id === draggedFileId);
      if (match) {
        onDropFilesIntoFolder([match], folder.id);
      }
    }
  };

  // Color configurations
  const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-100' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-100' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100' },
    rose: { bg: 'bg-rose-50', icon: 'text-rose-600', border: 'border-rose-100' },
    slate: { bg: 'bg-slate-50', icon: 'text-slate-600', border: 'border-slate-200' },
  };

  const activeColor = colorMap[folder.color || 'indigo'] || colorMap.indigo;

  return (
    <div
      id={`folder-card-${folder.id}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group relative bg-white rounded-2xl p-4 border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md ${
        isDragOver
          ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02] ring-2 ring-indigo-500/20'
          : 'border-slate-200/80 hover:border-indigo-200'
      }`}
      onClick={() => onClick(folder)}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div
          className={`w-11 h-11 rounded-xl ${activeColor.bg} ${activeColor.border} border flex items-center justify-center ${activeColor.icon} shadow-2xs group-hover:scale-105 transition-transform`}
        >
          <Folder className="w-5 h-5 fill-current" />
        </div>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            id={`folder-star-btn-${folder.id}`}
            onClick={() => onStarToggle(folder.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              folder.starred
                ? 'text-amber-500 hover:text-amber-600'
                : 'text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100'
            }`}
            aria-label={folder.starred ? 'Unstar folder' : 'Star folder'}
          >
            <Star className={`w-4 h-4 ${folder.starred ? 'fill-current' : ''}`} />
          </button>

          {/* 3-dot Action Menu */}
          <div className="relative" ref={menuRef}>
            <button
              id={`folder-menu-btn-${folder.id}`}
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Folder options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div
                id={`folder-menu-dropdown-${folder.id}`}
                className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100 text-xs"
              >
                <button
                  id={`folder-action-open-${folder.id}`}
                  onClick={() => {
                    setShowMenu(false);
                    onClick(folder);
                  }}
                  className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span>Open Folder</span>
                </button>
                <button
                  id={`folder-action-rename-${folder.id}`}
                  onClick={() => {
                    setShowMenu(false);
                    onRename(folder);
                  }}
                  className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Rename</span>
                </button>
                <button
                  id={`folder-action-move-${folder.id}`}
                  onClick={() => {
                    setShowMenu(false);
                    onMove(folder);
                  }}
                  className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <FolderInput className="w-3.5 h-3.5 text-slate-400" />
                  <span>Move</span>
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  id={`folder-action-delete-${folder.id}`}
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(folder.id);
                  }}
                  className="w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Move to Trash</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <h4 className="text-sm font-bold text-slate-900 truncate mb-1" title={folder.name}>
        {folder.name}
      </h4>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{folderFiles.length} {folderFiles.length === 1 ? 'file' : 'files'}</span>
        <span>{formatBytes(totalSize)}</span>
      </div>
    </div>
  );
};
