import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, justSyncedCount } = useOnlineStatus();

  if (justSyncedCount > 0) {
    return (
      <aside
        aria-live="polite"
        className="fixed bottom-20 sm:bottom-6 left-4 z-50 flex items-center gap-2.5 rounded-lg bg-emerald-800 px-3.5 py-2 text-xs font-semibold text-white shadow-xl animate-fade-in border border-emerald-500"
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-300" aria-hidden="true" />
        <span>Connected! Synced {justSyncedCount} offline enquiry{justSyncedCount > 1 ? 's' : ''}.</span>
      </aside>
    );
  }

  if (isOnline) return null;

  return (
    <aside
      aria-live="polite"
      className="fixed bottom-20 sm:bottom-6 left-4 z-50 flex items-center gap-2.5 rounded-lg bg-[#E23744] px-3.5 py-2 text-xs font-semibold text-white shadow-xl border border-red-400 animate-pulse"
    >
      <WifiOff className="w-4 h-4 text-white" aria-hidden="true" />
      <div>
        <p className="leading-tight">Offline Mode</p>
        <p className="text-[10px] text-red-100 font-normal">Browsing cached menu &amp; offline storage active</p>
      </div>
    </aside>
  );
};
