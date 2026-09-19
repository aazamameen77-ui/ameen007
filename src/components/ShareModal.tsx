import React, { useState } from 'react';
import {
  Share2,
  X,
  Link,
  Copy,
  Check,
  Globe,
  Lock,
  UserPlus,
  Shield,
  Trash2,
  Mail,
  ChevronDown,
} from 'lucide-react';
import { FileItem, FolderItem, FileCollaborator } from '../types';
import { generateRandomId } from '../utils/fileHelpers';

interface ShareModalProps {
  item: FileItem | FolderItem | null;
  isFolder?: boolean;
  onClose: () => void;
  onUpdateShare: (
    updatedItem: FileItem | FolderItem,
    collaborators: FileCollaborator[],
    shareLinkConfig?: any
  ) => void;
  onToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  item,
  isFolder = false,
  onClose,
  onUpdateShare,
  onToast,
}) => {
  if (!item) return null;

  const [emailInput, setEmailInput] = useState('');
  const [roleInput, setRoleInput] = useState<'viewer' | 'editor'>('viewer');
  const [collaborators, setCollaborators] = useState<FileCollaborator[]>(item.sharedWith || []);

  const existingLink = (item as FileItem).shareLink;
  const [linkEnabled, setLinkEnabled] = useState(existingLink?.enabled || false);
  const [passwordProtected, setPasswordProtected] = useState(existingLink?.passwordProtected || false);
  const [password, setPassword] = useState(existingLink?.password || '');
  const [allowDownload, setAllowDownload] = useState(
    existingLink?.allowDownload !== undefined ? existingLink.allowDownload : true
  );
  const [copied, setCopied] = useState(false);

  const shareCode = existingLink?.code || `cv-${Math.random().toString(36).substring(2, 8)}`;
  const shareUrl = `${window.location.origin}/share/${shareCode}`;

  const handleAddCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) {
      onToast('error', 'Invalid email address', 'Please enter a valid email to share with.');
      return;
    }

    if (collaborators.some((c) => c.email.toLowerCase() === emailInput.toLowerCase())) {
      onToast('warning', 'Already shared', 'This user already has access to this item.');
      return;
    }

    const name = emailInput.split('@')[0].replace('.', ' ');
    const newCollab: FileCollaborator = {
      id: generateRandomId('collab'),
      email: emailInput.trim(),
      name: name.charAt(0).toUpperCase() + name.slice(1),
      role: roleInput,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
      addedAt: new Date().toISOString(),
    };

    const nextCollabs = [...collaborators, newCollab];
    setCollaborators(nextCollabs);
    setEmailInput('');

    onUpdateShare(item, nextCollabs, {
      enabled: linkEnabled,
      code: shareCode,
      passwordProtected,
      password,
      allowDownload,
    });

    onToast('success', 'Invitation sent', `Shared with ${newCollab.email} as ${roleInput}.`);
  };

  const handleRemoveCollaborator = (collabId: string) => {
    const nextCollabs = collaborators.filter((c) => c.id !== collabId);
    setCollaborators(nextCollabs);
    onUpdateShare(item, nextCollabs, {
      enabled: linkEnabled,
      code: shareCode,
      passwordProtected,
      password,
      allowDownload,
    });
    onToast('info', 'Access removed', 'Collaborator permission revoked.');
  };

  const handleToggleLink = () => {
    const nextState = !linkEnabled;
    setLinkEnabled(nextState);
    onUpdateShare(item, collaborators, {
      enabled: nextState,
      code: shareCode,
      passwordProtected,
      password,
      allowDownload,
    });

    if (nextState) {
      onToast('success', 'Public link activated', 'Anyone with the link can now access.');
    } else {
      onToast('info', 'Public link disabled', 'Link access has been revoked.');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    onToast('success', 'Link copied', 'Shareable link copied to your clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="share-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="share-modal-dialog"
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Share "{item.name}"</h3>
              <p className="text-xs text-slate-500">Collaborate with your team or share links</p>
            </div>
          </div>
          <button
            id="share-modal-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close share modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Section 1: Invite Collaborators */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Invite people or teams
            </label>
            <form onSubmit={handleAddCollaborator} className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  id="share-email-input"
                  type="email"
                  placeholder="name@company.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <select
                id="share-role-select"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value as 'viewer' | 'editor')}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-indigo-500"
              >
                <option value="viewer">Can View</option>
                <option value="editor">Can Edit</option>
              </select>

              <button
                type="submit"
                id="share-send-invite-btn"
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0"
              >
                Invite
              </button>
            </form>
          </div>

          {/* Collaborator List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              People with access
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {/* Owner item */}
              <div className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                    SJ
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">Sarah Jenkins (You)</p>
                    <p className="text-[10px] text-slate-400 truncate">sarah.jenkins@acmecorp.io</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-md">
                  Owner
                </span>
              </div>

              {collaborators.map((c) => (
                <div
                  key={c.id}
                  id={`collab-row-${c.id}`}
                  className="p-2.5 bg-white rounded-xl border border-slate-200/70 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={c.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                      alt={c.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{c.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{c.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-indigo-700 bg-indigo-50 font-medium px-2 py-0.5 rounded-md capitalize">
                      {c.role}
                    </span>
                    <button
                      id={`remove-collab-btn-${c.id}`}
                      onClick={() => handleRemoveCollaborator(c.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title="Remove access"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: General Access & Shareable Link */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Shareable Link</h4>
                  <p className="text-[11px] text-slate-500">
                    {linkEnabled ? 'Anyone with the link can view' : 'Only invited members can view'}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                id="share-link-toggle-btn"
                type="button"
                onClick={handleToggleLink}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  linkEnabled ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    linkEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {linkEnabled && (
              <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 animate-in fade-in duration-150">
                {/* Link Bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-600 truncate">
                    {shareUrl}
                  </div>
                  <button
                    id="copy-share-link-btn"
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Additional Link Controls */}
                <div className="pt-2 border-t border-slate-200/60 flex flex-col gap-2 text-xs">
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowDownload}
                      onChange={(e) => setAllowDownload(e.target.checked)}
                      className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Allow viewers to download original file</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={passwordProtected}
                      onChange={(e) => setPasswordProtected(e.target.checked)}
                      className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Protect link with password</span>
                  </label>

                  {passwordProtected && (
                    <input
                      type="password"
                      placeholder="Set access password..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-indigo-500"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            id="share-modal-done-btn"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
