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
  Link,
  Presentation,
} from 'lucide-react';
import { FileItem } from '../types';
import { formatBytes, formatDate } from '../utils/formatters';
import { getFileTypeStyles } from '../utils/fileHelpers';

interface FileCardProps {
  file: FileItem;
  onPreview: (file: FileItem) => void;
  onDownload: (file: FileItem) => void;
  onShare: (file: FileItem) => void;
  onRename: (file: FileItem) => void;
  onMove: (file: FileItem) => void;
  onCopy: (file: FileItem) => void;
  onStarToggle: (fileId: string) => void;
  onDelete: (fileId: string) => void;
}

export const FileCard: React.FC<FileCardProps> = ({
  file,
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

  const renderFileIcon = () => {
    switch (file.type) {
      case 'image':
        return <ImageIcon className="w-8 h-8 text-emerald-500 stroke-[1.75]" />;
      case 'document':
        return <FileText className="w-8 h-8 text-blue-500 stroke-[1.75]" />;
      case 'spreadsheet':
        return <Table2 className="w-8 h-8 text-teal-500 stroke-[1.75]" />;
      case 'presentation':
        return <Presentation className="w-8 h-8 text-amber-500 stroke-[1.75]" />;
      case 'video':
        return <Film className="w-8 h-8 text-rose-500 stroke-[1.75]" />;
      case 'audio':
        return <Music className="w-8 h-8 text-purple-500 stroke-[1.75]" />;
      case 'code':
        return <FileCode className="w-8 h-8 text-indigo-500 stroke-[1.75]" />;
      case 'archive':
        return <Archive className="w-8 h-8 text-orange-500 stroke-[1.75]" />;
      default:
        return <FileQuestion className="w-8 h-8 text-slate-400 stroke-[1.75]" />;
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', file.id);
  };

  return (
    <div
      id={`file-card-${file.id}`}
      draggable
      onDragStart={handleDragStart}
      onClick={() => onPreview(file)}
      className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer shadow-xs"
    >
      {/* Thumbnail or Visual Card Header */}
      <div className={`relative w-full h-36 ${styles.bgLight} flex items-center justify-center overflow-hidden border-b border-slate-100`}>
        {file.type === 'image' && file.url ? (
          <img
            src={file.url}
            alt={file.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5 p-4 text-center">
            {renderFileIcon()}
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${styles.badgeBg} ${styles.badgeText}`}>
              .{file.extension}
            </span>
          </div>
        )}

        {/* Hover preview overlay for images */}
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-white/95 text-slate-800 text-xs font-semibold shadow-sm flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            Quick Preview
          </span>
        </div>

        {/* Top Floating Controls: Star & 3-dot Menu */}
        <div
          className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            id={`file-star-btn-${file.id}`}
            onClick={() => onStarToggle(file.id)}
            className={`p-1.5 rounded-lg bg-white/90 backdrop-blur-xs shadow-2xs transition-all ${
              file.starred
                ? 'text-amber-500 hover:text-amber-600'
                : 'text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100'
            }`}
            aria-label={file.starred ? 'Unstar file' : 'Star file'}
          >
            <Star className={`w-3.5 h-3.5 ${file.starred ? 'fill-current' : ''}`} />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              id={`file-menu-btn-${file.id}`}
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg bg-white/90 backdrop-blur-xs shadow-2xs text-slate-600 hover:text-slate-900 hover:bg-white transition-all"
              aria-label="File options"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <div
                id={`file-menu-dropdown-${file.id}`}
                className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100 text-xs"
              >
                <button
                  id={`file-action-preview-${file.id}`}
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
                  id={`file-action-download-${file.id}`}
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
                  id={`file-action-share-${file.id}`}
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
                  id={`file-action-rename-${file.id}`}
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
                  id={`file-action-move-${file.id}`}
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
                  id={`file-action-copy-${file.id}`}
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
                  id={`file-action-delete-${file.id}`}
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

        {/* Top-left Indicator if link is shared */}
        {file.shareLink?.enabled && (
          <div
            title="Public link active"
            className="absolute top-2.5 left-2.5 p-1 rounded-md bg-indigo-600 text-white shadow-xs"
          >
            <Link className="w-3 h-3" />
          </div>
        )}
      </div>

      {/* Card Body with File Meta */}
      <div className="p-3.5 flex flex-col justify-between flex-1">
        <div>
          <h4
            className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors"
            title={file.name}
          >
            {file.name}
          </h4>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>{formatBytes(file.size)}</span>
            <span>{formatDate(file.updatedAt)}</span>
          </p>
        </div>

        {/* Collaborators / Shared avatars */}
        {file.sharedWith && file.sharedWith.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">Shared with</span>
            <div className="flex -space-x-1.5 overflow-hidden">
              {file.sharedWith.slice(0, 3).map((u) => (
                <img
                  key={u.id}
                  src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                  alt={u.name}
                  title={u.name}
                  className="inline-block h-4 w-4 rounded-full ring-1 ring-white object-cover"
                />
              ))}
              {file.sharedWith.length > 3 && (
                <span className="flex items-center justify-center h-4 w-4 rounded-full bg-slate-200 text-[8px] font-bold text-slate-600 ring-1 ring-white">
                  +{file.sharedWith.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
