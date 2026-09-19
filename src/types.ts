export type FileType =
  | 'image'
  | 'document'
  | 'spreadsheet'
  | 'presentation'
  | 'video'
  | 'audio'
  | 'code'
  | 'archive'
  | 'other';

export interface FileCollaborator {
  id: string;
  email: string;
  name: string;
  role: 'viewer' | 'editor';
  avatar?: string;
  addedAt: string;
}

export interface ShareLinkConfig {
  enabled: boolean;
  code: string;
  passwordProtected?: boolean;
  password?: string;
  allowDownload: boolean;
  expiresAt?: string;
  accessCount?: number;
}

export interface FileItem {
  id: string;
  name: string;
  size: number; // in bytes
  type: FileType;
  mimeType: string;
  extension: string;
  folderId: string | null; // null represents root
  createdAt: string;
  updatedAt: string;
  starred: boolean;
  inTrash: boolean;
  trashDate?: string;
  sharedWith: FileCollaborator[];
  shareLink?: ShareLinkConfig;
  url?: string; // image thumbnail, mock doc viewer, or dataURL
  contentPreview?: string; // code snippet, markdown text, doc summary
  dimensions?: string; // e.g. "3840 x 2160"
  duration?: string; // e.g. "04:32"
  tags?: string[];
  ownerId: string;
  ownerName: string;
}

export interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
  color?: string; // tailwind color indicator e.g. 'indigo', 'emerald', 'amber', 'rose'
  createdAt: string;
  updatedAt: string;
  starred: boolean;
  inTrash: boolean;
  trashDate?: string;
  sharedWith: FileCollaborator[];
  ownerId: string;
}

export type ViewMode = 'grid' | 'list';

export type SortField = 'name' | 'date' | 'size' | 'type';
export type SortDirection = 'asc' | 'desc';

export type NavigationTab =
  | 'dashboard'
  | 'files'
  | 'recent'
  | 'starred'
  | 'shared'
  | 'trash'
  | 'storage'
  | 'settings';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  company?: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  usedStorage: number; // bytes
  totalStorage: number; // bytes
  twoFactorEnabled: boolean;
  autoEmptyTrashDays: number;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'share' | 'upload' | 'security' | 'storage';
  fileId?: string;
}

export interface UploadProgressItem {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'completed' | 'error' | 'paused';
  file?: File;
  folderId: string | null;
}
