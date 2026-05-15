import { useState, useEffect } from 'react';

export interface PWAStatus {
  isOffline: boolean;
  isInstallable: boolean;
  needsUpdate: boolean;
}

export function usePWAStatus(): PWAStatus {
  const [status, setStatus] = useState<PWAStatus>({
    isOffline: !navigator.onLine,
    isInstallable: false,
    needsUpdate: false,
  });

  useEffect(() => {
    const handleOnline = () => setStatus(s => ({ ...s, isOffline: false }));
    const handleOffline = () => setStatus(s => ({ ...s, isOffline: true }));
    const handleInstall = () => setStatus(s => ({ ...s, isInstallable: true }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleInstall);
    };
  }, []);

  return status;
}
