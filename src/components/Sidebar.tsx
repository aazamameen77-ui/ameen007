import React from 'react';
import {
  LayoutDashboard,
  FolderClosed,
  Clock,
  Star,
  Users2,
  Trash2,
  HardDrive,
  Cloud,
  Sparkles,
  ChevronRight,
  X,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { NavigationTab, User } from '../types';
import { formatBytes } from '../utils/formatters';

interface SidebarProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  user: User;
  itemCounts: {
    files: number;
    recent: number;
    starred: number;
    shared: number;
    trash: number;
  };
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenUpgradeModal: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  user,
  itemCounts,
  isOpenMobile,
  onCloseMobile,
  onOpenUpgradeModal,
  onOpenSettings,
}) => {
  const percentUsed = Math.min(100, Math.round((user.usedStorage / user.totalStorage) * 100));

  const navItems: Array<{
    id: NavigationTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'files',
      label: 'My Files',
      icon: <FolderClosed className="w-5 h-5" />,
      badge: itemCounts.files,
    },
    {
      id: 'recent',
      label: 'Recent',
      icon: <Clock className="w-5 h-5" />,
      badge: itemCounts.recent,
    },
    {
      id: 'starred',
      label: 'Starred',
      icon: <Star className="w-5 h-5" />,
      badge: itemCounts.starred,
    },
    {
      id: 'shared',
      label: 'Shared with Me',
      icon: <Users2 className="w-5 h-5" />,
      badge: itemCounts.shared,
    },
    {
      id: 'trash',
      label: 'Trash',
      icon: <Trash2 className="w-5 h-5" />,
      badge: itemCounts.trash,
    },
    {
      id: 'storage',
      label: 'Storage & Plans',
      icon: <HardDrive className="w-5 h-5" />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo Section */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Cloud className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900">CloudVault</span>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-indigo-600 leading-none">
                  Enterprise Cloud
                </span>
              </div>
            </div>

            <button
              id="sidebar-close-mobile-btn"
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4 space-y-1">
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Workspace
            </div>
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    onTabChange(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50/80 text-indigo-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Settings Link */}
          <div className="px-3 pt-2">
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Preferences
            </div>
            <button
              id="nav-link-settings"
              onClick={() => {
                onOpenSettings();
                onCloseMobile();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-slate-400" />
                <span>Account Settings</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Storage Meter Widget in Bottom of Sidebar */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-indigo-600" />
                Cloud Storage
              </span>
              <span className="text-xs font-bold text-slate-900">{percentUsed}%</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${percentUsed}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3">
              <span>{formatBytes(user.usedStorage)} used</span>
              <span>{formatBytes(user.totalStorage)}</span>
            </div>

            <button
              id="sidebar-upgrade-cta-btn"
              onClick={onOpenUpgradeModal}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              Upgrade to 2 TB
            </button>
          </div>

          {/* Security badge */}
          <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-bit AES Encrypted</span>
          </div>
        </div>
      </aside>
    </>
  );
};
