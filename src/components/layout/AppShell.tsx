import { type ReactNode } from 'react';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import OfflineBanner from './OfflineBanner';
import { usePWAStatus } from '../../hooks/usePWAStatus';

interface AppShellProps {
  children: ReactNode;
  onShare: () => void;
}

export default function AppShell({ children, onShare }: AppShellProps) {
  const { isOffline } = usePWAStatus();

  return (
    <div className="fixed inset-0 flex flex-col bg-bg overflow-hidden">
      <OfflineBanner isOffline={isOffline} />
      <TopBar onShare={onShare} />
      <main className="flex-1 overflow-hidden flex flex-col">{children}</main>
      <BottomNav />
    </div>
  );
}
