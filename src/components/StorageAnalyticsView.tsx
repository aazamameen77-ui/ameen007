import React from 'react';
import {
  HardDrive,
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  Table2,
  Archive,
  FileCode,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Check,
  Trash2,
  Download,
  Eye,
} from 'lucide-react';
import { FileItem, User } from '../types';
import { formatBytes } from '../utils/formatters';

interface StorageAnalyticsViewProps {
  user: User;
  files: FileItem[];
  onOpenUpgradeModal: () => void;
  onPreviewFile: (file: FileItem) => void;
  onDeleteFile: (fileId: string) => void;
}

export const StorageAnalyticsView: React.FC<StorageAnalyticsViewProps> = ({
  user,
  files,
  onOpenUpgradeModal,
  onPreviewFile,
  onDeleteFile,
}) => {
  const activeFiles = files.filter((f) => !f.inTrash);
  const trashFiles = files.filter((f) => f.inTrash);
  const totalUsed = activeFiles.reduce((acc, f) => acc + f.size, 0);
  const totalTrash = trashFiles.reduce((acc, f) => acc + f.size, 0);
  const percentUsed = Math.min(100, Math.round((totalUsed / user.totalStorage) * 100));

  // Category breakdown
  const categories = [
    {
      name: 'Documents & PDFs',
      icon: <FileText className="w-5 h-5 text-blue-500" />,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      items: activeFiles.filter((f) => f.type === 'document'),
    },
    {
      name: 'High-Res Images',
      icon: <ImageIcon className="w-5 h-5 text-emerald-500" />,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      items: activeFiles.filter((f) => f.type === 'image'),
    },
    {
      name: 'Videos & Recordings',
      icon: <Film className="w-5 h-5 text-rose-500" />,
      color: 'bg-rose-500',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-100',
      items: activeFiles.filter((f) => f.type === 'video'),
    },
    {
      name: 'Audio & Podcasts',
      icon: <Music className="w-5 h-5 text-purple-500" />,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100',
      items: activeFiles.filter((f) => f.type === 'audio'),
    },
    {
      name: 'Sheets & Data',
      icon: <Table2 className="w-5 h-5 text-teal-500" />,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-100',
      items: activeFiles.filter((f) => f.type === 'spreadsheet'),
    },
    {
      name: 'Code & Repositories',
      icon: <FileCode className="w-5 h-5 text-indigo-500" />,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-100',
      items: activeFiles.filter((f) => f.type === 'code'),
    },
    {
      name: 'Compressed Archives',
      icon: <Archive className="w-5 h-5 text-amber-500" />,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
      items: activeFiles.filter((f) => f.type === 'archive'),
    },
  ];

  // Top largest files
  const largestFiles = [...activeFiles].sort((a, b) => b.size - a.size).slice(0, 5);

  const plans = [
    {
      name: 'Starter',
      storage: '15 GB',
      price: 'Free',
      current: false,
      features: ['Basic file sharing', 'Standard previews', '30-day trash'],
    },
    {
      name: 'Pro Workspace',
      storage: '2 TB (2,000 GB)',
      price: '$12 / month',
      current: true,
      popular: true,
      features: [
        'Advanced encrypted sharing',
        'High-speed streaming & chunking',
        'Team permission roles',
        'Password protected links',
        'Priority 24/7 support',
      ],
    },
    {
      name: 'Business Enterprise',
      storage: '10 TB (10,000 GB)',
      price: '$35 / month',
      current: false,
      features: [
        'Unlimited revision history',
        'Single Sign-On (SAML/Okta)',
        'SOC2 audit compliance logs',
        'Custom domain links',
        'Dedicated account manager',
      ],
    },
  ];

  return (
    <div id="storage-analytics-container" className="space-y-8">
      {/* Top Banner / Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Storage Quota Breakdown</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {formatBytes(totalUsed)} of {formatBytes(user.totalStorage)} Used
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              You have {formatBytes(user.totalStorage - totalUsed)} available in your {user.plan} plan.
            </p>

            {/* Meter Bar */}
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mt-4 p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-full transition-all duration-700"
                style={{ width: `${percentUsed}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              id="analytics-upgrade-banner-btn"
              onClick={onOpenUpgradeModal}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer text-center"
            >
              Upgrade Storage Plan
            </button>
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
          Usage by Category
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const catSize = cat.items.reduce((acc, f) => acc + f.size, 0);
            const catPercent = totalUsed > 0 ? Math.round((catSize / totalUsed) * 100) : 0;
            return (
              <div
                key={cat.name}
                className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-200 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${cat.bgColor} ${cat.borderColor} border flex items-center justify-center`}
                  >
                    {cat.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-400">{catPercent}%</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-600 truncate">{cat.name}</h4>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-base font-bold text-slate-900">{formatBytes(catSize)}</span>
                  <span className="text-xs text-slate-400">
                    {cat.items.length} {cat.items.length === 1 ? 'file' : 'files'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Largest Files Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Largest Files
          </h3>
          <span className="text-xs text-slate-500">Sorted by size</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
          {largestFiles.map((file) => (
            <div
              key={file.id}
              className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                  .{file.extension}
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-400">{file.mimeType}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="text-xs font-bold text-slate-900">{formatBytes(file.size)}</span>
                <button
                  id={`analytics-preview-file-${file.id}`}
                  onClick={() => onPreviewFile(file)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  id={`analytics-delete-file-${file.id}`}
                  onClick={() => onDeleteFile(file.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Move to trash"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plan comparison cards */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
          Available Storage Tiers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`p-6 rounded-3xl bg-white border flex flex-col justify-between transition-all ${
                p.popular
                  ? 'border-indigo-600 ring-2 ring-indigo-600/10 shadow-lg'
                  : 'border-slate-200 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-base font-bold text-slate-900">{p.name}</h4>
                  {p.current && (
                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                      Current Plan
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <span className="text-2xl font-black text-slate-900">{p.storage}</span>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{p.price}</p>
                </div>

                <div className="space-y-2.5 border-t border-slate-100 pt-4 mb-6">
                  {p.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                id={`plan-action-btn-${p.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={onOpenUpgradeModal}
                disabled={p.current}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                  p.current
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer'
                }`}
              >
                {p.current ? 'Active Plan' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
