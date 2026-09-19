import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Table2,
  FileCode,
  Film,
  Music,
  Archive,
  FileQuestion,
  MoreVertical,
  Star,
  Eye,
  Download,
  Share2,
  Edit2,
  FolderInput,
  Copy,
  Trash2,
  Presentation,
  Link,
  Folder,
} from 'lucide-react';
import { FileItem, FolderItem } from '../types';
import { formatBytes, formatDate } from '../utils/formatters';
import { getFileTypeStyles } from '../utils/fileHelpers';

interface FileRowProps {
  file: FileItem;
  folders: FolderItem[];
  onPreview: (file: FileItem) => void;
  onDownload: (file: FileItem) => void;
  onShare: (file: FileItem) => void;
  onRename: (file: FileItem) => void;
  onMove: (file: FileItem) => void;
  onCopy: (file: FileItem) => void;
  onStarToggle: (fileId: string) => void;
  onDelete: (fileId: string) => void;
}

export const FileRow: React.FC<FileRowProps> = ({
  file,
  folders,
  onPreview,
  onDownload,
  onShare,
  onRename,
  onMove,
  onCopy,
  onStarToggle,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const styles = getFileTypeStyles(file.type);
  const parentFolder = folders.find((f) => f.id === file.folderId);

  const renderFileIcon = () => {
    switch (file.type) {
      case 'image':
        return <ImageIcon className="w-4 h-4 text-emerald-500" />;
      case 'document':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'spreadsheet':
        return <Table2 className="w-4 h-4 text-teal-500" />;
      case 'presentation':
        return <Presentation className="w-4 h-4 text-amber-500" />;
      case 'video':
        return <Film className="w-4 h-4 text-rose-500" />;
      case 'audio':
        return <Music className="w-4 h-4 text-purple-500" />;
      case 'code':
        return <FileCode className="w-4 h-4 text-indigo-500" />;
      case 'archive':
        return <Archive className="w-4 h-4 text-orange-500" />;
      default:
        return <FileQuestion className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', file.id);
  };

  return (
    <div
      id={`file-row-${file.id}`}
      draggable
      onDragStart={handleDragStart}
      onClick={() => onPreview(file)}
      className="group flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-50/80 border-b border-slate-100 transition-colors cursor-pointer text-sm"
    >
      {/* Name and Icon */}
      <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
        <button
          id={`row-star-btn-${file.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onStarToggle(file.id);
          }}
          className={`p-1 rounded-md transition-colors ${
            file.starred
              ? 'text-amber-500'
              : 'text-slate-300 hover:text-slate-400 opacity-0 group-hover:opacity-100'
          }`}
          aria-label={file.starred ? 'Unstar' : 'Star'}
        >
          <Star className={`w-4 h-4 ${file.starred ? 'fill-current' : ''}`} />
        </button>

        <div className={`w-8 h-8 rounded-lg ${styles.bgLight} flex items-center justify-center shrink-0`}>
          {renderFileIcon()}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 group-hover:text-indigo-600 truncate">
              {file.name}
            </span>
            {file.shareLink?.enabled && (
              <span title="Public link enabled" className="text-indigo-500">
                <Link className="w-3 h-3" />
              </span>
            )}
          </div>
          {file.tags && file.tags.length > 0 && (
            <div className="flex items-center gap-1 mt-0.5 sm:hidden">
              <span className="text-[10px] text-slate-400">{file.tags[0]}</span>
            </div>
          )}
        </div>
      </div>

      {/* Location Folder */}
      <div className="hidden md:flex items-center gap-1.5 w-36 text-xs text-slate-500 truncate px-2">
        {parentFolder ? (
          <>
            <Folder className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">{parentFolder.name}</span>
          </>
        ) : (
          <span className="text-slate-400">Root Directory</span>
        )}
      </div>

      {/* File Size */}
      <div className="hidden sm:block w-24 text-right text-xs text-slate-500 font-medium px-2">
        {formatBytes(file.size)}
      </div>

      {/* Modified Date */}
      <div className="hidden lg:block w-28 text-right text-xs text-slate-400 px-2">
        {formatDate(file.updatedAt)}
      </div>

      {/* Shared Users */}
      <div className="hidden sm:flex items-center justify-end w-24 px-2">
        {file.sharedWith && file.sharedWith.length > 0 ? (
          <div className="flex -space-x-1.5 overflow-hidden">
            {file.sharedWith.slice(0, 2).map((u) => (
              <img
                key={u.id}
                src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                alt={u.name}
                title={u.name}
                className="inline-block h-5 w-5 rounded-full ring-1 ring-white object-cover"
              />
            ))}
          </div>
        ) : (
          <span className="text-[11px] text-slate-300">Only you</span>
        )}
      </div>

      {/* 3-dot Menu */}
      <div
        className="relative pl-2"
        ref={menuRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id={`row-menu-btn-${file.id}`}
          onClick={() => setShowMenu(!showMenu)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="File options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {showMenu && (
          <div
            id={`row-menu-dropdown-${file.id}`}
            className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100 text-xs"
          >
            <button
              id={`row-action-preview-${file.id}`}
              onClick={() => {
                setShowMenu(false);
                onPreview(file);
              }}
              className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
            >
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>Preview</span>
            </button>
            <button
              id={`row-action-download-${file.id}`}
              onClick={() => {
                setShowMenu(false);
                onDownload(file);
              }}
              className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Download</span>
            </button>
            <button
              id={`row-action-share-${file.id}`}
              onClick={() => {
                setShowMenu(false);
                onShare(file);
              }}
              className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Share & Link</span>
            </button>
            <div className="border-t border-slate-100 my-1" />
            <button
              id={`row-action-rename-${file.id}`}
              onClick={() => {
                setShowMenu(false);
                onRename(file);
              }}
              className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
            >
              <Edit2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Rename</span>
            </button>
            <button
              id={`row-action-move-${file.id}`}
              onClick={() => {
                setShowMenu(false);
                onMove(file);
              }}
              className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
            >
              <FolderInput className="w-3.5 h-3.5 text-slate-400" />
              <span>Move</span>
            </button>
            <button
              id={`row-action-copy-${file.id}`}
              onClick={() => {
                setShowMenu(false);
                onCopy(file);
              }}
              className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
            >
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Make a copy</span>
            </button>
            <div className="border-t border-slate-100 my-1" />
            <button
              id={`row-action-delete-${file.id}`}
              onClick={() => {
                setShowMenu(false);
                onDelete(file.id);
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
  );
};
