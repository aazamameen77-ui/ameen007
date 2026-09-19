import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  X,
  Bell,
  HelpCircle,
  Menu,
  Plus,
  FolderPlus,
  Upload,
  User as UserIcon,
  LogOut,
  Settings,
  Shield,
  ExternalLink,
  Check,
} from 'lucide-react';
import { User, AppNotification, FileType } from '../types';
import { formatDate } from '../utils/formatters';

interface NavbarProps {
  user: User | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTypeFilter: FileType | 'all';
  onTypeFilterChange: (type: FileType | 'all') => void;
  notifications: AppNotification[];
  onMarkNotificationAsRead: (id: string) => void;
  onClearAllNotifications: () => void;
  onOpenUpload: () => void;
  onOpenNewFolder: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  searchQuery,
  onSearchChange,
  selectedTypeFilter,
  onTypeFilterChange,
  notifications,
  onMarkNotificationAsRead,
  onClearAllNotifications,
  onOpenUpload,
  onOpenNewFolder,
  onOpenSettings,
  onOpenHelp,
  onOpenAuth,
  onLogout,
  onToggleMobileSidebar,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNewMenu, setShowNewMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const newMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Handle outside click to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (newMenuRef.current && !newMenuRef.current.contains(e.target as Node)) {
        setShowNewMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header
      id="top-navbar"
      className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between gap-4"
    >
      {/* Left: Mobile hamburger & search */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <button
          id="navbar-hamburger-btn"
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="global-search-input"
            ref={searchInputRef}
            type="text"
            placeholder="Search files, folders, tags... (⌘K)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:outline-hidden rounded-xl text-sm text-slate-800 placeholder-slate-400 transition-all"
          />
          {searchQuery && (
            <button
              id="clear-search-btn"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right controls: Upload action, Notifications, Help, User Profile */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* "+ New" Dropdown Button */}
        <div className="relative" ref={newMenuRef}>
          <button
            id="navbar-new-dropdown-btn"
            onClick={() => setShowNewMenu(!showNewMenu)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">New</span>
          </button>

          {showNewMenu && (
            <div
              id="navbar-new-menu"
              className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <button
                id="menu-upload-file-btn"
                onClick={() => {
                  setShowNewMenu(false);
                  onOpenUpload();
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-3 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 text-indigo-500" />
                <span>Upload Files</span>
              </button>
              <button
                id="menu-create-folder-btn"
                onClick={() => {
                  setShowNewMenu(false);
                  onOpenNewFolder();
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-3 transition-colors cursor-pointer"
              >
                <FolderPlus className="w-4 h-4 text-amber-500" />
                <span>New Folder</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            id="navbar-notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span
                id="navbar-unread-badge"
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white"
              />
            )}
          </button>

          {showNotifications && (
            <div
              id="notifications-panel"
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden"
            >
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                  <p className="text-xs text-slate-500">{unreadCount} unread updates</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    id="mark-all-read-btn"
                    onClick={onClearAllNotifications}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-sm text-slate-400">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      id={`notif-item-${n.id}`}
                      onClick={() => onMarkNotificationAsRead(n.id)}
                      className={`p-3.5 flex gap-3 items-start transition-colors cursor-pointer hover:bg-slate-50 ${
                        !n.read ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      <div className="mt-0.5 w-2 h-2 rounded-full shrink-0 mt-1.5">
                        {!n.read ? (
                          <div className="w-2 h-2 rounded-full bg-indigo-600" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-slate-200" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                          <span className="text-[10px] text-slate-400">
                            {formatDate(n.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                          {n.description}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Help button */}
        <button
          id="navbar-help-btn"
          onClick={onOpenHelp}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Help and shortcuts"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* User Profile Dropdown or Sign In Button */}
        {user ? (
          <div className="relative" ref={userMenuRef}>
            <button
              id="navbar-user-avatar-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="User account menu"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-2xs"
              />
              <span className="text-xs font-semibold text-slate-700 hidden md:block max-w-[100px] truncate">
                {user.name.split(' ')[0]}
              </span>
            </button>

            {showUserMenu && (
              <div
                id="user-profile-dropdown"
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold">
                    <Shield className="w-3 h-3" />
                    <span>{user.plan} Workspace Plan</span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    id="profile-dropdown-settings-btn"
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenSettings();
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Account Settings</span>
                  </button>
                  <button
                    id="profile-dropdown-help-btn"
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenHelp();
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    <span>Keyboard Shortcuts</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    id="profile-dropdown-logout-btn"
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            id="navbar-signin-btn"
            onClick={onOpenAuth}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
