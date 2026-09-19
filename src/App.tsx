import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Upload,
  FolderPlus,
  Grid,
  List,
  ArrowUpDown,
  Filter,
  ChevronRight,
  Folder,
  Clock,
  Star,
  Users2,
  Trash2,
  HardDrive,
  LayoutDashboard,
  Search,
  Sparkles,
  ArrowLeft,
  SlidersHorizontal,
  FolderOpen,
  Check,
  Plus,
} from 'lucide-react';
import {
  FileItem,
  FolderItem,
  User,
  NavigationTab,
  ViewMode,
  SortField,
  SortDirection,
  FileType,
  ToastNotification,
  AppNotification,
  FileCollaborator,
} from './types';
import {
  initialUser,
  initialFolders,
  initialFiles,
  initialNotifications,
} from './data/initialData';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { StorageCard } from './components/StorageCard';
import { FolderCard } from './components/FolderCard';
import { FileCard } from './components/FileCard';
import { FileRow } from './components/FileRow';
import { FilePreviewModal } from './components/FilePreviewModal';
import { UploadModal } from './components/UploadModal';
import { ShareModal } from './components/ShareModal';
import { MoveCopyModal } from './components/MoveCopyModal';
import { RenameModal } from './components/RenameModal';
import { NewFolderModal } from './components/NewFolderModal';
import { TrashView } from './components/TrashView';
import { StorageAnalyticsView } from './components/StorageAnalyticsView';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import { HelpModal } from './components/HelpModal';
import { ToastContainer } from './components/ToastContainer';
import { downloadFile, generateRandomId } from './utils/fileHelpers';
import { formatBytes } from './utils/formatters';

export default function App() {
  // State Initialization from LocalStorage or seed data
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('cv_user');
    return saved ? JSON.parse(saved) : initialUser;
  });

  const [folders, setFolders] = useState<FolderItem[]>(() => {
    const saved = localStorage.getItem('cv_folders');
    return saved ? JSON.parse(saved) : initialFolders;
  });

  const [files, setFiles] = useState<FileItem[]>(() => {
    const saved = localStorage.getItem('cv_files');
    return saved ? JSON.parse(saved) : initialFiles;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('cv_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<FileType | 'all'>('all');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [shareItem, setShareItem] = useState<{ item: FileItem | FolderItem; isFolder: boolean } | null>(null);
  const [renameItem, setRenameItem] = useState<FileItem | FolderItem | null>(null);
  const [moveCopyItem, setMoveCopyItem] = useState<{ item: FileItem | FolderItem; isCopy: boolean } | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Window drag over overlay state
  const [isWindowDragOver, setIsWindowDragOver] = useState(false);
  const dragCounterRef = useRef(0);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('cv_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('cv_folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem('cv_files', JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem('cv_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Recalculate used storage on files change
  useEffect(() => {
    const activeBytes = files.filter((f) => !f.inTrash).reduce((sum, f) => sum + f.size, 0);
    setUser((prev) => ({ ...prev, usedStorage: activeBytes }));
  }, [files]);

  // Helper toast dispatcher
  const addToast = (
    type: 'success' | 'error' | 'info' | 'warning',
    title: string,
    message?: string
  ) => {
    const id = generateRandomId('toast');
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Window Drag & Drop handlers
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounterRef.current += 1;
      if (e.dataTransfer && e.dataTransfer.types.includes('Files')) {
        setIsWindowDragOver(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounterRef.current -= 1;
      if (dragCounterRef.current <= 0) {
        setIsWindowDragOver(false);
        dragCounterRef.current = 0;
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounterRef.current = 0;
      setIsWindowDragOver(false);
      if (e.dataTransfer && e.dataTransfer.files.length > 0) {
        setIsUploadOpen(true);
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  // Notifications handlers
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('info', 'Notifications cleared', 'All notifications marked as read.');
  };

  // File and Folder Actions
  const handleStarToggleFile = (fileId: string) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === fileId) {
          const next = !f.starred;
          addToast('info', next ? 'Added to Starred' : 'Removed from Starred', f.name);
          return { ...f, starred: next };
        }
        return f;
      })
    );
  };

  const handleStarToggleFolder = (folderId: string) => {
    setFolders((prev) =>
      prev.map((f) => {
        if (f.id === folderId) {
          const next = !f.starred;
          addToast('info', next ? 'Folder Starred' : 'Folder Unstarred', f.name);
          return { ...f, starred: next };
        }
        return f;
      })
    );
  };

  const handleDeleteFile = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? { ...f, inTrash: true, trashDate: new Date().toISOString() }
          : f
      )
    );
    addToast('warning', 'Moved to Trash', `"${file.name}" was moved to Trash.`);
  };

  const handleDeleteFolder = (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return;

    // Move folder and its files to trash
    setFolders((prev) =>
      prev.map((f) =>
        f.id === folderId
          ? { ...f, inTrash: true, trashDate: new Date().toISOString() }
          : f
      )
    );
    setFiles((prev) =>
      prev.map((f) =>
        f.folderId === folderId
          ? { ...f, inTrash: true, trashDate: new Date().toISOString() }
          : f
      )
    );
    addToast('warning', 'Folder Moved to Trash', `"${folder.name}" and contents moved to Trash.`);
  };

  const handleRestoreFile = (fileId: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, inTrash: false, trashDate: undefined } : f
      )
    );
    addToast('success', 'Restored', 'File restored successfully.');
  };

  const handleRestoreFolder = (folderId: string) => {
    setFolders((prev) =>
      prev.map((f) =>
        f.id === folderId ? { ...f, inTrash: false, trashDate: undefined } : f
      )
    );
    setFiles((prev) =>
      prev.map((f) =>
        f.folderId === folderId ? { ...f, inTrash: false, trashDate: undefined } : f
      )
    );
    addToast('success', 'Folder Restored', 'Folder and contents restored successfully.');
  };

  const handlePermanentlyDeleteFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    addToast('info', 'File Deleted Permanently');
  };

  const handlePermanentlyDeleteFolder = (folderId: string) => {
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    setFiles((prev) => prev.filter((f) => f.folderId !== folderId));
    addToast('info', 'Folder Deleted Permanently');
  };

  const handleEmptyTrash = () => {
    setFiles((prev) => prev.filter((f) => !f.inTrash));
    setFolders((prev) => prev.filter((f) => !f.inTrash));
    addToast('success', 'Trash Emptied', 'All items in trash have been purged permanently.');
  };

  const handleRename = (id: string, newName: string) => {
    // Check if file
    const file = files.find((f) => f.id === id);
    if (file) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, name: newName, updatedAt: new Date().toISOString() } : f
        )
      );
      addToast('success', 'Renamed', `File renamed to "${newName}".`);
      return;
    }

    // Check if folder
    const folder = folders.find((f) => f.id === id);
    if (folder) {
      setFolders((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, name: newName, updatedAt: new Date().toISOString() } : f
        )
      );
      addToast('success', 'Renamed', `Folder renamed to "${newName}".`);
    }
  };

  const handleMoveOrCopy = (
    itemId: string,
    targetFolderId: string | null,
    isCopy: boolean
  ) => {
    const file = files.find((f) => f.id === itemId);
    const targetFolder = targetFolderId ? folders.find((f) => f.id === targetFolderId) : null;
    const destName = targetFolder ? targetFolder.name : 'Root';

    if (file) {
      if (isCopy) {
        const copy: FileItem = {
          ...file,
          id: generateRandomId('file_copy'),
          name: `Copy of ${file.name}`,
          folderId: targetFolderId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setFiles((prev) => [...prev, copy]);
        addToast('success', 'Copied', `Created copy of "${file.name}" in ${destName}.`);
      } else {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === itemId
              ? { ...f, folderId: targetFolderId, updatedAt: new Date().toISOString() }
              : f
          )
        );
        addToast('success', 'Moved', `Moved "${file.name}" to ${destName}.`);
      }
      return;
    }

    const folder = folders.find((f) => f.id === itemId);
    if (folder) {
      if (!isCopy) {
        setFolders((prev) =>
          prev.map((f) =>
            f.id === itemId
              ? { ...f, parentId: targetFolderId, updatedAt: new Date().toISOString() }
              : f
          )
        );
        addToast('success', 'Moved', `Moved "${folder.name}" to ${destName}.`);
      }
    }
  };

  const handleCreateFolder = (name: string, color: string, parentId: string | null) => {
    const newFolder: FolderItem = {
      id: generateRandomId('fld'),
      name,
      parentId,
      color,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      starred: false,
      inTrash: false,
      sharedWith: [],
      ownerId: user.id,
    };
    setFolders((prev) => [...prev, newFolder]);
    addToast('success', 'Folder Created', `Folder "${name}" was created successfully.`);
  };

  const handleUploadSuccess = (newFiles: FileItem[]) => {
    setFiles((prev) => [...newFiles, ...prev]);
  };

  const handleUpdateShare = (
    item: FileItem | FolderItem,
    collaborators: FileCollaborator[],
    shareLinkConfig?: any
  ) => {
    if ('size' in item) {
      // It's a file
      setFiles((prev) =>
        prev.map((f) =>
          f.id === item.id
            ? { ...f, sharedWith: collaborators, shareLink: shareLinkConfig }
            : f
        )
      );
    } else {
      // It's a folder
      setFolders((prev) =>
        prev.map((f) =>
          f.id === item.id ? { ...f, sharedWith: collaborators } : f
        )
      );
    }
  };

  const handleAddTag = (fileId: string, tag: string) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === fileId) {
          const currentTags = f.tags || [];
          if (!currentTags.includes(tag)) {
            addToast('success', 'Tag added', `Tag #${tag} added.`);
            return { ...f, tags: [...currentTags, tag] };
          }
        }
        return f;
      })
    );
  };

  const handleDownload = (file: FileItem) => {
    downloadFile(file.name, file.url || file.contentPreview, file.mimeType);
    addToast('success', 'Download Started', `Downloading "${file.name}"...`);
  };

  // Breadcrumbs calculation
  const breadcrumbs = useMemo(() => {
    const crumbs: Array<{ id: string | null; name: string }> = [{ id: null, name: 'Home' }];
    if (!currentFolderId) return crumbs;

    let currId: string | null = currentFolderId;
    const path: Array<{ id: string; name: string }> = [];

    while (currId) {
      const match = folders.find((f) => f.id === currId);
      if (match) {
        path.unshift({ id: match.id, name: match.name });
        currId = match.parentId;
      } else {
        break;
      }
    }
    return [...crumbs, ...path];
  }, [currentFolderId, folders]);

  // Current folder info
  const currentFolder = useMemo(
    () => (currentFolderId ? folders.find((f) => f.id === currentFolderId) : null),
    [currentFolderId, folders]
  );

  // Filtered files & folders depending on the active tab and search
  const { displayedFolders, displayedFiles } = useMemo(() => {
    let baseFolders = folders.filter((f) => !f.inTrash);
    let baseFiles = files.filter((f) => !f.inTrash);

    // Apply Navigation Tab filters
    switch (currentTab) {
      case 'dashboard':
        // Shows root folders, plus recent files
        baseFolders = baseFolders.filter((f) => f.parentId === null);
        break;
      case 'files':
        // Shows folders and files strictly inside currentFolderId
        baseFolders = baseFolders.filter((f) => f.parentId === currentFolderId);
        baseFiles = baseFiles.filter((f) => f.folderId === currentFolderId);
        break;
      case 'recent':
        // Sort files by updatedAt descending, no folders
        baseFolders = [];
        break;
      case 'starred':
        baseFolders = baseFolders.filter((f) => f.starred);
        baseFiles = baseFiles.filter((f) => f.starred);
        break;
      case 'shared':
        baseFolders = baseFolders.filter((f) => f.sharedWith && f.sharedWith.length > 0);
        baseFiles = baseFiles.filter(
          (f) =>
            (f.sharedWith && f.sharedWith.length > 0) || (f.shareLink && f.shareLink.enabled)
        );
        break;
      case 'trash':
      case 'storage':
      case 'settings':
        break;
    }

    // Apply Search Query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      baseFolders = folders.filter(
        (f) => !f.inTrash && f.name.toLowerCase().includes(q)
      );
      baseFiles = files.filter(
        (f) =>
          !f.inTrash &&
          (f.name.toLowerCase().includes(q) ||
            f.extension.toLowerCase().includes(q) ||
            (f.tags && f.tags.some((t) => t.toLowerCase().includes(q))))
      );
    }

    // Apply File Type filter
    if (selectedTypeFilter !== 'all') {
      baseFiles = baseFiles.filter((f) => f.type === selectedTypeFilter);
    }

    // Apply Sorting
    baseFiles.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'date') {
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else if (sortField === 'size') {
        comparison = a.size - b.size;
      } else if (sortField === 'type') {
        comparison = a.type.localeCompare(b.type);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    baseFolders.sort((a, b) => a.name.localeCompare(b.name));

    return { displayedFolders: baseFolders, displayedFiles: baseFiles };
  }, [
    currentTab,
    currentFolderId,
    folders,
    files,
    searchQuery,
    selectedTypeFilter,
    sortField,
    sortDirection,
  ]);

  // Sidebar item counts
  const itemCounts = useMemo(() => {
    return {
      files: files.filter((f) => !f.inTrash).length,
      recent: files.filter((f) => !f.inTrash).length,
      starred:
        files.filter((f) => !f.inTrash && f.starred).length +
        folders.filter((f) => !f.inTrash && f.starred).length,
      shared: files.filter((f) => !f.inTrash && (f.sharedWith.length > 0 || f.shareLink?.enabled)).length,
      trash: files.filter((f) => f.inTrash).length + folders.filter((f) => f.inTrash).length,
    };
  }, [files, folders]);

  // Handle folder opening
  const handleOpenFolder = (folder: FolderItem) => {
    setCurrentFolderId(folder.id);
    setCurrentTab('files');
  };

  // Recent files slice for dashboard
  const recentFilesDashboard = useMemo(() => {
    return [...files]
      .filter((f) => !f.inTrash)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 6);
  }, [files]);

  return (
    <div id="cloudvault-app-root" className="min-h-screen bg-slate-50 flex text-slate-800">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Fullscreen Drag Overlay */}
      {isWindowDragOver && (
        <div
          id="window-drag-drop-overlay"
          className="fixed inset-0 z-50 bg-indigo-900/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white pointer-events-none animate-in fade-in duration-150"
        >
          <div className="w-24 h-24 rounded-3xl bg-white/20 border-2 border-white/40 flex items-center justify-center mb-4 scale-110 animate-bounce">
            <Upload className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Drop files here to upload</h2>
          <p className="text-sm text-indigo-100 mt-1">
            Files will be stored securely in {currentFolder ? currentFolder.name : 'CloudVault'}
          </p>
        </div>
      )}

      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'files') {
            setCurrentFolderId(null);
          }
        }}
        user={user}
        itemCounts={itemCounts}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenUpgradeModal={() => setCurrentTab('storage')}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Navbar */}
        <Navbar
          user={user}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTypeFilter={selectedTypeFilter}
          onTypeFilterChange={setSelectedTypeFilter}
          notifications={notifications}
          onMarkNotificationAsRead={markNotificationAsRead}
          onClearAllNotifications={clearAllNotifications}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenNewFolder={() => setIsNewFolderOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={() => {
            setUser({ ...initialUser, name: 'Guest User', email: 'guest@cloudvault.app' });
            addToast('info', 'Signed out', 'You are currently browsing as a guest.');
          }}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Page Content Body */}
        <main id="main-content-scroll" className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Quick Header Bar for Active Tab */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {/* Breadcrumbs Navigation */}
              {currentTab === 'files' ? (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1 flex-wrap">
                  {breadcrumbs.map((crumb, idx) => (
                    <React.Fragment key={crumb.id || 'root'}>
                      <button
                        onClick={() => setCurrentFolderId(crumb.id)}
                        className={`hover:text-indigo-600 font-medium transition-colors ${
                          idx === breadcrumbs.length - 1 ? 'text-slate-900 font-bold' : ''
                        }`}
                      >
                        {crumb.name}
                      </button>
                      {idx < breadcrumbs.length - 1 && (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ) : null}

              <div className="flex items-center gap-3">
                {currentFolderId && currentTab === 'files' && (
                  <button
                    id="folder-back-btn"
                    onClick={() => {
                      const parent = folders.find((f) => f.id === currentFolderId)?.parentId;
                      setCurrentFolderId(parent || null);
                    }}
                    className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                    title="Go back"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}

                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 capitalize">
                  {currentTab === 'files'
                    ? currentFolder
                      ? currentFolder.name
                      : 'My Files'
                    : currentTab === 'recent'
                    ? 'Recent Files'
                    : currentTab === 'starred'
                    ? 'Starred & Favorites'
                    : currentTab === 'shared'
                    ? 'Shared With Me'
                    : currentTab === 'trash'
                    ? 'Trash Archive'
                    : currentTab === 'storage'
                    ? 'Storage Analytics'
                    : 'Workspace Dashboard'}
                </h1>
              </div>

              <p className="text-xs text-slate-500 mt-0.5">
                {currentTab === 'dashboard' && 'Welcome back, Sarah! Here is an overview of your cloud storage workspace.'}
                {currentTab === 'files' && `${displayedFiles.length} files, ${displayedFolders.length} folders in this directory.`}
                {currentTab === 'recent' && 'Files viewed, uploaded, or updated recently.'}
                {currentTab === 'starred' && 'Quick access to your prioritized files and folders.'}
                {currentTab === 'shared' && 'Files with shared collaborator access and public links.'}
                {currentTab === 'trash' && 'Recover accidentally removed files or permanently purge storage.'}
                {currentTab === 'storage' && 'Analyze data distribution and upgrade quotas.'}
              </p>
            </div>

            {/* Top Toolbar Actions (Upload button, New folder, View switcher, Sort) */}
            {currentTab !== 'storage' && currentTab !== 'trash' && (
              <div className="flex items-center gap-2 flex-wrap">
                {/* Large "Upload Files" CTA Button from prompt */}
                <button
                  id="main-upload-files-btn"
                  onClick={() => setIsUploadOpen(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4 stroke-[2.2]" />
                  <span>Upload Files</span>
                </button>

                <button
                  id="main-new-folder-btn"
                  onClick={() => setIsNewFolderOpen(true)}
                  className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <FolderPlus className="w-4 h-4 text-amber-500" />
                  <span className="hidden sm:inline">New Folder</span>
                </button>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    id="sort-select-dropdown"
                    value={`${sortField}-${sortDirection}`}
                    onChange={(e) => {
                      const [field, dir] = e.target.value.split('-');
                      setSortField(field as SortField);
                      setSortDirection(dir as SortDirection);
                    }}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-indigo-500 shadow-2xs cursor-pointer"
                  >
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="name-asc">Name (A - Z)</option>
                    <option value="name-desc">Name (Z - A)</option>
                    <option value="size-desc">Size (Largest)</option>
                    <option value="size-asc">Size (Smallest)</option>
                    <option value="type-asc">File Type</option>
                  </select>
                </div>

                {/* Grid / List Switcher */}
                <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
                  <button
                    id="view-grid-btn"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="Grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    id="view-list-btn"
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Type Filter Pills */}
          {currentTab !== 'storage' && currentTab !== 'trash' && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-4 scrollbar-none text-xs">
              {(
                [
                  { id: 'all', label: 'All Files' },
                  { id: 'document', label: 'Documents' },
                  { id: 'image', label: 'Images' },
                  { id: 'spreadsheet', label: 'Spreadsheets' },
                  { id: 'video', label: 'Videos' },
                  { id: 'audio', label: 'Audio' },
                  { id: 'code', label: 'Code' },
                  { id: 'archive', label: 'Archives' },
                ] as const
              ).map((type) => (
                <button
                  key={type.id}
                  id={`filter-pill-${type.id}`}
                  onClick={() => setSelectedTypeFilter(type.id)}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedTypeFilter === type.id
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          )}

          {/* TAB 1: DASHBOARD VIEW */}
          {currentTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Storage Usage Card */}
              <StorageCard
                files={files}
                totalStorage={user.totalStorage}
                onViewAnalytics={() => setCurrentTab('storage')}
                onOpenUpgradeModal={() => setCurrentTab('storage')}
              />

              {/* Folders Section */}
              {displayedFolders.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Folder className="w-4 h-4 text-indigo-500" />
                      <span>Folders ({displayedFolders.length})</span>
                    </h3>
                    <button
                      onClick={() => setCurrentTab('files')}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      View all folders
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {displayedFolders.map((folder) => (
                      <FolderCard
                        key={folder.id}
                        folder={folder}
                        files={files}
                        allFolders={folders}
                        onClick={handleOpenFolder}
                        onStarToggle={handleStarToggleFolder}
                        onRename={(f) => setRenameItem(f)}
                        onMove={(f) => setMoveCopyItem({ item: f, isCopy: false })}
                        onDelete={handleDeleteFolder}
                        onDropFilesIntoFolder={(droppedFiles, targetId) => {
                          if (droppedFiles instanceof FileList) {
                            setIsUploadOpen(true);
                          } else {
                            // Moved internal file
                            droppedFiles.forEach((f) => handleMoveOrCopy(f.id, targetId, false));
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Files Section */}
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>Recent Files</span>
                  </h3>
                  <button
                    onClick={() => setCurrentTab('recent')}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    View all ({files.filter((f) => !f.inTrash).length})
                  </button>
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {recentFilesDashboard.map((file) => (
                      <FileCard
                        key={file.id}
                        file={file}
                        onPreview={(f) => setPreviewFile(f)}
                        onDownload={handleDownload}
                        onShare={(f) => setShareItem({ item: f, isFolder: false })}
                        onRename={(f) => setRenameItem(f)}
                        onMove={(f) => setMoveCopyItem({ item: f, isCopy: false })}
                        onCopy={(f) => setMoveCopyItem({ item: f, isCopy: true })}
                        onStarToggle={handleStarToggleFile}
                        onDelete={handleDeleteFile}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    {recentFilesDashboard.map((file) => (
                      <FileRow
                        key={file.id}
                        file={file}
                        folders={folders}
                        onPreview={(f) => setPreviewFile(f)}
                        onDownload={handleDownload}
                        onShare={(f) => setShareItem({ item: f, isFolder: false })}
                        onRename={(f) => setRenameItem(f)}
                        onMove={(f) => setMoveCopyItem({ item: f, isCopy: false })}
                        onCopy={(f) => setMoveCopyItem({ item: f, isCopy: true })}
                        onStarToggle={handleStarToggleFile}
                        onDelete={handleDeleteFile}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MY FILES / RECENT / STARRED / SHARED */}
          {(currentTab === 'files' ||
            currentTab === 'recent' ||
            currentTab === 'starred' ||
            currentTab === 'shared') && (
            <div className="space-y-6">
              {/* Subfolders Grid if any */}
              {displayedFolders.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Folders ({displayedFolders.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {displayedFolders.map((folder) => (
                      <FolderCard
                        key={folder.id}
                        folder={folder}
                        files={files}
                        allFolders={folders}
                        onClick={handleOpenFolder}
                        onStarToggle={handleStarToggleFolder}
                        onRename={(f) => setRenameItem(f)}
                        onMove={(f) => setMoveCopyItem({ item: f, isCopy: false })}
                        onDelete={handleDeleteFolder}
                        onDropFilesIntoFolder={(droppedFiles, targetId) => {
                          if (droppedFiles instanceof FileList) {
                            setIsUploadOpen(true);
                          } else {
                            droppedFiles.forEach((f) => handleMoveOrCopy(f.id, targetId, false));
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Files Grid or List */}
              {displayedFiles.length > 0 && (
                <div>
                  {displayedFolders.length > 0 && (
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Files ({displayedFiles.length})
                    </h3>
                  )}

                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {displayedFiles.map((file) => (
                        <FileCard
                          key={file.id}
                          file={file}
                          onPreview={(f) => setPreviewFile(f)}
                          onDownload={handleDownload}
                          onShare={(f) => setShareItem({ item: f, isFolder: false })}
                          onRename={(f) => setRenameItem(f)}
                          onMove={(f) => setMoveCopyItem({ item: f, isCopy: false })}
                          onCopy={(f) => setMoveCopyItem({ item: f, isCopy: true })}
                          onStarToggle={handleStarToggleFile}
                          onDelete={handleDeleteFile}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                      {displayedFiles.map((file) => (
                        <FileRow
                          key={file.id}
                          file={file}
                          folders={folders}
                          onPreview={(f) => setPreviewFile(f)}
                          onDownload={handleDownload}
                          onShare={(f) => setShareItem({ item: f, isFolder: false })}
                          onRename={(f) => setRenameItem(f)}
                          onMove={(f) => setMoveCopyItem({ item: f, isCopy: false })}
                          onCopy={(f) => setMoveCopyItem({ item: f, isCopy: true })}
                          onStarToggle={handleStarToggleFile}
                          onDelete={handleDeleteFile}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Empty State */}
              {displayedFolders.length === 0 && displayedFiles.length === 0 && (
                <div
                  id="tab-empty-state"
                  className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 text-slate-300 flex items-center justify-center mb-4">
                    <FolderOpen className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">No items found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">
                    {searchQuery
                      ? `No files matching "${searchQuery}". Try adjusting your keywords or filters.`
                      : currentTab === 'starred'
                      ? 'You have not starred any files or folders yet.'
                      : currentTab === 'shared'
                      ? 'No files have been shared with you or made public yet.'
                      : 'This directory is currently empty. Upload files or create a new folder.'}
                  </p>
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload to this folder</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TRASH VIEW */}
          {currentTab === 'trash' && (
            <TrashView
              files={files}
              folders={folders}
              onRestoreFile={handleRestoreFile}
              onRestoreFolder={handleRestoreFolder}
              onPermanentlyDeleteFile={handlePermanentlyDeleteFile}
              onPermanentlyDeleteFolder={handlePermanentlyDeleteFolder}
              onEmptyTrash={handleEmptyTrash}
            />
          )}

          {/* TAB 4: STORAGE ANALYTICS VIEW */}
          {currentTab === 'storage' && (
            <StorageAnalyticsView
              user={user}
              files={files}
              onOpenUpgradeModal={() => {
                addToast('success', 'Plan Upgraded', 'Your workspace was upgraded to Pro 2 TB!');
                setUser((prev) => ({ ...prev, plan: 'Pro', totalStorage: 2199023255552 }));
              }}
              onPreviewFile={(f) => setPreviewFile(f)}
              onDeleteFile={handleDeleteFile}
            />
          )}
        </main>
      </div>

      {/* MODALS */}
      {/* 1. File Preview Modal */}
      <FilePreviewModal
        file={previewFile}
        folders={folders}
        onClose={() => setPreviewFile(null)}
        onDownload={handleDownload}
        onShare={(f) => {
          setPreviewFile(null);
          setShareItem({ item: f, isFolder: false });
        }}
        onStarToggle={handleStarToggleFile}
        onAddTag={handleAddTag}
      />

      {/* 2. Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        folders={folders}
        currentFolderId={currentFolderId}
        onUploadSuccess={handleUploadSuccess}
        onToast={addToast}
      />

      {/* 3. New Folder Modal */}
      <NewFolderModal
        isOpen={isNewFolderOpen}
        currentFolderId={currentFolderId}
        onClose={() => setIsNewFolderOpen(false)}
        onCreateFolder={handleCreateFolder}
      />

      {/* 4. Share Modal */}
      <ShareModal
        item={shareItem ? shareItem.item : null}
        isFolder={shareItem ? shareItem.isFolder : false}
        onClose={() => setShareItem(null)}
        onUpdateShare={handleUpdateShare}
        onToast={addToast}
      />

      {/* 5. Rename Modal */}
      <RenameModal
        item={renameItem}
        isOpen={!!renameItem}
        onClose={() => setRenameItem(null)}
        onRename={handleRename}
      />

      {/* 6. Move / Copy Modal */}
      <MoveCopyModal
        item={moveCopyItem ? moveCopyItem.item : null}
        isOpen={!!moveCopyItem}
        folders={folders}
        currentFolderId={currentFolderId}
        isCopyMode={moveCopyItem ? moveCopyItem.isCopy : false}
        onClose={() => setMoveCopyItem(null)}
        onExecute={handleMoveOrCopy}
      />

      {/* 7. Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        user={user}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateUser={setUser}
        onToast={addToast}
      />

      {/* 8. Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={setUser}
        onToast={addToast}
      />

      {/* 9. Help & Shortcuts Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
