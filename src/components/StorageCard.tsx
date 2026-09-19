import React from 'react';
import {
  HardDrive,
  FileText,
  Image as ImageIcon,
  Film,
  Table2,
  Archive,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { FileItem } from '../types';
import { formatBytes } from '../utils/formatters';

interface StorageCardProps {
  files: FileItem[];
  totalStorage: number;
  onViewAnalytics: () => void;
  onOpenUpgradeModal: () => void;
}

export const StorageCard: React.FC<StorageCardProps> = ({
  files,
  totalStorage,
  onViewAnalytics,
  onOpenUpgradeModal,
}) => {
  // Calculate usage by category from non-trash files
  const activeFiles = files.filter((f) => !f.inTrash);
  const totalUsed = activeFiles.reduce((acc, f) => acc + f.size, 0);

  const categories = [
    {
      id: 'document',
      name: 'Documents',
      icon: <FileText className="w-4 h-4 text-blue-500" />,
      color: 'bg-blue-500',
      size: activeFiles
        .filter((f) => f.type === 'document' || f.type === 'code')
        .reduce((acc, f) => acc + f.size, 0),
    },
    {
      id: 'image',
      name: 'Images',
      icon: <ImageIcon className="w-4 h-4 text-emerald-500" />,
      color: 'bg-emerald-500',
      size: activeFiles
        .filter((f) => f.type === 'image')
        .reduce((acc, f) => acc + f.size, 0),
    },
    {
      id: 'media',
      name: 'Video & Audio',
      icon: <Film className="w-4 h-4 text-rose-500" />,
      color: 'bg-rose-500',
      size: activeFiles
        .filter((f) => f.type === 'video' || f.type === 'audio')
        .reduce((acc, f) => acc + f.size, 0),
    },
    {
      id: 'spreadsheet',
      name: 'Spreadsheets',
      icon: <Table2 className="w-4 h-4 text-teal-500" />,
      color: 'bg-teal-500',
      size: activeFiles
        .filter((f) => f.type === 'spreadsheet' || f.type === 'presentation')
        .reduce((acc, f) => acc + f.size, 0),
    },
    {
      id: 'archive',
      name: 'Archives & Other',
      icon: <Archive className="w-4 h-4 text-amber-500" />,
      color: 'bg-amber-500',
      size: activeFiles
        .filter((f) => f.type === 'archive' || f.type === 'other')
        .reduce((acc, f) => acc + f.size, 0),
    },
  ];

  const percentUsed = Math.min(100, Math.round((totalUsed / totalStorage) * 100));

  return (
    <div
      id="dashboard-storage-card"
      className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs relative overflow-hidden"
    >
      {/* Background ambient accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-50/70 via-purple-50/20 to-transparent pointer-events-none rounded-bl-full" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
            <HardDrive className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Cloud Storage Usage</h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3" />
                Healthy
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              <span className="font-semibold text-slate-800">{formatBytes(totalUsed)}</span> of{' '}
              {formatBytes(totalStorage)} utilized ({percentUsed}%)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="storage-card-details-btn"
            onClick={onViewAnalytics}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Analytics</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <button
            id="storage-card-upgrade-btn"
            onClick={onOpenUpgradeModal}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Segmented Progress Bar */}
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex gap-0.5 mb-5 p-0.5 border border-slate-200/50">
        {categories.map((cat) => {
          const categoryRatio = totalUsed > 0 ? (cat.size / totalUsed) * percentUsed : 0;
          if (categoryRatio < 0.5) return null;
          return (
            <div
              key={cat.id}
              className={`h-full ${cat.color} rounded-sm transition-all duration-500`}
              style={{ width: `${categoryRatio}%` }}
              title={`${cat.name}: ${formatBytes(cat.size)}`}
            />
          );
        })}
      </div>

      {/* Category breakdown pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${cat.color}`} />
              <span className="text-xs font-medium text-slate-600 truncate">{cat.name}</span>
            </div>
            <p className="text-sm font-bold text-slate-900">{formatBytes(cat.size)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
