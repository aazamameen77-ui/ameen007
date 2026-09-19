import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  X,
  File,
  CheckCircle2,
  AlertCircle,
  Folder,
  ChevronRight,
  HardDrive,
  Sparkles,
} from 'lucide-react';
import { FolderItem, FileItem } from '../types';
import { formatBytes } from '../utils/formatters';
import { getFileTypeFromExtension, generateRandomId } from '../utils/fileHelpers';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: FolderItem[];
  currentFolderId: string | null;
  onUploadSuccess: (newFiles: FileItem[]) => void;
  onToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
}

interface PendingUpload {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  file?: File;
  dataUrl?: string;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  folders,
  currentFolderId,
  onUploadSuccess,
  onToast,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(currentFolderId);
  const [queue, setQueue] = useState<PendingUpload[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const processFiles = (fileList: FileList | File[]) => {
    const newItems: PendingUpload[] = Array.from(fileList).map((file) => ({
      id: generateRandomId('up'),
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      progress: 0,
      status: 'pending',
      file: file,
    }));

    setQueue((prev) => [...prev, ...newItems]);
    simulateUploads(newItems);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const simulateUploads = async (items: PendingUpload[]) => {
    setIsProcessing(true);
    const createdFiles: FileItem[] = [];

    for (const item of items) {
      // Read data URL if image or text
      let dataUrl: string | undefined = undefined;
      let contentPreview: string | undefined = undefined;

      if (item.file) {
        if (item.file.type.startsWith('image/')) {
          try {
            dataUrl = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = () => resolve('');
              reader.readAsDataURL(item.file!);
            });
          } catch {
            // fallback
          }
        } else if (item.file.type.includes('text') || item.file.name.endsWith('.md') || item.file.name.endsWith('.ts') || item.file.name.endsWith('.js') || item.file.name.endsWith('.json')) {
          try {
            contentPreview = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = () => resolve('');
              reader.readAsText(item.file!);
            });
          } catch {
            // fallback
          }
        }
      }

      // Smooth step progress simulation
      for (let p = 20; p <= 100; p += 20) {
        await new Promise((r) => setTimeout(r, 80));
        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, progress: p, status: p === 100 ? 'completed' : 'uploading' } : q))
        );
      }

      const extension = item.name.split('.').pop() || '';
      const fileType = getFileTypeFromExtension(extension);

      const newFileItem: FileItem = {
        id: generateRandomId('file'),
        name: item.name,
        size: item.size,
        type: fileType,
        mimeType: item.type,
        extension: extension,
        folderId: selectedFolderId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        starred: false,
        inTrash: false,
        sharedWith: [],
        url: dataUrl,
        contentPreview: contentPreview || (fileType === 'document' ? `Document: ${item.name}\nUploaded to CloudVault securely.` : undefined),
        ownerId: 'usr_sarah_jenkins',
        ownerName: 'Sarah Jenkins',
      };

      createdFiles.push(newFileItem);
    }

    setIsProcessing(false);
    onUploadSuccess(createdFiles);
    onToast(
      'success',
      'Uploads Complete',
      `Successfully uploaded ${createdFiles.length} ${createdFiles.length === 1 ? 'file' : 'files'} to ${
        selectedFolderId ? folders.find((f) => f.id === selectedFolderId)?.name : 'Root'
      }.`
    );
  };

  // Add realistic demo files
  const handleUploadDemoPack = () => {
    const demoItems: PendingUpload[] = [
      {
        id: generateRandomId('up_demo_1'),
        name: 'Brand_Identity_Sprint_2026.pdf',
        size: 3420000,
        type: 'application/pdf',
        progress: 0,
        status: 'pending',
      },
      {
        id: generateRandomId('up_demo_2'),
        name: 'App_Design_Tokens.json',
        size: 24500,
        type: 'application/json',
        progress: 0,
        status: 'pending',
      },
    ];
    setQueue((prev) => [...prev, ...demoItems]);
    simulateUploads(demoItems);
  };

  const nonTrashFolders = folders.filter((f) => !f.inTrash);

  return (
    <div
      id="upload-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="upload-modal-dialog"
        className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Upload to CloudVault</h3>
              <p className="text-xs text-slate-500">Drag files or choose from your computer</p>
            </div>
          </div>
          <button
            id="upload-modal-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close upload modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Destination folder picker */}
        <div className="px-6 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 flex items-center gap-1.5 font-medium">
            <Folder className="w-4 h-4 text-indigo-500" />
            Upload destination:
          </span>
          <select
            id="upload-destination-folder-select"
            value={selectedFolderId || ''}
            onChange={(e) => setSelectedFolderId(e.target.value || null)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
          >
            <option value="">Root Directory</option>
            {nonTrashFolders.map((f) => (
              <option key={f.id} value={f.id}>
                📁 {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dropzone Area */}
        <div className="p-6">
          <div
            id="upload-dropzone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
              isDragOver
                ? 'border-indigo-600 bg-indigo-50/60 scale-[1.01]'
                : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-3.5 shadow-2xs">
              <UploadCloud className="w-8 h-8 stroke-[1.8]" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">
              Choose files or drag and drop here
            </h4>
            <p className="text-xs text-slate-400 max-w-xs mb-4">
              Supports documents, photos, spreadsheets, audio, video, and archives up to 5 GB.
            </p>

            <button
              type="button"
              id="upload-browse-btn"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              Browse Files
            </button>
          </div>

          {/* Quick Demo Upload Helper */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 text-[11px]">
              <HardDrive className="w-3.5 h-3.5 text-slate-400" />
              100 GB available
            </span>
            <button
              id="upload-demo-pack-btn"
              onClick={handleUploadDemoPack}
              className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 text-[11px] cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              Upload sample pack
            </button>
          </div>

          {/* Active Upload Queue */}
          {queue.length > 0 && (
            <div className="mt-5 space-y-2 max-h-48 overflow-y-auto pr-1">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Uploading ({queue.length})
              </h5>
              {queue.map((item) => (
                <div
                  key={item.id}
                  id={`upload-item-${item.id}`}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                    <File className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs font-medium mb-1">
                      <span className="text-slate-800 truncate pr-2">{item.name}</span>
                      <span className="text-slate-500 shrink-0">
                        {item.status === 'completed' ? (
                          <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Done
                          </span>
                        ) : (
                          `${item.progress}%`
                        )}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-150 rounded-full ${
                          item.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            id="upload-modal-done-btn"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-colors"
          >
            {isProcessing ? 'Uploading in background...' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
