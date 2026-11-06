import React, { useEffect, useState } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallButton: React.FC<{ className?: string; compact?: boolean }> = ({
  className = '',
  compact = false,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // Detect if already installed / standalone
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isAppleDevice);

    const handleBeforePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforePrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforePrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  if (isInstalled) return null;

  // Render button if installable or on iOS
  if (!deferredPrompt && !isIOS) return null;

  return (
    <>
      <button
        onClick={handleInstallClick}
        aria-label="Install Pillaiyarappa App on your device for fast offline ordering"
        className={`inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-[#222222] text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all font-semibold text-xs py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm ${className}`}
      >
        <Download className="w-3.5 h-3.5" aria-hidden="true" />
        <span>{compact ? 'Install' : 'Install App'}</span>
      </button>

      {/* iOS Safari Guide Modal */}
      {showIOSModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ios-install-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-sm rounded-2xl bg-[#1B1B1B] border border-[#2A2A2A] p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]">
              <h3 id="ios-install-title" className="text-base font-bold text-emerald-400">
                Install on iPhone / iPad
              </h3>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-md text-gray-400 hover:text-white"
                aria-label="Close install modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs">
                  1
                </span>
                <p>
                  Tap the <strong className="text-white">Share</strong> icon{' '}
                  <Share className="inline w-4 h-4 text-blue-400 align-text-bottom" /> in Safari's bottom toolbar.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs">
                  2
                </span>
                <p>
                  Scroll down and tap <strong className="text-white">Add to Home Screen</strong>{' '}
                  <PlusSquare className="inline w-4 h-4 text-green-400 align-text-bottom" />.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs">
                  3
                </span>
                <p>Launch Pillaiyarappa like a native app anytime, even without an internet connection!</p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-6 w-full rounded-xl bg-emerald-500 py-2.5 font-bold text-black hover:bg-emerald-400 transition"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
