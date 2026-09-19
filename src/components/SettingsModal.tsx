import React, { useState } from 'react';
import {
  X,
  User as UserIcon,
  Shield,
  HardDrive,
  Sliders,
  Check,
  Smartphone,
  Save,
  KeyRound,
} from 'lucide-react';
import { User, ViewMode } from '../types';
import { formatBytes } from '../utils/formatters';

interface SettingsModalProps {
  isOpen: boolean;
  user: User;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onClose: () => void;
  onUpdateUser: (updatedUser: User) => void;
  onToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  user,
  viewMode,
  onViewModeChange,
  onClose,
  onUpdateUser,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'storage' | 'security' | 'preferences'>('profile');

  // Form states
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [company, setCompany] = useState(user.company || '');
  const [twoFactor, setTwoFactor] = useState(user.twoFactorEnabled);
  const [trashDays, setTrashDays] = useState(user.autoEmptyTrashDays);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...user,
      name,
      role,
      company,
      twoFactorEnabled: twoFactor,
      autoEmptyTrashDays: trashDays,
    };
    onUpdateUser(updated);
    onToast('success', 'Profile updated', 'Your account settings have been saved successfully.');
    onClose();
  };

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="settings-modal-dialog"
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Account Settings</h3>
            <p className="text-xs text-slate-500">Manage your profile, security, and storage preferences</p>
          </div>
          <button
            id="settings-modal-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex border-b border-slate-100 px-6 gap-6 text-xs font-semibold">
          <button
            type="button"
            id="settings-tab-profile"
            onClick={() => setActiveTab('profile')}
            className={`py-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile</span>
          </button>

          <button
            type="button"
            id="settings-tab-storage"
            onClick={() => setActiveTab('storage')}
            className={`py-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'storage'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Storage & Plan</span>
          </button>

          <button
            type="button"
            id="settings-tab-security"
            onClick={() => setActiveTab('security')}
            className={`py-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'security'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Security</span>
          </button>

          <button
            type="button"
            id="settings-tab-preferences"
            onClick={() => setActiveTab('preferences')}
            className={`py-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'preferences'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Preferences</span>
          </button>
        </div>

        {/* Content area */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-100 shadow-sm"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{user.name}</h4>
                  <p className="text-xs text-slate-500">{user.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-semibold">
                    {user.plan} Plan Member
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  id="settings-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Job Role
                </label>
                <input
                  id="settings-role-input"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Organization / Company
                </label>
                <input
                  id="settings-company-input"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            </form>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-900">Current Plan</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                    {user.plan}
                  </span>
                </div>
                <p className="text-xs text-indigo-700">
                  You are utilizing {formatBytes(user.usedStorage)} of your {formatBytes(user.totalStorage)} storage limit.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 border border-slate-200 rounded-2xl">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Auto-Renew Subscription</h5>
                    <p className="text-[11px] text-slate-400">Renews on Oct 1, 2026 ($12/mo)</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600">Active</span>
                </div>

                <div className="flex items-center justify-between p-3.5 border border-slate-200 rounded-2xl">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Storage Rollover</h5>
                    <p className="text-[11px] text-slate-400">Unused bandwidth rolls over monthly</p>
                  </div>
                  <span className="text-xs font-semibold text-indigo-600">Enabled</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700">
                    <Smartphone className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Two-Factor Authentication (2FA)</h5>
                    <p className="text-[11px] text-slate-500">
                      Require an authentication app passcode when signing in.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  id="toggle-2fa-btn"
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    twoFactor ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      twoFactor ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 border border-slate-200 rounded-2xl">
                <h5 className="text-xs font-bold text-slate-900 mb-1">Active Sessions</h5>
                <p className="text-[11px] text-slate-500 mb-3">
                  You are currently logged in on this browser (Chrome on MacOS - Verified).
                </p>
                <button
                  type="button"
                  onClick={() => onToast('info', 'Sessions refreshed', 'All other browser sessions were logged out.')}
                  className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 rounded-xl transition-colors"
                >
                  Sign Out Other Devices
                </button>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Default File View Layout
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => onViewModeChange('grid')}
                    className={`flex-1 p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      viewMode === 'grid'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-1 ring-indigo-600'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Grid Cards View
                  </button>
                  <button
                    type="button"
                    onClick={() => onViewModeChange('list')}
                    className={`flex-1 p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      viewMode === 'list'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-1 ring-indigo-600'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    List Table View
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Auto-empty Trash Retention Period
                </label>
                <select
                  value={trashDays}
                  onChange={(e) => setTrashDays(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-indigo-500"
                >
                  <option value={7}>Purge after 7 days</option>
                  <option value={14}>Purge after 14 days</option>
                  <option value={30}>Purge after 30 days (Recommended)</option>
                  <option value={90}>Purge after 90 days</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            id="settings-cancel-btn"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            id="settings-save-all-btn"
            onClick={handleSaveProfile}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
