import React, { useState } from 'react';
import {
  X,
  Download,
  Share2,
  Star,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Info,
  Copy,
  Check,
  FileText,
  Table2,
  FileCode,
  Film,
  Music,
  Archive,
  Calendar,
  HardDrive,
  Folder,
  Tag,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { FileItem, FolderItem } from '../types';
import { formatBytes, formatFullDateTime } from '../utils/formatters';

interface FilePreviewModalProps {
  file: FileItem | null;
  folders: FolderItem[];
  onClose: () => void;
  onDownload: (file: FileItem) => void;
  onShare: (file: FileItem) => void;
  onStarToggle: (fileId: string) => void;
  onAddTag?: (fileId: string, tag: string) => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  file,
  folders,
  onClose,
  onDownload,
  onShare,
  onStarToggle,
  onAddTag,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showInfoSidebar, setShowInfoSidebar] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  if (!file) return null;

  const parentFolder = folders.find((f) => f.id === file.folderId);

  const handleCopyContent = () => {
    if (file.contentPreview) {
      navigator.clipboard.writeText(file.contentPreview);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleAddTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagInput.trim() && onAddTag) {
      onAddTag(file.id, newTagInput.trim());
      setNewTagInput('');
    }
  };

  return (
    <div
      id="file-preview-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="file-preview-modal-dialog"
        className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-700/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="h-16 px-4 sm:px-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold truncate text-slate-100 max-w-xs sm:max-w-md">
                {file.name}
              </h3>
              <p className="text-xs text-slate-400">
                {formatBytes(file.size)} • {file.mimeType}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Star toggle */}
            <button
              id="preview-star-btn"
              onClick={() => onStarToggle(file.id)}
              className={`p-2 rounded-xl transition-colors ${
                file.starred
                  ? 'text-amber-400 hover:text-amber-300'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title={file.starred ? 'Starred' : 'Add to Starred'}
            >
              <Star className={`w-4 h-4 ${file.starred ? 'fill-current' : ''}`} />
            </button>

            {/* Share button */}
            <button
              id="preview-share-btn"
              onClick={() => onShare(file)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Share file"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Download button */}
            <button
              id="preview-download-btn"
              onClick={() => onDownload(file)}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-xs"
              title="Download file"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* Info toggle button */}
            <button
              id="preview-info-toggle-btn"
              onClick={() => setShowInfoSidebar(!showInfoSidebar)}
              className={`p-2 rounded-xl transition-colors ${
                showInfoSidebar
                  ? 'bg-slate-800 text-indigo-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Toggle details panel"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Close button */}
            <button
              id="preview-close-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body with optional right sidebar */}
        <div className="flex-1 flex overflow-hidden bg-slate-950/95 relative">
          {/* Main Viewer Area */}
          <div className="flex-1 flex flex-col justify-between overflow-auto p-4 relative">
            {/* Viewer Controls for image/document */}
            {file.type === 'image' && (
              <div className="absolute top-6 left-6 z-20 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md border border-slate-700 p-1 rounded-xl shadow-lg text-white">
                <button
                  id="preview-zoom-in-btn"
                  onClick={() => setZoom((prev) => Math.min(prev + 0.25, 3))}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white"
                  title="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <span className="text-xs px-2 font-mono text-slate-400">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  id="preview-zoom-out-btn"
                  onClick={() => setZoom((prev) => Math.max(prev - 0.25, 0.5))}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white"
                  title="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-slate-700 mx-1" />
                <button
                  id="preview-rotate-btn"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white"
                  title="Rotate clockwise"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Viewer Content Renderers */}
            <div className="flex-1 flex items-center justify-center min-h-[350px]">
              {/* 1. Image Viewer */}
              {file.type === 'image' && (
                <div className="overflow-auto max-h-full max-w-full flex items-center justify-center p-4">
                  <img
                    src={file.url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'}
                    alt={file.name}
                    className="max-h-[68vh] max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-200"
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    }}
                  />
                </div>
              )}

              {/* 2. Video Player */}
              {file.type === 'video' && (
                <div className="w-full max-w-3xl flex flex-col items-center">
                  <video
                    controls
                    className="w-full max-h-[65vh] rounded-2xl shadow-2xl border border-slate-800 bg-black"
                    src={file.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                  >
                    Your browser does not support the video tag.
                  </video>
                  <p className="text-xs text-slate-400 mt-3">
                    Playback supported with adaptive streaming
                  </p>
                </div>
              )}

              {/* 3. Audio Player */}
              {file.type === 'audio' && (
                <div className="w-full max-w-xl bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl text-center">
                  <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-5">
                    <Music className="w-10 h-10" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">{file.name}</h4>
                  <p className="text-xs text-slate-400 mb-6">Duration: {file.duration || '03:45'}</p>

                  <audio
                    controls
                    className="w-full"
                    src={file.url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'}
                  >
                    Your browser does not support audio playback.
                  </audio>
                </div>
              )}

              {/* 4. Code & Text Viewer */}
              {file.type === 'code' && (
                <div className="w-full max-w-4xl h-full bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden text-left shadow-2xl">
                  <div className="h-10 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400">{file.name}</span>
                    <button
                      id="copy-code-preview-btn"
                      onClick={handleCopyContent}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="flex-1 p-5 overflow-auto font-mono text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900">
                    <code>{file.contentPreview || '// No code preview available.'}</code>
                  </pre>
                </div>
              )}

              {/* 5. Spreadsheets Viewer */}
              {file.type === 'spreadsheet' && (
                <div className="w-full max-w-4xl h-full bg-white rounded-2xl flex flex-col overflow-hidden text-left shadow-2xl">
                  <div className="p-3.5 bg-teal-50 border-b border-teal-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Table2 className="w-4 h-4 text-teal-600" />
                      <span className="text-xs font-bold text-teal-900">Sheet Preview: Sheet1</span>
                    </div>
                    <span className="text-xs text-teal-700">Read-Only Grid</span>
                  </div>
                  <div className="flex-1 p-4 overflow-auto">
                    {file.contentPreview ? (
                      <table className="w-full text-xs text-left border-collapse border border-slate-200">
                        <tbody>
                          {file.contentPreview.split('\n').map((row, rIdx) => {
                            const cells = row.split('|').map((c) => c.trim());
                            return (
                              <tr
                                key={rIdx}
                                className={rIdx === 0 ? 'bg-slate-100 font-bold text-slate-900' : 'hover:bg-slate-50'}
                              >
                                {cells.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className="p-2.5 border border-slate-200 text-slate-700"
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <div className="py-12 text-center text-slate-400 text-sm">
                        No tabular data preview available.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 6. Document / Presentation / Archive Fallback */}
              {(file.type === 'document' || file.type === 'presentation' || file.type === 'archive' || file.type === 'other') && (
                <div className="w-full max-w-3xl bg-white rounded-2xl p-8 shadow-2xl flex flex-col max-h-[75vh] overflow-hidden text-left">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{file.name}</h4>
                      <p className="text-xs text-slate-500">Document Reader Preview</p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto py-5 pr-2">
                    {file.contentPreview ? (
                      <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {file.contentPreview}
                      </div>
                    ) : (
                      <div className="py-12 text-center text-slate-400">
                        <p className="text-sm">Standard binary package document.</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Click "Download" above to inspect locally.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Inspector Sidebar */}
          {showInfoSidebar && (
            <div
              id="preview-inspector-sidebar"
              className="w-80 bg-white border-l border-slate-200 flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right-10 duration-200"
            >
              <div className="p-5 space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    File Properties
                  </h4>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                        Size
                      </span>
                      <span className="font-semibold text-slate-800">{formatBytes(file.size)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Folder className="w-3.5 h-3.5 text-slate-400" />
                        Location
                      </span>
                      <span className="font-semibold text-slate-800 truncate max-w-[140px]">
                        {parentFolder ? parentFolder.name : 'Root'}
                      </span>
                    </div>

                    {file.dimensions && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Dimensions</span>
                        <span className="font-semibold text-slate-800">{file.dimensions}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Last Modified
                      </span>
                      <span className="font-semibold text-slate-800">
                        {formatFullDateTime(file.updatedAt)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Owner</span>
                      <span className="font-semibold text-slate-800">{file.ownerName}</span>
                    </div>
                  </div>
                </div>

                {/* Tags section */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center justify-between">
                    <span>Tags</span>
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                  </h4>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {file.tags && file.tags.length > 0 ? (
                      file.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium"
                        >
                          #{t}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400">No tags added</span>
                    )}
                  </div>
                  {onAddTag && (
                    <form onSubmit={handleAddTagSubmit} className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Add a tag..."
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        className="flex-1 px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
                      />
                      <button
                        type="submit"
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                      >
                        Add
                      </button>
                    </form>
                  )}
                </div>

                {/* Sharing status */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Access & Sharing
                  </h4>
                  {file.shareLink?.enabled ? (
                    <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs">
                      <div className="flex items-center gap-1.5 text-indigo-700 font-semibold mb-1">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Public Link Active</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Accessed {file.shareLink.accessCount || 0} times
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Restricted to workspace members.</p>
                  )}

                  <button
                    id="preview-manage-share-btn"
                    onClick={() => onShare(file)}
                    className="w-full mt-3 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Manage Access</span>
                  </button>
                </div>
              </div>

              {/* Bottom Security verification */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Encrypted at rest & transit</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
