import React from 'react';
import { HelpCircle, X, Keyboard, Command, MousePointer, ShieldCheck, HardDrive } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '⌘ + K / Ctrl + K', description: 'Focus global file search' },
    { key: 'Esc', description: 'Close any active modal or preview' },
    { key: 'Drag & Drop', description: 'Drag files into viewport or into folder cards' },
    { key: 'Double Click / Click', description: 'Open instant high-resolution file preview' },
  ];

  const features = [
    {
      title: 'Instant Multi-Format Previews',
      desc: 'Preview images with zoom/rotate, PDFs, spreadsheet grids, syntax-highlighted code, videos, and audio files directly in the browser.',
    },
    {
      title: 'Shareable Links & Passwords',
      desc: 'Generate tokenized public links with optional password protection and download permissions.',
    },
    {
      title: 'Safe Trash & Restore',
      desc: 'Deleted items are held in the 30-day trash buffer and can be restored back to their original folder at any time.',
    },
    {
      title: 'Real Drag & Drop Uploads',
      desc: 'Drop files directly from your computer to store them in your workspace.',
    },
  ];

  return (
    <div
      id="help-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="help-modal-dialog"
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">CloudVault Guide & Shortcuts</h3>
              <p className="text-xs text-slate-500">Quick tips to navigate your storage workspace</p>
            </div>
          </div>
          <button
            id="help-modal-close-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Shortcuts */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Keyboard className="w-4 h-4 text-slate-500" />
              Keyboard & Gesture Shortcuts
            </h4>
            <div className="space-y-2">
              {shortcuts.map((s) => (
                <div
                  key={s.key}
                  className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs"
                >
                  <span className="text-slate-700 font-medium">{s.description}</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-slate-600 font-mono text-[11px] shadow-2xs font-semibold">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Storage Capabilities
            </h4>
            <div className="space-y-3">
              {features.map((f) => (
                <div key={f.title} className="p-3 rounded-xl border border-slate-100 bg-white">
                  <h5 className="text-xs font-bold text-slate-900 mb-0.5">{f.title}</h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            id="help-modal-done-btn"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
